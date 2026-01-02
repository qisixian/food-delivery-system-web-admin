import {
    Paper,
    Stack,
    Typography,
    TextField,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
} from "@mui/material";
import Button from "@mui/material/Button";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {addEmployee, editEmployee, queryEmployeeById} from "@/api/employee.ts";

function AddEmployee() {

    const labelWidth = 100;

    const navigate = useNavigate();

    const { id } = useParams();
    const isEdit = Boolean(id);

    type Form = {
        id: string;
        username: string;
        name: string;
        phone: string;
        sex: string,
        idNumber: string;
    };

    const [form, setForm] = useState<Form>({
        id: "",
        username: "",
        name: "",
        phone: "",
        sex: "1",
        idNumber: ""
    });

    type Errors = Partial<Record<keyof Form, string>>;

    const [errors, setErrors] = useState<Errors>({});

    const validators = {
        id: () => undefined,
        username: (v: string) => (!v ? "账号不能为空" : undefined),
        name: (v: string) => (!v ? "姓名不能为空" : undefined),
        phone: (v: string) => {
            if (!v) return "手机号不能为空";
            if (!/^\d{11}$/.test(v)) return "手机号必须为11位数字";
            if (!/^1([345678])\d{9}$/.test(v)) return "请输入正确的手机号";
            return undefined;
        },
        sex: () => undefined,
        idNumber: (v: string) => {
            if (!v) return "身份证号不能为空";
            if (!/^\d{17}(\d|x|X)$/.test(v)) return "请输入正确的身份号";
            return undefined;
        }
    } satisfies Record<keyof Form, (v: string) => string | undefined>;

    useEffect(() => {
        if(isEdit){
            queryEmployeeById(String(id)).then(res => {
                if (res.code===1){
                    setForm({
                        id: String(id),
                        username: res.data.username,
                        name: res.data.name,
                        phone: res.data.phone,
                        sex: res.data.sex,
                        idNumber: res.data.idNumber
                    })
                } else {
                    console.error("Failed to fetch employee data:", res.msg);
                }
            }).catch(err => {
                console.error("Failed to fetch employee data:", err);
            });
        }
    }, []);

    const handleSubmit = async () => {
        // validate errors
        const nextErrors: Errors = {
            username: validators.username(form.username),
            name: validators.name(form.name),
            phone: validators.phone(form.phone),
            idNumber: validators.idNumber(form.idNumber),
        };
        setErrors(nextErrors);
        const hasError = Object.values(nextErrors).some(Boolean);
        if (hasError) return;
        // submit form
        if (isEdit) {
            // edit employee
            try {
                const response = await editEmployee(form);
                if (response.code === 1) {
                    navigate("/employee");
                    return;
                }
                console.error("Failed to edit employee:", response.msg);
            } catch (error) {
                console.error("Failed to edit employee:", error);
            }
        } else {
            // add employee
            try {
                const response = await addEmployee(form);
                if (response.code === 1) {
                    navigate("/employee");
                    return;
                }
                console.error("Failed to add employee:", response.msg);
            } catch (error) {
                console.error("Failed to add employee:", error);
            }
        }

    }

    const handleCancel = () => {
        navigate(-1);
    }

    return (
        <>
            <Typography variant="h5">{isEdit ? '修改员工' : '添加员工'}</Typography>
            <Paper sx={{p: 2, mb: 2, mt: 2}}>
                <Stack spacing={2}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Typography sx={{width: labelWidth}}>账号：</Typography>
                        <TextField
                            variant="standard"
                            required
                            value={form.username}
                            onChange={(e) =>
                                setForm((prev) =>
                                    ({...prev, username: e.target.value}))
                            }
                            onBlur={() => {
                                setErrors((p) => ({
                                    ...p, username: validators.username(form.username)
                                }))
                            }}
                            error={!!errors.username}
                            helperText={errors.username}
                        />
                    </Stack>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Typography sx={{width: labelWidth}}>员工姓名：</Typography>
                        <TextField
                            variant="standard"
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
                        <Typography sx={{width: labelWidth}}>手机号：</Typography>
                        <TextField
                            variant="standard"
                            value={form.phone}
                            onChange={(e) =>
                                setForm((prev) =>
                                    ({...prev, phone: e.target.value}))
                            }
                            onBlur={() => {
                                setErrors((p) => ({
                                    ...p, phone: validators.phone(form.phone)
                                }))
                            }}
                            error={!!errors.phone}
                            helperText={errors.phone}
                        />
                    </Stack>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Typography sx={{width: labelWidth}}>性别：</Typography>
                        <FormControl>
                            <RadioGroup
                                row
                                aria-labelledby="demo-radio-buttons-group-label"
                                name="radio-buttons-group"
                                defaultValue="1"
                                value={form.sex}
                                onChange={(e) =>
                                    setForm((prev) =>
                                        ({...prev, sex: e.target.value}))
                                }
                            >
                                <FormControlLabel value="1" control={<Radio/>} label="男"/>
                                <FormControlLabel value="2" control={<Radio/>} label="女"/>
                            </RadioGroup>
                        </FormControl>
                    </Stack>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Typography sx={{width: labelWidth}}>身份证号：</Typography>
                        <TextField
                            variant="standard"
                            value={form.idNumber}
                            onChange={(e) =>
                                setForm((prev) =>
                                    ({...prev, idNumber: e.target.value}))
                            }
                            onBlur={() => {
                                setErrors((p) => ({
                                    ...p, idNumber: validators.idNumber(form.idNumber)
                                }))
                            }}
                            error={!!errors.idNumber}
                            helperText={errors.idNumber}
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

export default AddEmployee;