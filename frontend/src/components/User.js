/**
 * User.js 
 * User profile page
 */

import { useEffect, useState } from 'react';
import { useParams, useHistory } from "react-router-dom";
import requests from '../requests/requests';
import { 
  Button,
  makeStyles,
} from '@material-ui/core';
import Navigation from './Navigation';
import TaskCard from './TaskCard';

// Define CSS Rules
const useStyles = makeStyles((theme) => ({
  userPic: {
    height: '128px',
    width: '128px',
    backgroundColor: 'red',
  },
  userBanner: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '5px'
  },
  userName: {
    marginLeft: '20px'
  }
}));

const User = () => {
  // Get id from /user/:id
  let { id } = useParams();
  // Manage the current URL.
  const history = useHistory();

  const classes = useStyles();

  // Profile data variable. 
  // Call setUserData to change its value. Will cause page to rerender when changed
  const [userData, setUserData] = useState(null);

  // Send request to backend to get profile data. 
  useEffect(() => {
    requests.getUserProfile(id)
      .then(res => {
        setUserData(res);
      })
      .catch(err => {
        console.log('error', err, err.response, err.message);
        history.push({
          pathname:'/error',
          state: {
            code: err.response.status,
            message: err.response.data
          }
        })
      });
  }, []);

  // Show this if data hasnt loaded yet
  if (!userData) return <div>Loading...</div>
  // Renders once data has loaded in useEffect function
  return (
    <div>
      <Navigation links={[{href: "/",page: "Dashboard"}, {href: `/user/${id}`,page: "User Profile"}]} currentLink="User Profile" />
      <div className={classes.userBanner}>
        <img name="photo-upload" src={'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'} className={classes.userPic} alt="profile-pic" /> 
        <div className={classes.userName}>
          <h1>{userData.first_name} {userData.last_name}</h1>
          <h3>Email: {userData.email}</h3>
        </div> 
      </div>
      <h3>Estimate of User's Business: {userData.busy}</h3>
      <hr />
      {userData.tasks.map(task => <TaskCard task={task}/>)}
    </div>
  )
}

export default User;