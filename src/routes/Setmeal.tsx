import Typography from "@mui/material/Typography";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {fetchDishPage} from "@/api/dish.ts";
import {
    Box, FormControl, MenuItem,
    Paper, Select,
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
import {fetchSetmealPage} from "@/api/setMeal.ts";
import {CategoryType, Status} from "@/constants";
import {fetchCategoriesByType} from "@/api/category.ts";

function Setmeal() {

    const [form, setForm] = useState({
        name: "",
        categoryId: "",
        status: ""
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

    const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);

    const saleStatus: Option[] = [
        {
            value: Status.Enabled,
            label: '起售',
        },
        {
            value: Status.Disabled,
            label: '停售',
        },
    ];

    const navigate = useNavigate();

    useEffect(() => {
        pageQuery();
        fetchCategoryOptions();
    }, []);

    const pageQuery = async () => {
        try {
            const response = await fetchSetmealPage({
                page: 1,
                pageSize: 10,
                name: form.name,
                categoryId: form.categoryId,
                status: form.status
            });
            console.log("setmeal list response:", response);
            if (response.code === 1) {
                setPageState(prev => ({
                    ...prev,
                    rows: response.data.records,
                    total: response.data.total
                }));
                // console.log("pageState.rows:", pageState.rows);
            }
        } catch (error) {
            console.error("Failed to fetch setmeal list:", error);
        }
    }

    const fetchCategoryOptions = async () => {
        try {
            const response = await fetchCategoriesByType(CategoryType.SetMeal);
            console.log("category list response:", response);
            if (response.code === 1) {
                setCategoryOptions(response.data.map((x: any) => ({ value: x.id, label: x.name })));
                // console.log("pageState.rows:", pageState.rows);
            }
        } catch (error) {
            console.error("Failed to fetch category list:", error);
        }
    }

    const handleAddSetmeal = () => {

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
                        套餐名称：
                    </Typography>
                    <TextField
                        size="small"
                        placeholder="按套餐名称查询"
                        onChange={(e) =>
                            setForm((prev) =>
                                ({ ...prev, name: e.target.value }))}
                    />
                    <Typography>
                        套餐分类：
                    </Typography>
                    <TextField
                        select
                        size="small"
                        // value={value}
                        sx={{ minWidth: 120 }}
                        onChange={(e) =>
                            setForm((prev) =>
                                ({ ...prev, categoryId: e.target.value }))}
                    >
                        {categoryOptions.map((option) => (
                            <MenuItem value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                        <MenuItem value="">
                            全部
                        </MenuItem>
                    </TextField>
                    <Typography>
                        售卖状态：
                    </Typography>
                    <TextField
                        sx={{ minWidth: 120 }}
                        size="small"
                        select
                        // value={value}
                        onChange={(e) =>
                            setForm((prev) =>
                                ({ ...prev, status: e.target.value }))}
                    >
                        {saleStatus.map((option) => (
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

                    <Button variant="contained" onClick={handleAddSetmeal}>+ 添加套餐</Button>
                </Toolbar>

                <TableContainer component={Paper} elevation={0}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>套餐名称</TableCell>
                                <TableCell align="left">图片</TableCell>
                                <TableCell align="left">套餐分类</TableCell>
                                <TableCell align="left">套餐价</TableCell>
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
                                    <TableCell align="left">image</TableCell>
                                    <TableCell align="left">{row.categoryName}</TableCell>
                                    <TableCell align="left">¥ {row.price}</TableCell>
                                    <TableCell align="left">{row.status === 0? '🚫 停售': '✅ 起售'}</TableCell>
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
                                            color={row.status === 0? 'secondary': 'error'}
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

export default Setmeal;