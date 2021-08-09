/**
 * Register.js
 * Register Page.
 */
import React from "react";

import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import { useHistory } from "react-router-dom";
import requests from '../requests/requests';
import { useDispatch } from 'react-redux';
import { login } from '../state/userSlice';
import { Link } from "react-router-dom";

const Register = () => {
  // Manage the current URL.
  const history = useHistory();
  // Manage the state of the application.
  const dispatch = useDispatch();

  // Login button listener event
  const registerButton = (event) => {
    event.preventDefault();
    requests.registerUser(event.target['user-first-name'].value, event.target['user-last-name'].value, event.target['user-email'].value, event.target['user-password'].value)
      .then((res) => {
        // Set the username state
        if (res != null) {
          sessionStorage.setItem("token", res.data.access_token)
          dispatch(login(res.data.username));
          // Redirect the user to home page after logging in
          history.push('/');
          alert("Successfully registered!")
        }
        else {
          alert("Email already registered or invalid details")
        }
      });
  }

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={registerButton}>
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
          <Button variant="contained" color="primary" type='submit'>Register</Button>
          <span className='form-input-login'>
            Already have an account? Login<Link to="/login"><button>
              here</button></Link>
          </span>
        </Grid>
      </form>
    </div>
  );
}
export default Register;