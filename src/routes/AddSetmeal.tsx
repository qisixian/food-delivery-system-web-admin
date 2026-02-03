import {
    Paper,
    Stack,
    Typography,
    TextField,
    MenuItem, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Dialog, DialogTitle, DialogContent,
    DialogActions, Divider, Checkbox, IconButton, FormControl, FormHelperText,
} from "@mui/material";
import Button from "@mui/material/Button";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {fetchCategoryListByType} from "@/api/category.ts";
import {CategoryType, Status} from "@/constants";
import {ApiRequestBody, ApiResponseData} from "@/types";
import {addSetmeal, editSetmeal, querySetmealById} from "@/api/setMeal.ts";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import {fetchDishListByCategoryId} from "@/api/dish.ts";

import MinusIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

const labelWidth = 120;


function AddSetmeal() {

    const navigate = useNavigate();

    const { id } = useParams();
    const isEdit = Boolean(id);

    type Form = Omit<ApiRequestBody<'/admin/setmeal', 'post'>, 'categoryId' | 'price'> & {
        categoryId: number | '';
        // todo: better to change type to string and parse to number when submit
        price: number | '';
    }

    const [form, setForm] = useState<Form>({
        id: undefined,
        name: "",
        categoryId: "",
        price: "",
        setmealDishes: [],
        image: "",
        description: "",
        status: Status.Enabled,
    });

    type Option = { value: string | number; label: string };

    const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);

    type Errors = Partial<Record<keyof Form, string>>;

    const [errors, setErrors] = useState<Errors>({});

    type Validator<T> = (value: T) => string | undefined;

    type Validators<Form> = {
        [K in keyof Form]: Validator<Form[K]>;
    };

    const validators = {
        id: () => undefined,
        name: (v: string) => (!v ? "菜品名称不能为空" : undefined),
        categoryId: (v: number | "") => (v === "" ? "套餐分类不能为空" : undefined),
        price: (v: number | "") => {
            if (v === "") return "价格不能为空";
            if (v < 0) return "价格不能为负数";
            return undefined;
        },
        image: () => undefined,
        description: () => undefined,
        status: () => undefined,
        setmealDishes: (v: ApiRequestBody<'/admin/setmeal', 'post'>['setmealDishes']) => ((!v || v.length === 0) ? "菜品不能为空" : undefined),
    } satisfies Validators<Form>;

    useEffect(() => {
        if(isEdit){
            querySetmealById({id: Number(id)}).then(res => {
                if (res.code === 1 && res.data) {
                    console.log("Fetched setmeal data:", res);
                    setForm({
                        id: Number(id),
                        name: res.data.name,
                        categoryId: res.data.categoryId,
                        price: res.data.price,
                        setmealDishes: res.data.setmealDishes,
                        image: res.data.image,
                        description: res.data.description,
                        status: res.data.status,
                    });
                } else {
                    console.error("Failed to fetch setmeal data:", res.msg);
                }
            }).catch(err => {
                console.error("Failed to fetch dish data:", err);
            });
        }
        fetchCategoryOptions();
    }, []);

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

    const handleCancel = () => {
        navigate(-1);
    }

    const handleSubmit = async () => {
        // validate errors
        const nextErrors: Errors = {
            name: validators.name(form.name),
            categoryId: validators.categoryId(form.categoryId),
            price: validators.price(form.price),
            setmealDishes: validators.setmealDishes(form.setmealDishes),
        };
        setErrors(nextErrors);
        const hasError = Object.values(nextErrors).some(Boolean);
        if (hasError) return;
        // submit form
        if (isEdit) {
            // edit setmeal
            try {
                type ApiBody = ApiRequestBody<'/admin/setmeal', 'put'>;
                const apiBody: ApiBody = {
                    ...form,
                    categoryId: form.categoryId as number,
                    price: form.price as number,
                };
                const response = await editSetmeal(apiBody);
                if (response.code === 1) {
                    navigate("/setmeal");
                    return;
                }
                console.error("Failed to edit setmeal:", response.msg);
            } catch (error) {
                console.error("Failed to edit setmeal:", error);
            }
        } else {
            // add setmeal
            try {
                type ApiBody = ApiRequestBody<'/admin/setmeal', 'post'>;
                const apiBody: ApiBody = {
                    ...form,
                    categoryId: form.categoryId as number,
                    price: form.price as number,
                };
                const response = await addSetmeal(apiBody);
                if (response.code === 1) {
                    navigate("/setmeal");
                    return;
                }
                console.error("Failed to add setmeal:", response.msg);
            } catch (error) {
                console.error("Failed to add setmeal:", error);
            }
        }
    }

    // code of dialog

    const [dialogOpen, setDialogOpen] = useState(false);

    const handleClickDialogOpen = () => {
        fetchDishCategoryOptions();
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setErrors((p) => ({
            ...p, setmealDishes: validators.setmealDishes(form.setmealDishes)
        }))
    };

    const [dishCategoryOptions, setDishCategoryOptions] = useState<Option[]>([]);


    const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(1);

    const fetchDishCategoryOptions = async () => {
        try {
            const response = await fetchCategoryListByType({type: CategoryType.Dish});
            console.log("dish category list response:", response);
            if (response.code === 1 && response.data) {
                setDishCategoryOptions(response.data.map((x: any) => ({value: x.id, label: x.name})));
                // console.log("pageState.rows:", pageState.rows);
            } else {
                console.error("Failed to fetch dish category list:", response.msg);
            }
        } catch (error) {
            console.error("Failed to fetch dish category list:", error);
        }
    }

    // type Dish = {
    //     id: number;
    //     name: string;
    //     price: number;
    //     status: number;
    //     selected: boolean;
    // }

    type SetmealDish = ApiRequestBody<'/admin/setmeal', 'post'>['setmealDishes'][0] & { status: number, selected: boolean};

    const [setmealDishList, setSetmealDishList] = useState<SetmealDish[]>([]);

    const fetchDishListByCategory = async (categoryId: number) => {
        try {
            const response = await fetchDishListByCategoryId({categoryId: categoryId});
            console.log("dish list response:", response);
            if (response.code === 1 && response.data) {
                const mapped: SetmealDish[] = response.data.map(dish => ({
                    dishId: dish.id,
                    name: dish.name,
                    price: dish.price,
                    status: dish.status,
                    copies: 1,
                    selected: form.setmealDishes.some(d => d.dishId === dish.id),
                }));
                setSetmealDishList(mapped);
                setSelectedCategoryIndex(categoryId);
            } else {
                console.error("Failed to fetch dish list:", response.msg);
            }
        } catch (error) {
            console.error("Failed to fetch dish list:", error);
        }
    }

    const changeSetmealDishSelection = (setmealDish: SetmealDish) => {
        console.log("Toggling selection for dish:", setmealDish);
        if(!setmealDish.selected){
            // add to setmealDishes
            setForm(prevForm => ({
                ...prevForm,
                setmealDishes: [
                    ...prevForm.setmealDishes,
                    {
                        setmealId: form.id,
                        dishId: setmealDish.dishId,
                        name: setmealDish.name,
                        price: setmealDish.price,
                        copies: setmealDish.copies,
                    }
                ]
            }));
        } else {
            // remove from setmealDishes
            setForm(prevForm => ({
                ...prevForm,
                setmealDishes: prevForm.setmealDishes.filter(d => d.dishId !== setmealDish.dishId)
            }));
        }
        setSetmealDishList(prevDishList =>
            prevDishList.map(d =>
                d.dishId === setmealDish.dishId ? { ...d, selected: !d.selected } : d
            )
        );
    }

    const removeSetmealDishSelection = (dishId: number) =>{
        setForm(prevForm => ({
            ...prevForm,
            setmealDishes: prevForm.setmealDishes.filter(d => d.dishId !== dishId)
        }));
        setSetmealDishList(prevDishList =>
            prevDishList.map(d =>
                d.dishId === dishId ? { ...d, selected: !d.selected } : d
            )
        );
    }


    return (
        <>
            <Typography variant="h5">{isEdit ? '修改套餐' : '添加套餐'}</Typography>
            <Paper sx={{p: 2, mb: 2, mt: 2}}>
                <Stack spacing={2}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Typography sx={{width: labelWidth}}>套餐名称：</Typography>
                        <TextField
                            variant="standard"
                            required
                            value={form.name}
                            onChange={(e) =>
                                setForm((prev) =>
                                    ({...prev, name: e.target.value}))
                            }
                            onBlur={() => {
                                setErrors((p) => ({
                                    ...p, name: validators.name(form.name)
                                }))
                            }}
                            error={!!errors.name}
                            helperText={errors.name}
                        />
                    </Stack>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Typography sx={{width: labelWidth}}>套餐分类：</Typography>
                        <TextField
                            select
                            size="small"
                            sx={{minWidth: 166}}
                            variant="standard"
                            value={form.categoryId}
                            onChange={(e) =>
                                setForm((prev) =>
                                    ({...prev, categoryId: Number(e.target.value)}))}
                            onBlur={() => {
                                setErrors((p) => ({
                                    ...p, categoryId: validators.categoryId(form.categoryId)
                                }))
                            }}
                            error={!!errors.categoryId}
                            helperText={errors.categoryId}
                        >
                            {categoryOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Stack>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Typography sx={{width: labelWidth}}>套餐价格：</Typography>
                        <TextField
                            variant="standard"
                            value={form.price}
                            onChange={(e) => {
                                const raw = e.target.value;
                                if (raw === "") {
                                    setForm(prev => ({ ...prev, price: "" }));
                                    return;
                                }
                                const n = Number(raw);
                                if (!Number.isNaN(n)) {
                                    setForm(prev => ({ ...prev, price: n }));
                                }
                            }}
                            onBlur={() => {
                                setErrors((p) => ({
                                    ...p, price: validators.price(form.price)
                                }))
                            }}
                            error={!!errors.price}
                            helperText={errors.price}
                        />
                    </Stack>
                    <Stack
                        direction="row"
                        spacing={2}
                        alignItems="flex-start"
                    >
                        <Typography sx={{width: labelWidth}}>套餐菜品：</Typography>
                        <Stack
                            direction="column"
                            spacing={2}
                            alignItems="flex-start"
                            justifyContent="flex-start"
                        >
                            <Box
                                tabIndex={0}
                                onBlurCapture={() => {
                                    setErrors((p) => ({
                                        ...p, setmealDishes: validators.setmealDishes(form.setmealDishes)
                                    }))
                                }}
                            >
                                <FormControl error={!!errors.setmealDishes}
                                             fullWidth
                                >

                                    <TableContainer
                                        component={Paper}
                                        elevation={0}

                                        variant="elevation"
                                        sx={{
                                            minWidth: 450,
                                            // borderColor: errors.setmealDishes ? 'error.main' : 'divider',
                                            // mb: 2,
                                        }}
                                    >
                                        <Table
                                            aria-label="simple table"
                                            sx={{
                                                ...(!!errors.setmealDishes && {
                                                    '& .MuiTableHead-root .MuiTableCell-root': {
                                                        borderBottomColor: 'error.main',
                                                    },
                                                }),
                                            }}
                                        >
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="center">名称</TableCell>
                                                    <TableCell align="center">单价</TableCell>
                                                    <TableCell align="center">份数</TableCell>
                                                    {/*<TableCell align="center">操作</TableCell>*/}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {form.setmealDishes.map((row) => (
                                                    <TableRow
                                                        key={row.id}
                                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                                    >
                                                        <TableCell align="center" component="th" scope="row">
                                                            {row.name}
                                                        </TableCell>
                                                        <TableCell align="center">¥ {row.price}</TableCell>
                                                        <TableCell align="center">{row.copies}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <FormHelperText>
                                        {errors.setmealDishes}
                                    </FormHelperText>
                                </FormControl>

                                    <Button
                                        variant="contained"
                                        onClick={handleClickDialogOpen}
                                        sx={{
                                            mt: 1,
                                        }}
                                    >编辑菜品</Button>

                            </Box>

                        </Stack>
                    </Stack>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Typography sx={{width: labelWidth}}>套餐图片：</Typography>
                        <TextField
                            variant="standard"
                            value={form.image}
                            onChange={(e) =>
                                setForm((prev) =>
                                    ({...prev, image: e.target.value}))
                            }
                            onBlur={() => {
                                setErrors((p) => ({
                                    ...p, image: validators.image()
                                }))
                            }}
                            error={!!errors.image}
                            helperText={errors.image}
                        />
                    </Stack>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Typography sx={{width: labelWidth}}>套餐描述：</Typography>
                        <TextField
                            variant="standard"
                            value={form.description}
                            onChange={(e) =>
                                setForm((prev) =>
                                    ({...prev, description: e.target.value}))
                            }
                            onBlur={() => {
                                setErrors((p) => ({
                                    ...p, description: validators.description()
                                }))
                            }}
                            error={!!errors.description}
                            helperText={errors.description}
                        />
                    </Stack>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Button variant="outlined" onClick={handleCancel}>取消</Button>
                        <Button variant="contained" onClick={handleSubmit}>保存</Button>
                    </Stack>
                </Stack>
            </Paper>
            <Dialog
                fullWidth={true}
                maxWidth="lg"
                open={dialogOpen}
                onClose={handleDialogClose}
            >
                <Stack direction="column">
                    <Stack
                        direction="row"
                        spacing={2}
                        divider={<Divider orientation="vertical" flexItem/>}
                        sx={{
                            justifyContent: "space-evenly",
                            // alignItems: "baseline",
                        }}
                    >
                        <Stack direction="column">
                            <DialogTitle>添加菜品</DialogTitle>
                            <DialogContent>
                                <Stack
                                    direction="row"
                                    spacing={2}
                                    divider={<Divider orientation="vertical" flexItem/>}
                                    sx={{
                                        justifyContent: "space-evenly",
                                        alignItems: "baseline",
                                        width: '100%',
                                    }}
                                >
                                    <List
                                        sx={{minWidth: 120}}
                                    >
                                        {dishCategoryOptions.map((row) => (
                                            <ListItem
                                                disablePadding
                                                key={row.value}
                                            >
                                                <ListItemButton
                                                    selected={selectedCategoryIndex === Number(row.value)}
                                                    onClick={() => fetchDishListByCategory(Number(row.value))}
                                                >
                                                    <ListItemText primary={row.label}/>
                                                </ListItemButton>
                                            </ListItem>
                                        ))}
                                    </List>
                                    <TableContainer
                                        // sx={{ width: 400 }}
                                        component={Paper}
                                        elevation={0}
                                    >
                                        <Table aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="center">是否已选</TableCell>
                                                    <TableCell
                                                        align="center"
                                                        sx={{width: 120}}
                                                    >
                                                        名称
                                                    </TableCell>
                                                    <TableCell align="center">售卖状态</TableCell>
                                                    <TableCell
                                                        align="center"
                                                        sx={{width: 80}}
                                                    >
                                                        价格
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {setmealDishList.map((row) => (
                                                    <TableRow
                                                        key={row.dishId}
                                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                                    >
                                                        <TableCell align="center" padding={"none"}>
                                                            <Checkbox
                                                                color="primary"
                                                                checked={row.selected}
                                                                onChange={() => changeSetmealDishSelection(row)}
                                                            />
                                                        </TableCell>
                                                        <TableCell align="center">{row.name}</TableCell>
                                                        <TableCell
                                                            align="center">{row.status === 0 ? '停售' : '在售'}</TableCell>
                                                        <TableCell align="center">¥ {row.price}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>

                                </Stack>
                            </DialogContent>
                        </Stack>
                        <Stack>
                            <DialogTitle>编辑菜品</DialogTitle>
                            <DialogContent>
                                <TableContainer
                                    sx={{minWidth: 350}}
                                    component={Paper}
                                    elevation={0}
                                >
                                    <Table aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell
                                                    align="center"
                                                    sx={{width: 120}}
                                                >
                                                    名称
                                                </TableCell>
                                                <TableCell
                                                    align="center"
                                                    sx={{width: 80}}
                                                >
                                                    单价
                                                </TableCell>
                                                <TableCell align="center">份数</TableCell>
                                                <TableCell align="center">操作</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {form.setmealDishes.map((row) => (
                                                <TableRow
                                                    key={row.dishId}
                                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                                >
                                                    <TableCell align="center">{row.name}</TableCell>
                                                    <TableCell align="center">¥ {row.price}</TableCell>
                                                    <TableCell align="center">
                                                        <IconButton
                                                            size="small"
                                                            sx={{pt: 0, pb: 0}}
                                                            onClick={() => {
                                                                if (row.copies <= 1) return;
                                                                setForm(prevForm => ({
                                                                    ...prevForm,
                                                                    setmealDishes: prevForm.setmealDishes.map(d =>
                                                                        d.dishId === row.dishId ? {
                                                                            ...d,
                                                                            copies: d.copies - 1
                                                                        } : d
                                                                    ),
                                                                }));
                                                            }}
                                                        >
                                                            <MinusIcon fontSize="small"/>
                                                        </IconButton>
                                                        {row.copies}
                                                        <IconButton
                                                            size="small"
                                                            sx={{pt: 0, pb: 0}}
                                                            onClick={() => {
                                                                setForm(prevForm => ({
                                                                    ...prevForm,
                                                                    setmealDishes: prevForm.setmealDishes.map(d =>
                                                                        d.dishId === row.dishId ? {
                                                                            ...d,
                                                                            copies: d.copies + 1
                                                                        } : d
                                                                    ),
                                                                }));
                                                            }}
                                                        >
                                                            <AddIcon fontSize="small"/>
                                                        </IconButton>
                                                        {/*<NumberSpinner*/}
                                                        {/*    min={1}*/}
                                                        {/*    max={40}*/}
                                                        {/*    size="small"*/}
                                                        {/*    defaultValue={row.copies}*/}
                                                        {/*/>*/}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Button
                                                            variant="text"
                                                            sx={{p: 0}}
                                                            onClick={() => removeSetmealDishSelection(row.dishId)}
                                                            color='error'
                                                        >
                                                            删除
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </DialogContent>
                        </Stack>
                        {/*<Box*/}
                        {/*    noValidate*/}
                        {/*    component="form"*/}
                        {/*    sx={{*/}
                        {/*        display: 'flex',*/}
                        {/*        flexDirection: 'column',*/}
                        {/*        m: 'auto',*/}
                        {/*        width: 'fit-content',*/}
                        {/*    }}*/}
                        {/*>*/}
                        {/*</Box>*/}
                    </Stack>
                </Stack>
                <DialogActions>
                    <Button variant={"outlined"} onClick={handleDialogClose}>关闭</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default AddSetmeal;
