import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import { 
  Button,
  makeStyles,
} from '@material-ui/core';
// import requests from '../requests/requests';
import 'antd/dist/antd.css';
import Navigation from './Navigation';

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

const UserProfile = () => {
  // Access Material UI managed styles defined above
  const classes = useStyles();
  // Get state variables. Defined in src/state/userSlice.js
  const user = useSelector(state => state.user.userDtls);
  const [imagePreviewUrl, setImagePregiewUrl] = useState(window.localStorage.getItem(user.user_id) || 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg');

  return (
    <div>
      <Navigation links={[{href: "/",page: "Dashboard"}, {href: "/myprofile",page: "User Profile"}]} currentLink="User Profile" />
      <h1>User Profile</h1>
      <div className={classes.userBanner}>
        <img name="photo-upload" src={imagePreviewUrl} className={classes.userPic} alt="profile-pic" /> 
        <div className={classes.userName}>
          <h1>{user.first_name} {user.last_name}</h1>
          <h3>Email: {user.email}</h3>
        </div> 
      </div>
      <Link to='/editprofile'><Button variant="contained" color="secondary">Edit Profile</Button></Link>
      <hr />
    </div >
  )
}

export default UserProfile;
