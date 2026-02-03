import {Paper, Stack} from "@mui/material";
import {useTheme, alpha} from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import PendingOrdersIcon from "@/assets/icons/dashboard_pending_orders.png"
import PendingDeliveryIcon from "@/assets/icons/dashboard_pending_delivery.png"
import AllOrdersIcon from "@/assets/icons/dashboard_all_orders.png"
import CompletedOrdersIcon from "@/assets/icons/dashboard_completed_orders.png"
import CancelledOrdersIcon from "@/assets/icons/dashboard_cancelled_orders.png"
import EnableIcon from "@/assets/icons/dashboard_enable.png"
import DisableIcon from "@/assets/icons/dashboard_disable.png"
import MoreIcon from "@/assets/icons/icon_more.png"
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {fetchDishPage} from "@/api/dish.ts";
import {Status} from "@/constants";
import {fetchSetmealPage} from "@/api/setMeal.ts";


function Dashboard() {

    const navigate = useNavigate();
    const theme = useTheme();

    const [dishEnabledCount, setDishEnabledCount] = useState(0);
    const [dishDisabledCount, setDishDisabledCount] = useState(0);
    const [setmealEnabledCount, setSetmealEnabledCount] = useState(0);
    const [setmealDisabledCount, setSetmealDisabledCount] = useState(0);

    useEffect(() => {
        fetchDishPage({ status: Status.Enabled, page: 0, pageSize: 0 })
            .then(res => {
                if (res.code === 1 && res.data) {
                    setDishEnabledCount(res.data.total);
                } else {
                    console.error("Failed to fetch enabled dish count:", res.msg);
                }
            })
            .catch(e => console.error("Failed to fetch enabled dish counts:", e));
        fetchDishPage({ status: Status.Disabled, page: 0, pageSize: 0 })
            .then(res => {
                if (res.code === 1 && res.data) {
                    setDishDisabledCount(res.data.total);
                } else {
                    console.error("Failed to fetch disabled dish count:", res.msg);
                }
            })
            .catch(e => console.error("Failed to fetch disabled dish counts:", e));
        fetchSetmealPage({ status: Status.Enabled, page: 0, pageSize: 0 })
            .then(res => {
                if (res.code === 1 && res.data) {
                    setSetmealEnabledCount(res.data.total);
                } else {
                    console.error("Failed to fetch enabled setmeal count:", res.msg);
                }
            })
            .catch(e => console.error("Failed to fetch enabled setmeal counts:", e));
        fetchSetmealPage({ status: Status.Disabled, page: 0, pageSize: 0 })
            .then(res => {
                if (res.code === 1 && res.data) {
                    setSetmealDisabledCount(res.data.total);
                } else {
                    console.error("Failed to fetch disabled setmeal count:", res.msg);
                }
            })
            .catch(e => console.error("Failed to fetch disabled setmeal counts:", e));
    }, []);

    return (
        <>
            <Stack spacing={2}>
                <Paper elevation={0} sx={{ width: '100%', p: 2 }}>
                    <Stack spacing={2}>
                        <Stack direction='row' spacing={2}
                               sx={{
                                   justifyContent: "space-between",
                                   alignItems: "center",
                               }}
                        >
                            <Typography variant='h5'>今日数据</Typography>
                            <Stack direction='row' sx={{ alignItems: "center" }}>
                                <Button
                                    variant="text"
                                    sx={{
                                        py: 0,
                                        px: 1,
                                        minHeight: 'auto',
                                        lineHeight: 'inherit',
                                        textTransform: 'none',
                                        color: theme.palette.grey[600],
                                        "& .MuiButton-endIcon": {
                                            marginLeft: 0,
                                        },
                                    }}
                                    endIcon={
                                        <Box
                                            component="img"
                                            src={MoreIcon}
                                            alt=""
                                            sx={{ width: 16, height: 16 }}
                                        />
                                    }
                                    onClick={()=> navigate("/statistics")}
                                >
                                    详细数据
                                </Button>
                            </Stack>
                        </Stack>
                        <Stack direction='row' spacing={2}>
                            <Paper elevation={0} sx={{ width: '100%', p: 2 ,bgcolor: alpha(theme.palette.primary.main,0.1)}}>
                                <Typography variant='h6'>营业额</Typography>
                                <Typography variant="h4" fontWeight={600}>
                                    ¥2,523
                                </Typography>
                            </Paper>
                            <Paper elevation={0} sx={{ width: '100%', p: 2 ,bgcolor: alpha(theme.palette.primary.main,0.1)}}>
                                <Typography variant='h6'>有效订单</Typography>
                                <Typography variant="h4" fontWeight={600}>
                                    58
                                </Typography>
                            </Paper>
                            <Paper elevation={0} sx={{ width: '100%', p: 2 ,bgcolor: alpha(theme.palette.primary.main,0.1)}}>
                                <Typography variant='h6'>订单完成率</Typography>
                                <Typography variant="h4" fontWeight={600}>
                                    88%
                                </Typography>
                            </Paper>
                            <Paper elevation={0} sx={{ width: '100%', p: 2 ,bgcolor: alpha(theme.palette.primary.main,0.1)}}>
                                <Typography variant='h6'>平均客单价</Typography>
                                <Typography variant="h4" fontWeight={600}>
                                    43.5
                                </Typography>
                            </Paper>
                            <Paper elevation={0} sx={{ width: '100%', p: 2 ,bgcolor: alpha(theme.palette.primary.main,0.1)}}>
                                <Typography variant='h6'>新增用户</Typography>
                                <Typography variant="h4" fontWeight={600}>
                                    2
                                </Typography>
                            </Paper>
                        </Stack>
                    </Stack>
                </Paper>
                <Paper elevation={0} sx={{ width: '100%', p: 2 }}>
                    <Stack spacing={2}>
                        <Stack direction='row' spacing={2}
                               sx={{
                                   justifyContent: "space-between",
                                   alignItems: "center",
                               }}
                        >
                            <Typography variant='h5'>订单总览</Typography>
                            <Stack direction='row' sx={{ alignItems: "center" }}>
                                <Button
                                    variant="text"
                                    sx={{
                                        py: 0,
                                        px: 1,
                                        minHeight: 'auto',
                                        lineHeight: 'inherit',
                                        textTransform: 'none',
                                        color: theme.palette.grey[600],
                                        "& .MuiButton-endIcon": {
                                            marginLeft: 0,
                                        },
                                    }}
                                    endIcon={
                                        <Box
                                            component="img"
                                            src={MoreIcon}
                                            alt=""
                                            sx={{ width: 16, height: 16 }}
                                        />
                                    }
                                    onClick={()=> navigate("/order")}
                                >
                                    订单管理
                                </Button>
                            </Stack>
                        </Stack>
                        <Stack direction='row' spacing={2}>
                            <Paper elevation={0} sx={{ width: '100%', p: 2 ,bgcolor: alpha(theme.palette.primary.main,0.1)}}>
                                <Stack direction='row' spacing={2}
                                       sx={{
                                           justifyContent: "space-between",
                                           alignItems: "center",
                                       }}>
                                    <Stack direction='row'spacing={1}>
                                        <Box
                                            component="img"
                                            src={PendingOrdersIcon}
                                            alt=""
                                            sx={{ width: 30, height: 30 }}
                                        />
                                        <Typography variant='h6'>待接单</Typography>
                                    </Stack>
                                    <Typography variant="h4" fontWeight={600} color="error">
                                        0
                                    </Typography>
                                </Stack>
                            </Paper>
                            <Paper elevation={0} sx={{ width: '100%', p: 2 ,bgcolor: alpha(theme.palette.primary.main,0.1)}}>
                                <Stack direction='row' spacing={2}
                                       sx={{
                                           justifyContent: "space-between",
                                           alignItems: "center",
                                       }}>
                                    <Stack direction='row'spacing={1}>
                                        <Box
                                            component="img"
                                            src={PendingDeliveryIcon}
                                            alt=""
                                            sx={{ width: 30, height: 30 }}
                                        />
                                        <Typography variant='h6'>待派送</Typography>
                                    </Stack>
                                    <Typography variant="h4" fontWeight={600} color="error">
                                        0
                                    </Typography>
                                </Stack>
                            </Paper>
                            <Paper elevation={0} sx={{ width: '100%', p: 2 ,bgcolor: alpha(theme.palette.primary.main,0.1)}}>
                                <Stack direction='row' spacing={2}
                                       sx={{
                                           justifyContent: "space-between",
                                           alignItems: "center",
                                       }}>
                                    <Stack direction='row'spacing={1}>
                                        <Box
                                            component="img"
                                            src={CompletedOrdersIcon}
                                            alt=""
                                            sx={{ width: 30, height: 30 }}
                                        />
                                        <Typography variant='h6'>已完成</Typography>
                                    </Stack>
                                    <Typography variant="h4" fontWeight={600}>
                                        58
                                    </Typography>
                                </Stack>
                            </Paper>
                            <Paper elevation={0} sx={{ width: '100%', p: 2 ,bgcolor: alpha(theme.palette.primary.main,0.1)}}>
                                <Stack direction='row' spacing={2}
                                       sx={{
                                           justifyContent: "space-between",
                                           alignItems: "center",
                                       }}>
                                    <Stack direction='row'spacing={1}>
                                        <Box
                                            component="img"
                                            src={CancelledOrdersIcon}
                                            alt=""
                                            sx={{ width: 30, height: 30 }}
                                        />
                                        <Typography variant='h6'>已取消</Typography>
                                    </Stack>
                                    <Typography variant="h4" fontWeight={600}>
                                        3
                                    </Typography>
                                </Stack>
                            </Paper>
                            <Paper elevation={0} sx={{ width: '100%', p: 2 ,bgcolor: alpha(theme.palette.primary.main,0.1)}}>
                                <Stack direction='row' spacing={2}
                                       sx={{
                                           justifyContent: "space-between",
                                           alignItems: "center",
                                       }}>
                                    <Stack direction='row'spacing={1}>
                                        <Box
                                            component="img"
                                            src={AllOrdersIcon}
                                            alt=""
                                            sx={{ width: 30, height: 30 }}
                                        />
                                        <Typography variant='h6'>全部订单</Typography>
                                    </Stack>
                                    <Typography variant="h4" fontWeight={600}>
                                        61
                                    </Typography>
                                </Stack>
                            </Paper>
                        </Stack>
                    </Stack>
                </Paper>
                <Stack direction='row' spacing={2}>
                    <Paper elevation={0} sx={{ width: '100%', p: 2 }}>
                        <Stack spacing={2}>
                            <Stack direction='row' spacing={2}
                                   sx={{
                                       justifyContent: "space-between",
                                       alignItems: "center",
                                   }}
                            >
                                <Typography variant='h5'>菜品总览</Typography>
                                <Stack direction='row' sx={{ alignItems: "center" }}>
                                    <Button
                                        variant="text"
                                        sx={{
                                            py: 0,
                                            px: 1,
                                            minHeight: 'auto',
                                            lineHeight: 'inherit',
                                            textTransform: 'none',
                                            color: theme.palette.grey[600],
                                            "& .MuiButton-endIcon": {
                                                marginLeft: 0,
                                            },
                                        }}
                                        endIcon={
                                            <Box
                                                component="img"
                                                src={MoreIcon}
                                                alt=""
                                                sx={{ width: 16, height: 16 }}
                                            />
                                        }
                                        onClick={()=> navigate("/dish")}
                                    >
                                        菜品管理
                                    </Button>
                                </Stack>
                            </Stack>
                            <Stack direction='row' spacing={2}>
                                <Paper elevation={0} sx={{ width: '100%', p: 2 ,bgcolor: alpha(theme.palette.primary.main,0.1)}}>
                                    <Stack direction='row' spacing={2}
                                           sx={{
                                               justifyContent: "space-between",
                                               alignItems: "center",
                                           }}>
                                        <Stack direction='row'spacing={1}>
                                            <Box
                                                component="img"
                                                src={EnableIcon}
                                                alt=""
                                                sx={{ width: 30, height: 30 }}
                                            />
                                            <Typography variant='h6'>已起售</Typography>
                                        </Stack>
                                        <Typography variant="h4" fontWeight={600}>
                                            {dishEnabledCount}
                                        </Typography>
                                    </Stack>
                                </Paper>
                                <Paper elevation={0} sx={{ width: '100%', p: 2 ,bgcolor: alpha(theme.palette.primary.main,0.1)}}>
                                    <Stack direction='row' spacing={2}
                                           sx={{
                                               justifyContent: "space-between",
                                               alignItems: "center",
                                           }}>
                                        <Stack direction='row'spacing={1}>
                                            <Box
                                                component="img"
                                                src={DisableIcon}
                                                alt=""
                                                sx={{ width: 30, height: 30 }}
                                            />
                                            <Typography variant='h6'>已停售</Typography>
                                        </Stack>
                                        <Typography variant="h4" fontWeight={600}>
                                            {dishDisabledCount}
                                        </Typography>
                                    </Stack>
                                </Paper>
                            </Stack>
                        </Stack>
                    </Paper>
                    <Paper elevation={0} sx={{ width: '100%', p: 2 }}>
                        <Stack spacing={2}>
                            <Stack direction='row' spacing={2}
                                   sx={{
                                       justifyContent: "space-between",
                                       alignItems: "center",
                                   }}
                            >
                                <Typography variant='h5'>套餐总览</Typography>
                                <Stack direction='row' sx={{ alignItems: "center" }}>
                                    <Button
                                        variant="text"
                                        sx={{
                                            py: 0,
                                            px: 1,
                                            minHeight: 'auto',
                                            lineHeight: 'inherit',
                                            textTransform: 'none',
                                            color: theme.palette.grey[600],
                                            "& .MuiButton-endIcon": {
                                                marginLeft: 0,
                                            },
                                        }}
                                        endIcon={
                                            <Box
                                                component="img"
                                                src={MoreIcon}
                                                alt=""
                                                sx={{ width: 16, height: 16 }}
                                            />
                                        }
                                        onClick={()=> navigate("/setmeal")}
                                    >
                                        套餐管理
                                    </Button>
                                </Stack>
                            </Stack>
                            <Stack direction='row' spacing={2}>
                                <Paper elevation={0} sx={{ width: '100%', p: 2 ,bgcolor: alpha(theme.palette.primary.main,0.1)}}>
                                    <Stack direction='row' spacing={2}
                                           sx={{
                                               justifyContent: "space-between",
                                               alignItems: "center",
                                           }}>
                                        <Stack direction='row'spacing={1}>
                                            <Box
                                                component="img"
                                                src={EnableIcon}
                                                alt=""
                                                sx={{ width: 30, height: 30 }}
                                            />
                                            <Typography variant='h6'>已起售</Typography>
                                        </Stack>
                                        <Typography variant="h4" fontWeight={600}>
                                            {setmealEnabledCount}
                                        </Typography>
                                    </Stack>
                                </Paper>
                                <Paper elevation={0} sx={{ width: '100%', p: 2 ,bgcolor: alpha(theme.palette.primary.main,0.1)}}>
                                    <Stack direction='row' spacing={2}
                                           sx={{
                                               justifyContent: "space-between",
                                               alignItems: "center",
                                           }}>
                                        <Stack direction='row'spacing={1}>
                                            <Box
                                                component="img"
                                                src={DisableIcon}
                                                alt=""
                                                sx={{ width: 30, height: 30 }}
                                            />
                                            <Typography variant='h6'>已停售</Typography>
                                        </Stack>
                                        <Typography variant="h4" fontWeight={600}>
                                            {setmealDisabledCount}
                                        </Typography>
                                    </Stack>
                                </Paper>
                            </Stack>
                        </Stack>
                    </Paper>
                </Stack>
                <Paper elevation={0} sx={{ width: '100%', p: 2 }}>
                    <Typography variant='h5'>待处理订单</Typography>
                </Paper>
            </Stack>
        </>
    )
}

export default Dashboard;
