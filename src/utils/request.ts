import axios from 'axios'
import { store } from "@/store";
import {logout} from "@/services/authService.ts";


const http = axios.create({
    baseURL: "/api/admin",
    'timeout': 600000
})


// do just before sending request
http.interceptors.request.use(
    (config) => {

        const token = store.getState().auth.token;
        if (token){
            config.headers['token'] = token;
        } else if (config.url !== '/employee/login') {
            window.location.href = '/login';
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// do just after receiving response
http.interceptors.response.use(
    (res) => res.data,
    (error) => {
        if (error.response.data.status === 401 || error.status === 401) logout();

        console.error("API Error:", error);
        return Promise.reject(error);
    }
);


export default http
