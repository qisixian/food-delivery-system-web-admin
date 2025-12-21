import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import Login from "@/routes/login.tsx";
import LoginSuccess from "@/routes/loginSuccess.tsx";
// import RootErrorBoundary from "@/app/ErrorBoundary";

// 小工具：登录态（示例）
// function isAuthed() {
//     const token = localStorage.getItem("token");
//     return Boolean(token);
// }
//
// // 保护路由：推荐用 loader 做 redirect（比组件里 useEffect 更干净）
// async function requireAuth() {
//     if (!isAuthed()) throw redirect("/login");
//     return null;
// }

export const router = createBrowserRouter([
    {
        path: "/",
        Component: App,
        // ErrorBoundary: RootErrorBoundary,
    },
    {
        path: "/login",
        Component: Login,
        // lazy: () => import("../routes/login"),
    },
    {
        path: "/login-success",
        Component: LoginSuccess,
    }
]);