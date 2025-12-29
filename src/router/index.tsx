import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "@/layouts/AdminLayout";
import Login from "@/routes/Login.tsx";
import LoginTest from "@/routes/loginTest.tsx";
import Dashboard from "@/routes/Dashboard";
import Employee from "@/routes/Employee";
// import App from "@/App";
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
        element: <AdminLayout />,
        children: [
            {
                index: true,
                element: <Dashboard />,
                handle: { label: '工作台', icon: "dashboard" }
            },
            {
                path: "login-test",
                element: <LoginTest />,
                handle: { label: '登录测试', icon: "inform" }
            },
            {
                path: "employee",
                element: <Employee />,
                handle: { label: '员工管理', icon: "inform" }
            }
            // { path: "users", element: <UserList /> },
        ],
        // ErrorBoundary: RootErrorBoundary,
    },
    {
        path: "/login",
        Component: Login,
        // lazy: () => import("../routes/login"),
    }
]);