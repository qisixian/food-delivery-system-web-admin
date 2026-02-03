import {
    Paper,
    Stack,
    Typography,
    TextField,
    MenuItem, Chip,
} from "@mui/material";
import Button from "@mui/material/Button";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {addDish, editDish, fetchDishById} from "@/api/dish.ts";
import {fetchCategoryListByType} from "@/api/category.ts";
import {CategoryType, Status} from "@/constants";
import {ApiRequestBody, ApiResponseData} from "@/types";
import ListItem from "@mui/material/ListItem";
import AddIcon from '@mui/icons-material/AddCircle';
import {useTheme} from "@mui/material/styles";


const labelWidth = 120;

function AddDish() {

    const navigate = useNavigate();
    const theme = useTheme();

    const { id } = useParams();
    const isEdit = Boolean(id);

    type UiFlavor = Omit<ApiRequestBody<'/admin/dish', 'post'>['flavors'][0], 'value'> & { value: string[] };

    type Form = Omit<ApiRequestBody<'/admin/dish', 'post'>, 'categoryId' | 'price' | 'flavors'> & {
        categoryId: number | '';
        // todo: better to change type to string and parse to number when submit
        price: number | '',
        flavors: UiFlavor[];
    }

    const [form, setForm] = useState<Form>({
        id: undefined,
        name: "",
        categoryId: "",
        price: "",
        flavors: [],
        image: "",
        description: "",
        status: Status.Enabled
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
        categoryId: (v: number | "") => (v === "" ? "菜品分类不能为空" : undefined),
        price: (v: number | "") => {
            if (v === "") return "价格不能为空";
            if (v < 0) return "价格不能为负数";
            return undefined;
        },
        image: () => undefined,
        description: () => undefined,
        status: () => undefined,
        flavors: () => undefined,
    } satisfies Validators<Form>;

    useEffect(() => {
        if(isEdit){
            fetchDishById({id: Number(id)}).then(res => {
                if (res.code === 1 && res.data) {
                    console.log("Fetched dish data:", res);
                    const uiFlavors: UiFlavor[] = (res.data.flavors ?? []).map(f => ({
                        ...f,
                        value: (() => {
                            if (!f.value) return [];
                            try {
                                const v = JSON.parse(f.value);
                                if (Array.isArray(v) && v.every(x => typeof x === "string")) {
                                    return v;
                                } else {
                                    console.error("Invalid flavor format:", f.value);
                                    return [];
                                }
                            } catch {
                                console.error("Invalid flavor format:", f.value);
                                return [];
                            }
                        })(),
                    }));
                    setForm({
                        id: Number(id),
                        name: res.data.name,
                        categoryId: res.data.categoryId,
                        price: res.data.price,
                        flavors: uiFlavors,
                        image: res.data.image,
                        description: res.data.description,
                        status: res.data.status
                    });
                } else {
                    console.error("Failed to fetch dish data:", res.msg);
                }
            }).catch(err => {
                console.error("Failed to fetch dish data:", err);
            });
        }
        fetchCategoryOptions();
    }, []);

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

    const handleSubmit = async () => {
        // validate errors
        const nextErrors: Errors = {
            name: validators.name(form.name),
            categoryId: validators.categoryId(form.categoryId),
            price: validators.price(form.price),
        };
        setErrors(nextErrors);
        const hasError = Object.values(nextErrors).some(Boolean);
        if (hasError) return;
        // submit form
        if (isEdit) {
            // edit dish
            try {
                type ApiBody = ApiRequestBody<'/admin/dish', 'put'>;
                const apiBody: ApiBody = {
                    ...form,
                    categoryId: form.categoryId as number,
                    price: form.price as number,
                    flavors: form.flavors.map(f => ({
                        ...f,
                        value: JSON.stringify(f.value),
                    })),
                };
                const response = await editDish(apiBody);
                if (response.code === 1) {
                    navigate("/dish");
                    return;
                }
                console.error("Failed to edit dish:", response.msg);
            } catch (error) {
                console.error("Failed to edit dish:", error);
            }
        } else {
            // add dish
            try {
                type ApiBody = ApiRequestBody<'/admin/dish', 'post'>;
                const apiBody: ApiBody = {
                    ...form,
                    categoryId: form.categoryId as number,
                    price: form.price as number,
                    flavors: form.flavors.map(f => ({
                        ...f,
                        value: JSON.stringify(f.value),
                    })),
                };
                const response = await addDish(apiBody);
                if (response.code === 1) {
                    navigate("/dish");
                    return;
                }
                console.error("Failed to add dish:", response.msg);
            } catch (error) {
                console.error("Failed to add dish:", error);
            }
        }
    }

    const handleCancel = () => {
        navigate(-1);
    }

    const handleDeleteFlavor = (flavorId: number) => {
        console.log("deleting flavor: "+ flavorId);
    }

    const handleDeleteFlavorValue = (flavorValue: string) => {
        console.log("deleting flavor value: "+ flavorValue);
    };

    return (
        <>
            <Typography variant="h5">{isEdit ? '修改菜品' : '添加菜品'}</Typography>
            <Paper sx={{p: 2, mb: 2, mt: 2}}>
                <Stack spacing={2}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Typography sx={{width: labelWidth}}>菜品名称：</Typography>
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
                        <Typography sx={{width: labelWidth}}>菜品分类：</Typography>
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
                        <Typography sx={{width: labelWidth}}>菜品价格：</Typography>
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
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Typography sx={{width: labelWidth}}>口味选择：</Typography>
                        <Paper
                            elevation={0}
                            sx={{
                                backgroundColor: theme.palette.background.default,
                                padding: '8px',
                                minWidth: '200px'
                            }}
                        >
                            {/*<Typography>口味：</Typography>*/}
                            {form.flavors.map((flavor) => (
                                <ListItem key={flavor.id}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            flexWrap: 'wrap',
                                            listStyle: 'none',
                                            p: 0.5,
                                            m: 0,
                                        }}
                                        component="ul"
                                    >
                                        <Typography>{flavor.name}</Typography>
                                    </Paper>
                                    <Typography
                                        sx = {{
                                            p: 1
                                        }}
                                    >：</Typography>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            flexWrap: 'wrap',
                                            listStyle: 'none',
                                            p: 0.5,
                                            m: 0,
                                        }}
                                        component="ul"
                                    >
                                        <Stack direction="row" spacing={0.5}>
                                            {flavor.value.map((v) => (
                                                // <Typography >{v}</Typography>
                                                <Chip
                                                    key={v}
                                                    label={v}
                                                    variant="outlined"
                                                    size="small"
                                                    onDelete={() => handleDeleteFlavorValue(v)}
                                                />
                                            ))}
                                            <Chip
                                                key={"+"}
                                                label=""
                                                deleteIcon = <AddIcon/>
                                                variant="outlined"
                                                size="small"
                                                onDelete={() => handleDeleteFlavorValue("")}
                                            />
                                        </Stack>
                                    </Paper>
                                    <Button
                                        // color={"error"}
                                        onClick={() => handleDeleteFlavor(Number(flavor.id))}
                                    >
                                        编辑
                                    </Button>
                                    <Button
                                        color={"error"}
                                        onClick={() => handleDeleteFlavor(Number(flavor.id))}
                                    >
                                        删除
                                    </Button>
                                </ListItem>
                            ))}

                            <Button
                                variant="contained"
                                sx = {{
                                    m: 1
                                }}
                                // onClick={() => handleDeleteFlavor(Number(flavor.id))}
                            >
                                添加口味
                            </Button>
                        </Paper>
                    </Stack>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Typography sx={{width: labelWidth}}>菜品图片：</Typography>
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
                        <Typography sx={{width: labelWidth}}>菜品描述：</Typography>
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
        </>
    );
}

export default AddDish;
