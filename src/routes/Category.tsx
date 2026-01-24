import Typography from "@mui/material/Typography";
import {useEffect, useState} from "react";
import {
    Box, MenuItem,
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
import {fetchCategoryPage} from "@/api/category.ts";
import {CategoryType, Status} from "@/constants";

function Category() {

    const [form, setForm] = useState<{
        name: string;
        type: number | ''; // // MUI uses '' to represent an unselected state
    }>({
        name: '',
        type: '',
    });

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

    type Option = { value: string | number; label: string };

    const categoryTypes: Option[] = [
        {
            value: CategoryType.Dish,
            label: '菜品分类',
        },
        {
            value: CategoryType.SetMeal,
            label: '套餐分类',
        },
    ];

    // const navigate = useNavigate();

    useEffect(() => {
        pageQuery();
    }, [pageState.page, pageState.pageSize]);

    const pageQuery = async () => {
        try {
            const response = await fetchCategoryPage({
                page: pageState.page + 1,
                pageSize: pageState.pageSize,
                name: form.name,
                ...(form.type !== '' ? { type: form.type } : {}),
            });
            console.log("category page response:", response);
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
            console.error("Failed to fetch category page:", error);
        }
    }

    const handleAdd = () => {

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

    return (
        <>

            <Paper sx={{ p: 2, mb: 2 }}>
                <Toolbar disableGutters
                         sx={{ mb: 2, gap: 2 }}
                >
                    <Typography>
                        分类名称：
                    </Typography>
                    <TextField
                        size="small"
                        placeholder="按分类名称查询"
                        onChange={(e) =>
                            setForm((prev) =>
                                ({ ...prev, name: e.target.value }))}
                    />
                    <Typography>
                        分类类型：
                    </Typography>
                    <TextField
                        sx={{ minWidth: 120 }}
                        size="small"
                        select
                        value={form.type}
                        onChange={(e) =>
                            setForm((prev) =>
                                ({ ...prev,
                                    type: e.target.value === '' ? '' : Number(e.target.value),
                                }))}
                    >
                        {categoryTypes.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                        <MenuItem key="" value="">
                            全部
                        </MenuItem>
                    </TextField>
                    <Button variant="contained" onClick={pageQuery}>查询</Button>

                    <Box sx={{ flexGrow: 1 }} />

                    <Button variant="contained" onClick={handleAdd}>+ 添加菜品分类</Button>
                    <Button variant="contained" onClick={handleAdd}>+ 添加套餐分类</Button>
                </Toolbar>

                <TableContainer component={Paper} elevation={0}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>分类名称</TableCell>
                                <TableCell align="left">分类类型</TableCell>
                                <TableCell align="left">排序</TableCell>
                                <TableCell align="left">状态</TableCell>
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
                                    <TableCell align="left">{row.type === CategoryType.Dish? '菜品分类': '套餐分类'}</TableCell>
                                    <TableCell align="left">{row.sort}</TableCell>
                                    <TableCell align="left">{row.status === Status.Enabled? '✅ 启用': '🚫 禁用'}</TableCell>
                                    <TableCell align="left">{row.updateTime}</TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="text"
                                            sx={{p: 0}}
                                            // onClick={() => handleEditEmployee(row.id)}
                                            color='secondary'
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
                                            color={row.status === Status.Enabled? 'error': 'secondary'}
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

export default Category;