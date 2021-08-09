/**
 * Login.js
 * Login Page.
 */
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

const Login = () => {
  // Manage the current URL.
  const history = useHistory();
  // Manage the state of the application.
  const dispatch = useDispatch();

  // Login button listener event
  const loginButton = (event) => {
    event.preventDefault();
    requests.loginUser(event.target['user-email'].value, event.target['user-password'].value)
      .then((res) => {
        // Set the username state
        sessionStorage.setItem("token", res.data.access_token)
        dispatch(login(res.data.user));
        // Redirect the user to home page after logging in
        history.push('/');
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
  }

  return (
    <div className="form-inner">
      <h1>Login</h1>
      <form onSubmit={loginButton}>
        <Grid container direction='column'>
          <FormControl>
            <InputLabel htmlFor="user-email">Email address</InputLabel>
            <Input id='user-email' type='email' />
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="user-password">Password</InputLabel>
            <Input id='user-password' type='password' />
          </FormControl>
          <Button variant="contained" color="primary" type='submit'>Login</Button>
          <span className='form-input-login'>
            Don't have an account? <Link to="/register"><button>
              Sign Up Here</button></Link>
          </span>
        </Grid>
      </form>
    </div>
  )
};

export default Login;