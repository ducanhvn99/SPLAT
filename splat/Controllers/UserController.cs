﻿using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using splat.Models;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace splat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Policy = "RequireAdministratorRole")]
    public class UserController : Controller
    {
        private readonly SplatContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly IConfiguration _configuration;

        public UserController(
            SplatContext context,
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            RoleManager<ApplicationRole> roleManager,
            IConfiguration configuration)
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _configuration = configuration;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginModel login)
        {
            var loginUser = new ApplicationUser
            {
                UserName = login.UserName
            };

            var signinValid = await _userManager.CheckPasswordAsync(loginUser , login.Password);

            if(!signinValid)
            {
                // return generic login failure
                return BadRequest(new { message = "Username or password is incorrect" });
            }

            var user = await _userManager.FindByNameAsync(loginUser.UserName);

            if (user == null)
            {
                var signinSucceeded = await Register(loginUser);

                if (!signinSucceeded) return BadRequest();
            }

            await _signInManager.SignInAsync(loginUser, true);
            
            
            IdentityOptions _options = new IdentityOptions();

            var roles = await _userManager.GetRolesAsync(user);
            // return success and token
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, login.UserName),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(_options.ClaimsIdentity.UserNameClaimType, user.UserName),
                new Claim("username", user.UserName),
                new Claim("role", roles.Count == 0 ? "" : roles[0])
            };

            var token = new JwtSecurityToken
            (
                claims: claims,
                expires: DateTime.UtcNow.AddDays(60),
                notBefore: DateTime.UtcNow,
                signingCredentials: new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Token:Key"])),
                    SecurityAlgorithms.HmacSha256)
            );

            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                user = new
                {
                    name = user.Name,
                    email = user.UserName,
                    role = _userManager.GetRolesAsync(user).Result[0]
                }
            });
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();

            return Ok(new { message = "Signed out successfully" });
        }

        public async Task<bool> Register(ApplicationUser newUser)
        {
            if (newUser == null) return false;

            newUser.Email = newUser.UserName;

            var result = await _userManager.CreateAsync(newUser);
            await _userManager.AddToRoleAsync(newUser, "Student");

            return result.Succeeded;
        }
    }
}
