import Typography from "@mui/material/Typography";
import {
    Box, MenuItem,
    Paper, Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow
} from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {changeDishStatus, deleteDish, fetchDishPage} from "@/api/dish.ts";
import {fetchCategoryListByType} from "@/api/category.ts";
import {CategoryType, Status} from "@/constants";
import {ApiResponseData} from "@/types";

function Dish() {

    const [form, setForm] = useState<{
        name: string;
        categoryId: number | '';
        status: number | '';
    }>({
        name: '',
        categoryId: '',
        status: ''
    });

    type PageState = {
        page: number;
        pageSize: number;
        total: number;
        rows: ApiResponseData<'/admin/dish/page','get'>['records'];
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

    // const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    useEffect(() => {
        fetchCategoryOptions();
    }, []);

    useEffect(() => {
        pageQuery();
    }, [pageState.page, pageState.pageSize]);

    const pageQuery = async () => {
        try {
            const response = await fetchDishPage({
                page: pageState.page + 1,
                pageSize: pageState.pageSize,
                name: form.name,
                ...(form.categoryId !== '' ? { categoryId: form.categoryId } : {}),
                ...(form.status !== '' ? { status: form.status } : {}),
            });
            console.log("Dish list response:", response);
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
            console.error("Failed to fetch dish list:", error);
        }
    }

    const fetchCategoryOptions = async () => {
        try {
            const response = await fetchCategoryListByType({type: CategoryType.Dish});
            console.log("category list response:", response);
            if (response.code === 1 && response.data) {
                setCategoryOptions(response.data.map((x: ApiResponseData<'/admin/category/list', 'get'>[0]) => ({
                    value: String(x.id),
                    label: String(x.name)
                })));
                // console.log("pageState.rows:", pageState.rows);
            }
        } catch (error) {
            console.error("Failed to fetch category list:", error);
        }
    }

    const handleAddDish = () => {
        navigate("/dish/add");
    }

    const handleEditDish = (id: number) => {
        navigate(`/dish/edit/${id}`);
    }

    const handleDeleteDish = async (id: number) => {
        try {
            const response = await deleteDish({ids: [id]});
            console.log("Delete dish response:", response);
            if (response.code === 1) {
                pageQuery();
            } else {
                console.log("Failed to delete dish:", response.msg);
            }
        } catch (error) {
            console.error("Failed to delete dish:", error);
        }
    }

    const handleChangeDishStatus = async (id: number, status: number) => {
        try {
            const response = await changeDishStatus({id, status});
            console.log("change dish status response:", response);
            if (response.code === 1) {
                pageQuery();
            }
        } catch (error) {
            console.error("Failed to change dish status:", error);
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

    return (
        <>

            <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    sx={{ mb: 2, mt: 1, flexWrap: 'wrap' }}
                >
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Typography>
                            菜品名称：
                        </Typography>
                        <TextField
                            size="small"
                            placeholder="按菜品名称查询"
                            onChange={(e) =>
                                setForm((prev) =>
                                    ({ ...prev, name: e.target.value }))}
                        />
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Typography>
                            菜品分类：
                        </Typography>
                        <TextField
                            select
                            size="small"
                            sx={{ minWidth: 120 }}
                            value={form.categoryId}
                            onChange={(e) =>
                                setForm((prev) =>
                                    ({ ...prev,
                                        categoryId: e.target.value === '' ? '' : Number(e.target.value)
                                    }))}
                        >
                            {categoryOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                            <MenuItem key="" value="">
                                全部
                            </MenuItem>
                        </TextField>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Typography>
                            售卖状态：
                        </Typography>
                        <TextField
                            sx={{ minWidth: 120 }}
                            size="small"
                            select
                            value={form.status}
                            onChange={(e) =>
                                setForm((prev) =>
                                    ({ ...prev,
                                        status: e.target.value === '' ? '' : Number(e.target.value)
                                    }))}
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
                    </Stack>
                    <Button variant="contained" onClick={pageQuery}>查询</Button>

                    <Box sx={{ flexGrow: 1 }} />

                    <Button variant="contained" onClick={handleAddDish}>+ 添加菜品</Button>
                </Stack>

                <TableContainer component={Paper} elevation={0}>
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
                                    key={row.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="left">image</TableCell>
                                    <TableCell align="left">{row.categoryName}</TableCell>
                                    <TableCell align="left">¥ {row.price}</TableCell>
                                    <TableCell align="left">{row.status === Status.Enabled? '✅ 起售': '🚫 停售'}</TableCell>
                                    <TableCell align="left">{row.updateTime}</TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="text"
                                            sx={{p: 0}}
                                            onClick={() => handleEditDish(row.id)}
                                            color='secondary'
                                        >
                                            修改
                                        </Button>
                                        <Button
                                            variant="text"
                                            sx={{p: 0}}
                                            onClick={() => handleDeleteDish(row.id)}
                                            color='error'
                                        >
                                            删除
                                        </Button>
                                        <Button
                                            variant="text"
                                            sx={{p: 0}}
                                            onClick={() => handleChangeDishStatus(row.id, row.status === Status.Enabled? Status.Disabled: Status.Enabled)}
                                            color={row.status === Status.Enabled? 'error': 'secondary'}
                                        >
                                            {row.status === Status.Enabled? '停售': '起售'}
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
