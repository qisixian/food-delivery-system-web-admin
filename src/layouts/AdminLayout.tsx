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
// import InboxIcon from '@mui/icons-material/MoveToInbox';
// import MailIcon from '@mui/icons-material/Mail';

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
    console.log('Admin menu items:', items);

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        苍穹外卖
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        {items.map((item) => (
                            <ListItem key={item.label} disablePadding>
                                <ListItemButton component={NavLink} to={item.to}>
                                    <ListItemIcon>
                                        <Box
                                            component="img"
                                            src={`/src/assets/icons/sideBar/${item.icon}.svg`}
                                            alt={item.label}
                                            sx={{ width: 20, height: 20 }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText primary={item.label} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
            <Outlet/>
        </Box>
    );
}

export default AdminLayout;