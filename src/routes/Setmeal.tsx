import Typography from "@mui/material/Typography";
import {useEffect, useState} from "react";
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
import {deleteSetmeal, enableOrDisableSetmeal, fetchSetmealPage} from "@/api/setMeal.ts";
import {CategoryType, Status} from "@/constants";
import {fetchCategoryListByType} from "@/api/category.ts";
import {useNavigate} from "react-router-dom";
import {ApiResponseData} from "@/types";

function Setmeal() {

    const [form, setForm] = useState<{
        name: string;
        categoryId: number | ''; // MUI uses '' to represent an unselected state
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
        rows: ApiResponseData<'/admin/setmeal/page','get'>['records'];
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
        fetchCategoryOptions();
    }, []);

    useEffect(() => {
        pageQuery();
    }, [pageState.page, pageState.pageSize]);

    const pageQuery = async () => {
        try {
            const response = await fetchSetmealPage({
                page: pageState.page + 1,
                pageSize: pageState.pageSize,
                name: form.name,
                ...(form.categoryId !== '' ? { categoryId: form.categoryId } : {}),
                ...(form.status !== '' ? { status: form.status } : {}),
            });
            console.log("setmeal list response:", response);
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
            console.error("Failed to fetch setmeal list:", error);
        }
    }

    const fetchCategoryOptions = async () => {
        try {
            const response = await fetchCategoryListByType({type: CategoryType.SetMeal});
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

    const handleStartOrStop = async (id: number, status: number) => {
        try {
            const response = await enableOrDisableSetmeal({id, status});
            console.log("Enable/Disable setmeal response:", response);
            if (response.code === 1) {
                pageQuery();
            } else{
                console.log("Failed to enable/disable setmeal:", response.msg);
            }
        } catch (error) {
            console.error("Failed to enable/disable setmeal:", error);
        }
    }

    const handleAddSetmeal = () => {
        navigate("/setmeal/add");
    }

    const handleEditSetmeal = (id: number) => {
        navigate(`/setmeal/edit/${id}`);
    }

    const handleDeleteSetmeal = async (id: number) => {
        try {
            const response = await deleteSetmeal({ids: [id]});
            console.log("Delete setmeal response:", response);
            if (response.code === 1) {
                pageQuery();
            } else {
                console.log("Failed to delete setmeal:", response.msg);
            }
        } catch (error) {
            console.error("Failed to delete setmeal:", error);
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
                            套餐名称：
                        </Typography>
                        <TextField
                            size="small"
                            placeholder="按套餐名称查询"
                            onChange={(e) =>
                                setForm((prev) =>
                                    ({ ...prev, name: e.target.value }))}
                        />
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Typography>
                            套餐分类：
                        </Typography>
                        <TextField
                            select
                            size="small"
                            sx={{ minWidth: 120 }}
                            value={form.categoryId}
                            onChange={(e) =>
                                setForm((prev) =>
                                    ({ ...prev,
                                        categoryId: e.target.value === '' ? '' : Number(e.target.value),
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
                                        status: e.target.value === '' ? '' : Number(e.target.value),
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

                    <Button variant="contained" onClick={handleAddSetmeal}>+ 添加套餐</Button>
                </Stack>

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
                                    key={row.id}
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
                                            onClick={() => handleEditSetmeal(row.id)}
                                            color='secondary'
                                        >
                                            修改
                                        </Button>
                                        <Button
                                            variant="text"
                                            sx={{p: 0}}
                                            onClick={() => handleDeleteSetmeal(row.id)}
                                            color='error'
                                        >
                                            删除
                                        </Button>
                                        <Button
                                            variant="text"
                                            sx={{p: 0}}
                                            onClick={() => handleStartOrStop(row.id, row.status === Status.Enabled? Status.Disabled: Status.Enabled)}
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
