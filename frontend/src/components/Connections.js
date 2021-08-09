/**
 * Connections.js
 * Connections screen/dashboard.
 */
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import {
  Button,
  makeStyles,
  Card,
  Typography
} from '@material-ui/core';
import requests from '../requests/requests';
import Navigation from './Navigation';
import { useHistory } from "react-router-dom";

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
    margin: '5px',
    cursor: 'pointer'
  },
  connectionList: {
    display: 'flex',
    flexDirection: 'column',
    padding: '5px'
  },
  btn: {
    margin: '10px'
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
  }
];

const Connections = () => {
  const [connections, setConnections] = useState([]);
  // Access Material UI managed styles defined above
  const classes = useStyles();
  // Code in useEffect runs when the page finishes loading.
  useEffect(() => {
    requests.getRequest('/connections')
      .then(res => setConnections(res.data))
      .catch(err => console.log('error getting connections'));
  }, []);

  return (
    <div>
      <Navigation links={breadcrumbs} currentLink="Connections" />
      <h1>Connections</h1>
      <Link to='/connections/requests'><Button variant="contained" color="secondary">Connection Requests</Button></Link>
      <Link to='/connections/requests/create'><Button variant="contained" color="secondary">Send a Request</Button></Link>
      <div className={classes.connectionList}>
        {connections && connections.map((connection, i) => <ConnectionCard key={i} data={connection} />)}
      </div>
    </div>
  )
};

const ConnectionCard = ({ data }) => {
  // Access Material UI managed styles defined above

  var link_string = '/user/' + data.email

  const classes = useStyles();
  // Manage the current URL.
  const history = useHistory();
  return (
    <Card className={classes.card} onClick={() => history.push(`/user/${data.email}`)}>
      <Link to={link_string}><Button variant="contained" color="secondary" className={classes.btn}>View<br />Profile</Button></Link>
      <img src={window.localStorage.getItem(data.user_id) || 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'} className={classes.userPic} />
      <div>
        <Typography variant="h5" component="h2">
          {data.first_name} {data.last_name}
        </Typography>
        <Typography color="textSecondary">
          {data.email}
        </Typography>
      </div>
    </Card>
  )
}

export default Connections;