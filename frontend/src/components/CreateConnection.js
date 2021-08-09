/**
 * CreateConnection.js
 * Create Connection screen/dashboard.
 */
import { useState } from 'react';
import { useHistory } from "react-router-dom";
import Navigation from './Navigation';
import {
    Button,
} from '@material-ui/core';

const breadcrumbs = [
    {
        href: "/",
        page: "Dashboard"
    },
    {
        href: "/connections",
        page: "Connections"
    },
    {
        href: "/connections/requests",
        page: "Requests"
    },
    {
        href: "/connections/requests/create",
        page: "Send Request"
    },
];

const CreateConnection = () => {
    const history = useHistory();
    const [value, setValue] = useState('');
    
    const onFormSubmit = (e) => {
        e.preventDefault();
        const data = {receiver_username: value};
        console.log('submit');
        console.log(data);
        fetch('http://localhost:5000/connections/requests/create', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("token")}`,
                'Access-Control-Allow-Credentials': 'true',
                'crossorigin': 'true'
            },
            body: JSON.stringify(data),
        })
        .then((res) => {
            history.push('/connections');
            alert("Successfully sent!")
        })
        .then(res => console.log(res));
    }

    function handleValue(e) {
        setValue(e.target.value);
    }

    return (
        <div className="form_container">
            <Navigation links={breadcrumbs} currentLink="Send Request" />
            <form onSubmit={onFormSubmit}>
                <h2>Create Connection</h2>
                <div>
                    <label>Username to connect to:</label><br/>
                    <input type="text" name="receiver_username" required onChange={handleValue}/>
                </div>
                <div> 
                    <Button variant="contained" color="primary" type='submit'>Connect!</Button>
                </div>
            </form>
        </div>
    )

};
export default CreateConnection;