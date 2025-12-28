import Cookies from "js-cookie";

const usernameKey = 'username';
export const getUsername = () => Cookies.get(usernameKey);
export const setUsername = (username: string) => Cookies.set(usernameKey, username);
export const removeUsername = () => Cookies.remove(usernameKey);