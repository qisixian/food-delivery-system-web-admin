import {useEffect, useState} from "react";
import {queryEmployeeById} from "@/api/employee";
import Typography from "@mui/material/Typography";


function LoginTest() {

    const [username, setUsername] = useState("you haven't logged in bro");

    useEffect(() => {
        queryEmployeeById({id: 1}).then(res => {
            if (res.code === 1 && res.data) {
                console.log('User data:', res);
                setUsername(res.data.username);
            } else {
                console.error("Failed to fetch user data:", res.msg);
            }
        }).catch(error => {
            console.error('Failed to fetch user data:', error);
        })

    })

    return (
        <>
            <Typography variant='h4'>Login Test</Typography>
            <Typography variant='h5' sx={{mt:2}}>Username: {username}</Typography>
        </>
    )
}

export default LoginTest;
