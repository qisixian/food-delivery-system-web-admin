import Typography from "@mui/material/Typography";
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {Paper, Stack} from "@mui/material";
import { LineChart } from '@mui/x-charts/LineChart';
import React, {useState} from "react";


function Statistics() {

    const [tabValue, setTabValue] = useState('1');

    const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
    };

    const sample1 = [130, 100, 150, 120, 160, 90, 100];
    const average1 = [120, 120, 120, 120, 120, 120, 120];

    const dates = ["1-1", "1-2", "1-3", "1-4", "1-5", "1-6", "1-7"];

    return (
        <>
            <Stack spacing={2}>
                <Box sx={{width: '100%'}}>
                    <Box>
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            aria-label="basic tabs example"
                        >
                            <Tab label="昨日" value="1"/>
                            <Tab label="近七日" value="2"/>
                            <Tab label="近30日" value="3"/>
                            <Tab label="本周" value="4"/>
                            <Tab label="本月" value="5"/>
                        </Tabs>
                    </Box>
                </Box>
                <Stack direction={"row"} spacing={2}>
                    <Paper elevation={0} sx={{width: '100%', p: 2}}>
                        <Typography variant='h5'>营业额统计</Typography>
                        <Box sx={{width: '100%', maxWidth: 500}}>
                            <LineChart
                                xAxis={[{data: dates, scaleType: 'point'}]}
                                yAxis={[
                                    {id: 'linearAxis', scaleType: 'linear'}
                                ]}
                                series={[
                                    {data: sample1, label: "data"},
                                    {data: average1, label: "average"}
                                ]}
                                height={400}
                            />
                        </Box>
                    </Paper>
                    <Paper elevation={0} sx={{width: '100%', p: 2}}>
                        <Typography variant='h5'>用户统计</Typography>
                        <Box sx={{width: '100%', maxWidth: 500}}>
                            <LineChart
                                xAxis={[{data: dates, scaleType: 'point'}]}
                                yAxis={[
                                    {id: 'linearAxis', scaleType: 'linear'}
                                ]}
                                series={[
                                    {data: sample1, label: "data"},
                                    {data: average1, label: "average"}
                                ]}
                                height={400}
                            />
                        </Box>
                    </Paper>
                </Stack>
                <Stack direction={"row"} spacing={2}>
                    <Paper elevation={0} sx={{width: '100%', p: 2}}>
                        <Typography variant='h5'>订单统计</Typography>
                        <Box sx={{width: '100%', maxWidth: 500}}>
                            <LineChart
                                xAxis={[{data: dates, scaleType: 'point'}]}
                                yAxis={[
                                    {id: 'linearAxis', scaleType: 'linear'}
                                ]}
                                series={[
                                    {data: sample1, label: "data"},
                                    {data: average1, label: "average"}
                                ]}
                                height={400}
                            />
                        </Box>
                    </Paper>
                    <Paper elevation={0} sx={{width: '100%', p: 2}}>
                        <Typography variant='h5'>销量排名Top10</Typography>
                    </Paper>
                </Stack>
            </Stack>
        </>
    );
}

export default Statistics;
