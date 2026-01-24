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
import {
    fetchEmployeePage,
    enableOrDisableEmployee
} from "@/api/employee";
import {useNavigate} from "react-router-dom";
import {Status} from "@/constants";


function Employee() {

    const [form, setForm] = useState({
        name: ""
    });

    type Employee = {
        id: number;
        username: string;
        name: string;
        phone: string;
        sex: string;
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

    const navigate = useNavigate();

    useEffect(() => {
        pageQuery();
    }, [pageState.page, pageState.pageSize]);

    const pageQuery = async () => {
        try {
            const response = await fetchEmployeePage({
                page: pageState.page + 1,
                pageSize: pageState.pageSize,
                name: form.name
            });
            console.log("Employee list response:", response);
            if (response.code === 1 && response.data) {
                const data = response.data;
                setPageState(prev => ({
                    ...prev,
                    rows: data.records,
                    total: data.total
                }));
                // console.log("pageState.rows:", pageState.rows);
            }
        } catch (error) {
            console.error("Failed to fetch employee list:", error);
        }
    }


    const handleChangePage = (_: React.MouseEvent<HTMLButtonElement> | null,
                              newPage: number,) => {
        console.log("changing page to:" + newPage);
        setPageState(prev => ({
            ...prev,
            page: newPage,
        }));
    }

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log("changing rowPerPage to:", event.target.value)
        setPageState(prev => ({
            ...prev,
            pageSize: parseInt(event.target.value, 10),
            page: 0,
        }));
    }

    const handleStartOrStop = async (id: number, status: number) => {
        try {
            const response = await enableOrDisableEmployee({id, status});
            console.log("Enable/Disable employee response:", response);
            if (response.code === 1) {
                pageQuery();
            }
        } catch (error) {
            console.error("Failed to enable/disable employee:", error);
        }
    }

    const handleAddEmployee = () => {
        navigate('/employee/add');
    }

    const handleEditEmployee = (id: number) => {
        navigate(`/employee/edit/${id}`);
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
                    placeholder="按员工姓名查询"
                    onChange={(e) =>
                       setForm((prev) =>
                           ({ ...prev, name: e.target.value }))}
                />
                <Button variant="contained" onClick={pageQuery}>查询</Button>

                <Box sx={{ flexGrow: 1 }} />

                <Button variant="contained" onClick={handleAddEmployee}>+ 添加员工</Button>
            </Toolbar>

            <TableContainer component={Paper} elevation={0}>
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
                                key={row.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell align="left">{row.username}</TableCell>
                                <TableCell align="left">{row.phone}</TableCell>
                                <TableCell align="left">{row.status === Status.Enabled? '✅ 启用': '🚫 禁用'}</TableCell>
                                <TableCell align="left">{row.updateTime}</TableCell>
                                <TableCell align="center">
                                    <Button
                                        variant="text"
                                        sx={{p: 0}}
                                        onClick={() => handleEditEmployee(row.id)}
                                        color='secondary'
                                        disabled={row.username === 'admin'}
                                    >
                                        修改
                                    </Button>
                                    <Button
                                        variant="text"
                                        sx={{p: 0}}
                                        onClick={() => handleStartOrStop(row.id, row.status === Status.Enabled? Status.Disabled: Status.Enabled)}
                                        color={row.status === Status.Enabled? 'error': 'secondary'}
                                        disabled={row.username === 'admin'}
                                    >
                                        {row.status === Status.Enabled? '禁用': '启用'}
                                    </Button>
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