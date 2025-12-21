import axios from 'axios'
import { store } from "@/store";


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
        } else if (config.url !== '/login') {
            window.location.href = '/login';
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// do just after receiving response
http.interceptors.response.use(
    (response) => {
        // if (response.data.status === 401) {
        //     这样用有问题，在组件外使用 react router 好像很麻烦？
        //     router.push('/login')
        // }
        // console.log("API Response:", response);
        return response.data;
    },
    (error) => {
        console.error("API Error:", error);
        return Promise.reject(error);
    }
);


export default http
