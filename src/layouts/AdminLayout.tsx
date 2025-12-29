// src/layout/AdminLayout.tsx
import React from "react";
import {NavLink, Outlet} from "react-router-dom";
import { router } from "@/router";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {IconButton} from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import {getUsername} from "@/utils/cookies.ts";
import { logout } from "@/services/authService";
import HomeIcon from '@mui/icons-material/Home';
import logo from '@/assets/login/logo.png';


const drawerWidth = 240;

type SidebarHandle = {
    label: string;
    icon?: string;
};

function getAdminMenuItems() {
    // react-router 的 router.routes 是可用的；TS 可能需要 any
    const routes = (router as any).routes as any[];
    const adminRoute = routes.find((r) => r.path === "/");
    const children = (adminRoute?.children ?? []) as any[];

    return children
        .map((r) => {
            const handle = r.handle as SidebarHandle;
            const to = r.index ? "/" : `/${r.path}`;
            return { to, label: handle.label, icon: handle.icon };
        });
}

function AdminLayout() {
    const items = React.useMemo(() => getAdminMenuItems(), []);

    const username = getUsername();

    return (
        <Box sx={{ display: 'flex' }}>


            <CssBaseline />

            <AppBar
                position="fixed"
                elevation={0}
                sx={{backgroundColor: "#ffc100",
                    color: "#000",
                    zIndex: (theme) => theme.zIndex.drawer + 1 }}
            >
                <Toolbar>
                    <Box
                        component="img"
                        src={logo}
                        alt="苍穹外卖"
                        sx={{
                            height: 36,        // 控制 logo 高度
                            width: "auto",
                        }}
                    />
                    <Box sx={{ flexGrow: 1 }} />
                    <Typography variant="h6" noWrap component="div">
                        {username}
                    </Typography>
                    <IconButton size="large" color="inherit" onClick={logout}>
                        <LogoutIcon />
                    </IconButton>


                </Toolbar>
            </AppBar>

            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        backgroundColor: "rgb(52, 55, 68)",},
                    color: "#fff"
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        {items.map((item) => (
                            <ListItem key={item.label} disablePadding>
                                <ListItemButton
                                    component={NavLink}
                                    to={item.to}
                                    sx={{
                                        "&.active": {
                                            backgroundColor: "rgba(255,255,255,0.12)",
                                        },
                                        "&:hover": {
                                            backgroundColor: "rgba(255,255,255,0.08)",
                                        },
                                    }}
                                >
                                    <ListItemIcon>
                                        {/*<Box*/}
                                        {/*    component="img"*/}
                                        {/*    src={`/src/assets/icons/sideBar/${item.icon}.svg`}*/}
                                        {/*    alt={item.label}*/}
                                        {/*    sx={{ width: 20, height: 20 }}*/}
                                        {/*/>*/}
                                        <HomeIcon sx={{ color: "#fff" }}/>
                                    </ListItemIcon>
                                    <ListItemText primary={item.label} sx={{ color: "#fff" }}/>
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                }}
            >
                {/* 给 fixed AppBar 占位 */}
                <Toolbar />

                {/* 这里才是真正的页面内容 */}
                <Outlet />
            </Box>
        </Box>
    );
}

export default AdminLayout;