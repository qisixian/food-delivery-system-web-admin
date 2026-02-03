import Typography from "@mui/material/Typography";
import {Paper, Stack} from "@mui/material";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {DatePicker} from "@mui/x-date-pickers";
import React, {useState} from "react";

function Order() {

    const [tabValue, setTabValue] = useState('1');

    const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
    };

    return (
        <>
            <Stack spacing={2} sx={{height: '100%'}}>
                <Box sx={{width: '100%'}}>
                    <Box>
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            aria-label="basic tabs example"
                        >
                            <Tab label="全部订单" value="1"/>
                            <Tab label="待接单" value="2"/>
                            <Tab label="待派送" value="3"/>
                            <Tab label="派送中" value="4"/>
                            <Tab label="已完成" value="5"/>
                            <Tab label="已取消" value="6"/>
                        </Tabs>
                    </Box>
                </Box>
                <Paper elevation={0} sx={{width: '100%', p: 2, minHeight: '70vh'}}>
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={2}
                        sx={{mb: 2, mt: 1, flexWrap: 'wrap'}}
                    >
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                            <Typography>
                                订单号：
                            </Typography>
                            <TextField
                                sx={{ml: 0}}
                                size="small"
                                placeholder="按订单号查询"
                                // onChange={(e) =>
                                //     setForm((prev) =>
                                //         ({ ...prev, name: e.target.value }))}
                            />
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                            <Typography>
                                手机号：
                            </Typography>
                            <TextField
                                sx={{ml: 0}}
                                size="small"
                                placeholder="按手机号查询"
                                // onChange={(e) =>
                                //     setForm((prev) =>
                                //         ({ ...prev, name: e.target.value }))}
                            />
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                            <Typography>
                                下单时间：
                            </Typography>

                            <DatePicker
                                label="from"
                                sx={{maxWidth: 166}}
                                slotProps={{
                                    textField: {
                                        size: 'small',
                                    },
                                }}
                            />
                            <DatePicker
                                label="to"
                                sx={{maxWidth: 166}}
                                slotProps={{
                                    textField: {
                                        size: 'small',
                                    },
                                }}
                            />
                        </Stack>
                        <Button
                            variant="contained"
                            // onClick={pageQuery}
                        >
                            查询
                        </Button>

                    </Stack>
                </Paper>
            </Stack>
        </>
    );
}

export default Order;
