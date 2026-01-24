import {
    Paper,
    Stack,
    Typography,
    TextField,
    MenuItem,
} from "@mui/material";
import Button from "@mui/material/Button";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {queryDishById} from "@/api/dish.ts";
import {fetchCategoriesByType} from "@/api/category.ts";
import {CategoryType} from "@/constants";


const labelWidth = 120;

function AddDish() {

    const navigate = useNavigate();

    const { id } = useParams();
    const isEdit = Boolean(id);

    type Form = {
        id: string;
        name: string;
        categoryId: number | '';
        price: number | '',
        flavors: unknown[],
        image: string;
        description: string;
    };

    const [form, setForm] = useState<Form>({
        id: "",
        name: "",
        categoryId: "",
        price: "",
        flavors: [],
        image: "",
        description: ""
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
        categoryId: () => undefined,
        price: (v: number | "") => {
            if (v === "") return "价格不能为空";
            if (v < 0) return "价格不能为负数";
            return undefined;
        },
        flavors: () => undefined,
        image: () => undefined,
        description: () => undefined,
    } satisfies Validators<Form>;

    useEffect(() => {
        if(isEdit){
            queryDishById({id: Number(id)}).then(res => {
                if (res.code === 1 && res.data) {
                    console.log("Fetched dish data:", res);
                    setForm({
                        id: String(id),
                        name: res.data.name,
                        categoryId: res.data.categoryId,
                        price: res.data.price,
                        flavors: res.data.flavors,
                        image: res.data.image,
                        description: res.data.description
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
            const response = await fetchCategoriesByType({type: CategoryType.Dish});
            console.log("category list response:", response);
            if (response.code === 1 && response.data) {
                setCategoryOptions(response.data.map((x: any) => ({ value: x.id, label: x.name })));
                // console.log("pageState.rows:", pageState.rows);
            }
        } catch (error) {
            console.error("Failed to fetch category list:", error);
        }
    }

    // const handleSubmit = async () => {
    //     // validate errors
    //     const nextErrors: Errors = {
    //         username: validators.username(form.username),
    //         name: validators.name(form.name),
    //         phone: validators.phone(form.phone),
    //         idNumber: validators.idNumber(form.idNumber),
    //     };
    //     setErrors(nextErrors);
    //     const hasError = Object.values(nextErrors).some(Boolean);
    //     if (hasError) return;
    //     // submit form
    //     if (isEdit) {
    //         // edit employee
    //         try {
    //             const response = await editEmployee(form);
    //             if (response.code === 1) {
    //                 navigate("/employee");
    //                 return;
    //             }
    //             console.error("Failed to edit employee:", response.msg);
    //         } catch (error) {
    //             console.error("Failed to edit employee:", error);
    //         }
    //     } else {
    //         // add employee
    //         try {
    //             const response = await addEmployee(form);
    //             if (response.code === 1) {
    //                 navigate("/employee");
    //                 return;
    //             }
    //             console.error("Failed to add employee:", response.msg);
    //         } catch (error) {
    //             console.error("Failed to add employee:", error);
    //         }
    //     }
    //
    // }

    const handleCancel = () => {
        navigate(-1);
    }

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
                            sx={{ minWidth: 166 }}
                            variant="standard"
                            value={form.categoryId}
                            onChange={(e) =>
                                setForm((prev) =>
                                    ({ ...prev, categoryId: Number(e.target.value) }))}
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
                            onChange={(e) =>
                                setForm((prev) =>
                                    ({...prev, price: Number(e.target.value) }))
                            }
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
                        <Typography sx={{width: labelWidth}}>口味做法配置：</Typography>
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
                        <Button variant="contained">保存</Button>
                    </Stack>
                </Stack>
            </Paper>
        </>
    );
}

export default AddDish;
