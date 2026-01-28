import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "@/layouts/AdminLayout";
import Login from "@/routes/Login.tsx";
import LoginTest from "@/routes/loginTest.tsx";
import Dashboard from "@/routes/Dashboard";
import Employee from "@/routes/Employee";
import AddEmployee from "@/routes/AddEmployee.tsx";
import Setmeal from "@/routes/Setmeal.tsx";
import Dish from "@/routes/Dish.tsx";
import Category from "@/routes/Category.tsx";
import Statistics from "@/routes/Statistics.tsx";
import Order from "@/routes/Order.tsx";
import AddDish from "@/routes/AddDish.tsx";
import AddSetmeal from "@/routes/AddSetmeal.tsx";

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
                path: "statistics",
                element: <Statistics />,
                handle: { label: '数据统计', icon: "statistics" }
            },
            {
                path: "order",
                element: <Order />,
                handle: { label: '订单管理', icon: "order" }
            },
            {
                path: "setmeal",
                element: <Setmeal />,
                handle: { label: '套餐管理', icon: "setmeal" }
            },
            {
                path: "dish",
                element: <Dish />,
                handle: { label: '菜品管理', icon: "dish" }
            },
            {
                path: "category",
                element: <Category />,
                handle: { label: '分类管理', icon: "category" }
            },
            {
                path: "employee",
                element: <Employee />,
                handle: { label: '员工管理', icon: "employee" }
            },
            {
                path: "login-test",
                element: <LoginTest />,
                handle: { label: '登录测试', icon: "test" }
            },
            {
                path: "employee",
                children: [
                    { path: "add", element: <AddEmployee /> },
                    { path: "edit/:id", element: <AddEmployee /> },
                ],
                handle: { label: '添加员工', hidden: true }
            },
            {
                path: "dish",
                children: [
                    { path: "add", element: <AddDish /> },
                    { path: "edit/:id", element: <AddDish /> },
                ],
                handle: { label: '添加菜品', hidden: true }
            },
            {
                path: "setmeal",
                children: [
                    { path: "add", element: <AddSetmeal /> },
                    { path: "edit/:id", element: <AddSetmeal /> },
                ],
                handle: { label: '添加套餐', hidden: true }
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