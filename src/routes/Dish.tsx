import Typography from "@mui/material/Typography";
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
import Toolbar from "@mui/material/Toolbar";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {getDishPage} from "@/api/dish.ts";

function Dish() {

    type PageState = {
        page: number;
        pageSize: number;
        total: number;
        rows: any[];
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
    }, []);

    const pageQuery = async () => {
        try {
            const response = await getDishPage({
                page: 1,
                pageSize: 10,
                // name: form.name
            });
            console.log("Dish list response:", response);
            if (response.code === 1) {
                setPageState(prev => ({
                    ...prev,
                    rows: response.data.records,
                    total: response.data.total
                }));
                // console.log("pageState.rows:", pageState.rows);
            }
        } catch (error) {
            console.error("Failed to fetch dish list:", error);
        }
    }

    const handleAddDish = () => {

    }

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null,
                              newPage: number,) => {
        console.log("hii! handleChangePage comes! newPage:" + {newPage});
        console.log("hii! handleChangePage comes! event:" + {event});
    }

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log("changing rowPerPage to:", event.target.value)
        //
        // setPageState(prev => ({
        //     ...prev,
        //     pageSize: parseInt(event.target.value, 10),
        //     page: 0,
        // }));
        // pageQuery();
    }

    return (
        <>

            <Paper sx={{ p: 2, mb: 2 }}>
                <Toolbar disableGutters
                         sx={{ mb: 2, gap: 2 }}
                >
                    <Typography>
                        菜品名称：
                    </Typography>
                    <TextField
                        size="small"
                        placeholder="请输入菜品名称"
                        // onChange={(e) =>
                        //     setForm((prev) =>
                        //         ({ ...prev, name: e.target.value }))}
                    />
                    <Button variant="contained" onClick={pageQuery}>查询</Button>

                    <Box sx={{ flexGrow: 1 }} />

                    <Button variant="contained" onClick={handleAddDish}>+ 添加菜品</Button>
                </Toolbar>

                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>菜品名称</TableCell>
                                <TableCell align="left">图片</TableCell>
                                <TableCell align="left">菜品分类</TableCell>
                                <TableCell align="left">售价</TableCell>
                                <TableCell align="left">售卖状态</TableCell>
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
                                    <TableCell align="left">row.image</TableCell>
                                    <TableCell align="left">{row.categoryId}</TableCell>
                                    <TableCell align="left">¥ {row.price}</TableCell>
                                    <TableCell align="left">{row.status === 0? '🚫 停售': '✅ 起售'}</TableCell>
                                    <TableCell align="left">{row.updateTime}</TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="text"
                                            sx={{p: 0}}
                                            // onClick={() => handleEditEmployee(row.id)}
                                        >
                                            修改
                                        </Button>
                                        <Button
                                            variant="text"
                                            sx={{p: 0}}
                                            // onClick={() => handleEditEmployee(row.id)}
                                            color='error'
                                        >
                                            删除
                                        </Button>
                                        <Button
                                            variant="text"
                                            sx={{p: 0}}
                                            // onClick={() => handleStartOrStop(row.id, row.status === 0? 1: 0)}
                                            color={row.status === 0? 'primary': 'error'}
                                        >
                                            {row.status === 0? '起售': '停售'}
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

export default Dish;