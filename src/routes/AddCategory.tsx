import {
    Paper,
    Stack,
    Typography,
    TextField,
} from "@mui/material";
import Button from "@mui/material/Button";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {addCategory, editCategory} from "@/api/category.ts";
import {CategoryType} from "@/constants";
import {ApiRequestBody} from "@/types";


const labelWidth = 120;

function AddCategory() {

    const navigate = useNavigate();

    const { id } = useParams();

    const [searchParams] = useSearchParams();

    const isEdit = Boolean(id);

    type Form = Omit<ApiRequestBody<'/admin/category', 'post'>, 'type' | 'sort'> & {
        type: number | "";
        // todo: better to change type to string and parse to number when submit
        sort: number | "";
    }

    const [form, setForm] = useState<Form>({
        id: undefined,
        name: "",
        type: "",
        sort: ""
    });

    type Errors = Partial<Record<keyof Form, string>>;

    const [errors, setErrors] = useState<Errors>({});

    type Validator<T> = (value: T) => string | undefined;

    type Validators<Form> = {
        [K in keyof Form]: Validator<Form[K]>;
    };

    const validators = {
        id: () => undefined,
        name: (v: string) => (!v ? "分类名称不能为空" : undefined),
        type: (v: number | "") => {
            if (v === "") return "分类类型不能为空";
            if (!Object.values(CategoryType).includes(v)) return "分类类型在可选类型中不存在";
            return undefined
        },
        sort: (v: number | "") => {
            if (v === "") return "排序值不能为空";
            if (v < 0 || v > 99) return "排序值必须在0-99之间";
            return undefined;
        },
    } satisfies Validators<Form>;

    useEffect(() => {
        if(isEdit){
            const name = searchParams.get('name');
            const type = searchParams.get('type');
            const sort = searchParams.get('sort');
            if (!name || !type || !sort) {
                console.error("Missing required search parameters for editing category");
                navigate(-1);
                return;
            }
            setForm({
                id: Number(id),
                name: name,
                type: Number(type),
                sort: Number(sort),
            });
        } else {
            const type = searchParams.get('type');
            if (!type) {
                console.error("Missing type for adding category");
                navigate(-1);
                return;
            }
            setForm(prev => ({
                ...prev,
                type: Number(type),
            }));
        }
    }, []);


    const handleSubmit = async () => {
        // validate errors
        const nextErrors: Errors = {
            name: validators.name(form.name),
            type: validators.type(form.type),
            sort: validators.sort(form.sort),
        };
        setErrors(nextErrors);
        const hasError = Object.values(nextErrors).some(Boolean);
        if (hasError) return;
        // submit form
        if (isEdit) {
            // edit category
            try {
                type ApiBody = ApiRequestBody<'/admin/category', 'put'>;
                const apiBody: ApiBody = {
                    ...form,
                    type: form.type as number,
                    sort: form.sort as number,
                };
                const response = await editCategory(apiBody);
                if (response.code === 1) {
                    navigate("/category");
                    return;
                }
                console.error("Failed to edit category:", response.msg);
            } catch (error) {
                console.error("Failed to edit category:", error);
            }
        } else {
            // add category
            try {
                type ApiBody = ApiRequestBody<'/admin/category', 'post'>;
                const apiBody: ApiBody = {
                    ...form,
                    type: form.type as number,
                    sort: form.sort as number,
                };
                const response = await addCategory(apiBody);
                if (response.code === 1) {
                    navigate("/category");
                    return;
                }
                console.error("Failed to add category:", response.msg);
            } catch (error) {
                console.error("Failed to add category:", error);
            }
        }
    }

    const handleCancel = () => {
        navigate(-1);
    }

    return (
        <>
            <Typography variant="h5">{isEdit ? '修改分类' : '添加分类'}</Typography>
            <Paper sx={{p: 2, mb: 2, mt: 2}}>
                <Stack spacing={2}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Typography sx={{width: labelWidth}}>分类名称：</Typography>
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
                        <Typography sx={{width: labelWidth}}>排序：</Typography>
                        <TextField
                            variant="standard"
                            required
                            value={form.sort}
                            onChange={(e) => {
                                const raw = e.target.value;
                                if (raw === "") {
                                    setForm(prev => ({ ...prev, sort: "" }));
                                    return;
                                }
                                const n = Number(raw);
                                if (!Number.isNaN(n)) {
                                    setForm(prev => ({ ...prev, sort: n }));
                                }
                            }}
                            onBlur={() => {
                                setErrors((p) => ({
                                    ...p, sort: validators.sort(form.sort)
                                }))
                            }}
                            error={!!errors.sort}
                            helperText={errors.sort}
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

export default AddCategory;
