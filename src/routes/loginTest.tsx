import {useEffect, useState} from "react";
import {queryEmployeeById} from "@/api/employee";


function LoginTest() {

    const [username, setUsername] = useState("you haven't logged in bro");

    useEffect(() => {
        queryEmployeeById("1").then(response => {
            console.log('User data:', response);
            setUsername(response.data.username);
        }).catch(error => {
            console.error('Failed to fetch user data:', error);
        })

    })

    return (
        <>
            <h1>Username: {username}</h1>
        </>
    )
}

export default LoginTest