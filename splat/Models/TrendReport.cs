﻿using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace splat.Models
{
    [Keyless]
    public class TrendReport
    {
        public TrendEntry[] Entries { get; set; }
    }

    [Keyless]
    public class TrendEntry
    {
        public Item Item { get; set; }
        public int RequestCount { get; set; }
    }
}
