import Button from "@mui/material/Button";
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow
} from "@mui/material";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {useEffect, useState} from "react";
import {getEmployeeList} from "@/api/employee";


function Employee() {

    const [form, setForm] = useState({
        name: ""
    });

    type Employee = {
        id: number;
        username: string;
        name: string;
        phone: string;
        sex: number;
        idNumber: string;
        status: number;
        updateTime: string;
    }

    type PageState = {
        page: number;
        pageSize: number;
        total: number;
        rows: Employee[];
    };

    const [pageState, setPageState] = useState<PageState>({
        page: 0,
        pageSize: 10,
        total: 0,
        rows: [],
    });

    useEffect(() => {
        pageQuery();
    }, []);

    const pageQuery = async () => {
        try {
            const response = await getEmployeeList({
                page: 1,
                pageSize: 10,
                name: form.name
            });
            console.log("Employee list response:", response);
            if (response.code === 1) {
                setPageState(prev => ({
                    ...prev,
                    rows: response.data.records,
                    total: response.data.total
                }));
                // console.log("pageState.rows:", pageState.rows);
            }
        } catch (error) {
            console.error("Failed to fetch employee list:", error);
        }
    }


    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null,
                              newPage: number,) => {
        console.log("hii! handleChangePage comes! newPage:" + {newPage});
        console.log("hii! handleChangePage comes! event:" + {event});
    }

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log("changing rowPerPage to:", event.target.value)

        setPageState(prev => ({
            ...prev,
            pageSize: parseInt(event.target.value, 10),
            page: 0,
        }));
        pageQuery();
    }

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
                            <TableCell align="left">账号</TableCell>
                            <TableCell align="left">手机号</TableCell>
                            <TableCell align="left">账号状态</TableCell>
                            <TableCell align="left">最后操作时间</TableCell>
                            <TableCell align="center">操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pageState.rows.map((row) => (
                            <TableRow
                                key={row.username}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell align="left">{row.username}</TableCell>
                                <TableCell align="left">{row.phone}</TableCell>
                                <TableCell align="left">{row.status === 0? '禁用': '启用'}</TableCell>
                                <TableCell align="left">{row.updateTime}</TableCell>
                                <TableCell align="center">
                                    <Button variant="text" sx={{p: 0}}>修改</Button>
                                    <Button variant="text" sx={{p: 0}}>{row.status === 0? '启用': '禁用'}</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={pageState.total}
                rowsPerPage={pageState.pageSize}
                page={pageState.page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            </Paper>
        </>
    )
}

export default Employee