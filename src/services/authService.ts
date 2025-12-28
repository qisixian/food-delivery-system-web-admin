import { login } from "@/api/employee";
import { store } from "@/store";
import { setToken, clearToken } from "@/store/authSlice";
import {removeUsername, setUsername} from "@/utils/cookies";

export async function loginService(username: string, password: string) {

    const response = await login({
        username: username,
        password: password
    })
    if (String(response.code) !== '1') {
        throw new Error(response.msg || '登录失败');
    }
    console.log('Login successful:', response);
    store.dispatch(setToken(response.data.token));
    setUsername(response.data.name);

    return response;
}

export function logout() {

    store.dispatch(clearToken());
    removeUsername();

    // 在组件外使用 react router 好像很麻烦
    // TODO: This causes a full page reload and should be improved
    window.location.replace("/login");
}