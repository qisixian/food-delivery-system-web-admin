import {Box} from "@mui/material";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import loginImage from '@/assets/login/login-l.png';
import logo from '@/assets/login/logo.png';
import AccountIcon from '@mui/icons-material/AccountCircleOutlined';
import PasswordIcon from '@mui/icons-material/LockOutlined';
import InputAdornment from '@mui/material/InputAdornment';
import { Snackbar, Alert } from "@mui/material";
import { useState } from "react";
import { loginService } from "@/services/authService";
import { useNavigate } from "react-router-dom";


function Login() {

    type AlertType = "success" | "error" | "warning" | "info";
    const [form, setForm] = useState({
        username: "admin",
        password: "123456"
    });
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        type: AlertType;
    }>({
        open: false,
        message: "",
        type: "success",
    });
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleClick = async () => {
        if (loading) return; // 防止连点
        setLoading(true);

        try {
            console.log('Attempting login with:', form);

            const response = await loginService(form.username, form.password);

            setSnackbar({
                open: true,
                message:
                    "登录成功，后端返回token：\n" + String(response.data.token),
                type: "success",
            });

            navigate("/", { replace: true });
        } catch (error) {
            console.error('Login failed:', error);
            // 这里不应该在这里处理，应该在 axios response interceptor 处理是不是
            setSnackbar({
                open: true,
                message: "登录失败，显示失败原因的代码还没写",
                type: "error",
            });
        } finally{
            setLoading(false);
        }
    };

    return (

        <Box
            sx={{
                minHeight: "100vh",          // 占满整个视口
                minWidth: "100vw",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: "#333",             // 页面背景色
            }}
        >
            <Card sx={{ display: "flex" }}>
                <Box sx={{ display: "flex"}}>
                    <CardMedia
                        sx={{ width: 400, height: 300,}}
                        image={loginImage}
                    />
                </Box>
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    justifyContent: "space-evenly",
                }}>
                    <CardContent sx={{
                        display: "flex",
                        flex: 1,
                        justifyContent: "space-evenly",
                        flexDirection: "column"
                    }}>
                        <Box
                            component="img"
                            src={logo}
                            alt="苍穹外卖 Logo"
                            sx={{
                                height: 48,        // 控制 logo 高度
                                width: "auto",
                            }}
                        />
                        <TextField
                            id="standard-basic"
                            label="Username"
                            variant="standard"
                            value={form.username}
                            onChange={(e) =>
                                setForm((prev) =>
                                    ({ ...prev, username: e.target.value }))
                            }
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccountIcon />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />
                        <TextField
                            id="standard-password-input"
                            label="Password"
                            type="password"
                            autoComplete="current-password"
                            variant="standard"
                            value={form.password}
                            onChange={(e) =>
                                setForm((prev) =>
                                    ({ ...prev, password: e.target.value }))
                            }
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PasswordIcon />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleClick();
                            }}
                        />
                    </CardContent>
                    <CardActions sx={{ justifyContent: "center" }}>
                        <Button variant="outlined" onClick={handleClick} disabled={loading}>登录</Button>
                    </CardActions>
                    <Snackbar
                        open={snackbar.open}
                        autoHideDuration={3000}
                        anchorOrigin={{ vertical: "top", horizontal: "center" }}
                        onClose={() => setSnackbar({ ...snackbar, open: false })}
                        sx={{ whiteSpace: "pre-line" }}
                    >
                        <Alert severity={snackbar.type} variant="filled">
                            {snackbar.message}
                        </Alert>
                    </Snackbar>
                </Box>
            </Card>
        </Box>
    )
}

export default Login
