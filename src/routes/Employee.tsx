import Button from "@mui/material/Button";
import {Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React, {useState} from "react";
import {getEmployeeList} from "@/api/employee";


function Employee() {

    const [form, setForm] = useState({
        name: ""
    });

    const [list, setList] = useState<
        {
            id: number;
            username: string;
            name: string;
            phone: string;
            // sex: number;
            // idNumber: string;
            status: number;
            updateTime: string;
        }[]
    >([]);

    const pageQuery = async () => {
        console.log("hii! pageQuery comes!")
        try {
            const response = await getEmployeeList({
                page: 1,
                pageSize: 10,
                name: form.name
            });
            console.log("Employee list response:", response);
            setList(response.data.records);

            console.log("list:", list);
        } catch (error) {
            console.error("Failed to fetch employee list:", error);
        }
    }

    function createData(
        name: string,
        calories: number,
        fat: number,
        carbs: number,
        protein: number,
    ) {
        return { name, calories, fat, carbs, protein };
    }

    const rows = [
        createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
        createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
        createData('Eclair', 262, 16.0, 24, 6.0),
        createData('Cupcake', 305, 3.7, 67, 4.3),
        createData('Gingerbread', 356, 16.0, 49, 3.9),
    ];

    return (
        <>

            <Paper sx={{ p: 2, mb: 2 }}>
            <Toolbar disableGutters
                     sx={{ mb: 2, gap: 2 }}
            >
                <Typography>
                    员工姓名：
                </Typography>
                <TextField
                    size="small"
                    placeholder="请输入员工姓名"
                    onChange={(e) =>
                       setForm((prev) =>
                           ({ ...prev, name: e.target.value }))}
                />
                <Button variant="contained" onClick={pageQuery}>查询</Button>

                <Box sx={{ flexGrow: 1 }} />

                <Button variant="contained">+ 添加员工</Button>
            </Toolbar>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>员工姓名</TableCell>
                            <TableCell align="right">账号</TableCell>
                            <TableCell align="right">手机号</TableCell>
                            <TableCell align="right">账号状态</TableCell>
                            <TableCell align="right">最后操作时间</TableCell>
                            <TableCell align="right">操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {list.map((list) => (
                            <TableRow
                                key={list.username}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {list.name}
                                </TableCell>
                                <TableCell align="right">{list.username}</TableCell>
                                <TableCell align="right">{list.phone}</TableCell>
                                <TableCell align="right">{list.status}</TableCell>
                                <TableCell align="right">{list.updateTime}</TableCell>
                                <TableCell align="right">修改 禁用</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            </Paper>
        </>
    )
}

export default Employee