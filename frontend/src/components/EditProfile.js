import {useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import requests from '../requests/requests';
import { useHistory } from 'react-router-dom';
import { login } from '../state/userSlice';
import Navigation from './Navigation';


const EditProfile = () => {
  const user = useSelector(state => state.user.userDtls);
  const [imagePreviewUrl, setImagePregiewUrl] = useState(window.localStorage.getItem(user.user_id) || 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg');
  const history = useHistory();
  const dispatch = useDispatch();

  const editButton = (event) => {
    event.preventDefault();
    requests.editProfile(event.target['user-first-name'].value, event.target['user-last-name'].value, event.target['user-email'].value, event.target['user-password'].value, user.email)
      .then((res) => {
        // Set the username state
        if (res != null) {
          sessionStorage.setItem("token", res.data.access_token)
          dispatch(login(res.data.user));
          alert("Edited Successfully")

          history.push('/');
        }
        else {
          alert("Unable to Update")
        }
      });
  }

  const photoUpload = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onloadend = () => {
      localStorage.setItem(user.user_id, reader.result)
      setImagePregiewUrl(localStorage.getItem(user.user_id))
      console.log(user.user_id)
    }
    reader.readAsDataURL(file);
  }

  const clearDP = (e) => {
    setImagePregiewUrl('https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg');
    localStorage.removeItem(user.user_id)
  }

  return (
    <div>
      <Navigation links={[{href: "/",page: "Dashboard"}, {href: "/myprofile",page: "User Profile"}, {href: "/editprofile",page: "Edit Profile"}]} currentLink="Edit Profile" />
      <h1>Edit Profile</h1>
      <form onSubmit={editButton}>
        <Grid container direction='column'>
          <FormControl>
            <InputLabel htmlFor="user-first-name">First Name</InputLabel>
            <Input id='user-first-name' type='text' />
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="user-last-name">Last Name</InputLabel>
            <Input id='user-last-name' type='text' />
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="user-email">Email</InputLabel>
            <Input id='user-email' type='email' />
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="user-password">Password</InputLabel>
            <Input id='user-password' type='password' />
          </FormControl>
          <FormControl>
            <Typography variant="h6" component="h4">Profile Picture</Typography>
            <input accept="image/*" style={{ display: 'none' }} id="photo-upload" type="file" onChange={photoUpload}/>
            <label htmlFor="photo-upload"><Button variant="contained" component="span">Choose File</Button></label> 
          </FormControl>
          <img for="photo-upload" src={imagePreviewUrl} width="256px" height="256px" alt="profile-pic" />
          <Button variant="contained" component="span"style={{width: '100px'}} onClick={clearDP}>Clear</Button>
          <br/>
          <Button variant="contained" color="primary" type='submit'>Update Details</Button>
        </Grid>
      </form>
    </div>
  );
}

export default EditProfile;