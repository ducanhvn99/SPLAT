import { authRequest, baseRequest } from "../api/genericRequest";
import User from '../../models/User';
import axios from "axios";

type LoginResponse = {
    user: User;
    token: string;
}

export async function login(username: string, password: string, onSuccess: () => void) {
    let res = await baseRequest.post<LoginResponse>('user/login', { userName: username, password: password });
    let user = res.data.user;
    user.authHeader = { token: 'Bearer ' + res.data.token };
    localStorage.setItem('userInfo', JSON.stringify(user));
    onSuccess();
}

export async function logout() {
    try {
        await axios.post('user/logout');
    } catch(err) {

    } finally {
        localStorage.removeItem('userInfo');
    }
}

export function getCurrentUserInfo(): User | null {
    let infoStr: string | null = localStorage.getItem('userInfo');

    return infoStr === null ? null : JSON.parse(infoStr);
}

export function getLoggedIn(): boolean {
    return Boolean(getCurrentUserInfo());
}

export function getAuthToken(): string | undefined {
    const user: User | null = getCurrentUserInfo();

    if(user !== null) {
        return user.authHeader?.token;
    }

    return undefined;
}
