/**
 * ConnectionRequests.js
 * ConnectionRequests screen/dashboard.
 */
import { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";
import {
    Button,
    Card,
    Typography,
    makeStyles
} from '@material-ui/core';
import Navigation from './Navigation';

// Define CSS Rules
const useStyles = makeStyles((theme) => ({
    userPic: {
        height: '64px',
        width: '64px',
        backgroundColor: 'red',
        margin: '5px'
    },
    card: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: '5px',
        padding: '0 5px'
    },
    user: {
        display: 'flex',
        alignItems: 'center',
    },
    connectionList: {
        display: 'flex',
        flexDirection: 'column',
        padding: '5px'
    }
}));

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
    }
];



const ConnectionRequests = () => {
    const [connectionRequests, setConnectionRequests] = useState([])
    
    // Code in useEffect runs when the page finishes loading.
    useEffect(() => {
        const getConnectionRequests = async () => {
            const connsreqsFromServer = await fetchConnectionRequests()
            setConnectionRequests(connsreqsFromServer)
        }

        getConnectionRequests()
    }, [])

    const fetchConnectionRequests = async () => {
        const res = await fetch('http://localhost:5000/connections/requests', {
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem("token")}`
            }
        })
        const data = await res.json()

        return data
    }


    return (
        <div>
            <Navigation links={breadcrumbs} currentLink="Requests" />
            <h1>Connection Requests</h1>
            <Link to='/connections/requests/create'><Button variant="contained" color="secondary">Send a Request</Button></Link>
            <section>
                {connectionRequests.map((request, i) =>
                    <RequestCard key={i} data={request} />
                )}
            </section>
        </div>
    )
};

const RequestCard = ({ data }) => {
    // Access Material UI managed styles defined above
    const classes = useStyles();
    const history = useHistory();
    const acceptClick = async (sender_id, receiver_id) => {
        const res = await fetch(`http://localhost:5000/connections/accept?sender_id=${sender_id}&receiver_id=${receiver_id}`, {
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem("token")}`
            }
        })
        const data = await res.json()
        history.push('/connections');
        return data
    }
    const rejectClick = async (sender_id, receiver_id) => {
        const res = await fetch(`http://localhost:5000/connections/reject?sender_id=${sender_id}&receiver_id=${receiver_id}`, {
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem("token")}`
            }
        })
        const data = await res.json()
        history.push('/connections');
        return data
    }
    return (
        <Card className={classes.card}>
            <div>
                <div className={classes.user}>
                    <img src={window.localStorage.getItem(data.user_id) || 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'} className={classes.userPic} />
                    <div>
                        <Typography variant="h5" component="h2">
                            {data.first_name} {data.last_name}
                        </Typography>
                        <Typography color="textSecondary">
                            {data.email}
                        </Typography>
                    </div>
                </div>
                <strong>Request Sent:</strong> {data.requested}
            </div>
            <div>
                <Button variant="contained" color="primary" onClick={() => acceptClick(data.sender_id, data.receiver_id)}>Accept</Button>
                <Button variant="contained" color="secondary" onClick={() => rejectClick(data.sender_id, data.receiver_id)}>Reject</Button>
            </div>
        </Card>
    )
}

export default ConnectionRequests;