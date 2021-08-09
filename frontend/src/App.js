/**
 * App.js
 * Root of the react project.
 * Controls which component/page is loaded based on the current route.
 */
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/';

import { useEffect } from 'react';
import requests from './requests/requests';
import { useDispatch } from 'react-redux';
import { login, load } from './state/userSlice';
import { useHistory } from "react-router-dom";

import Home from './components/Home';
import Login from './components/Login';
import Logout from './components/Logout';
import Register from './components/Register';
import User from './components/User';
import Error from './components/Error';
import Connections from './components/Connections';
import ConnectionRequests from './components/ConnectionRequests';
import CreateConnection from './components/CreateConnection';
import TaskCreation from './components/TaskCreation';
import Header from './components/Header';
import TaskEdit from './components/TaskEdit';
import UserProfile from './components/Profile';
import EditProfile from "./components/EditProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import About from "./components/About";

// Define CSS Rules
const useStyles = makeStyles((theme) => ({
  app: {
    minHeight: '80vh',
    marginTop: '20px'
  }, 
  footer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '20px',
    padding: '15px 0',
    color: '#cacaca',
    '& .laptop': {
      fontSize: '1.17em',
    }
  }
}));

function App() {
  // React hook to edit the redux store variables
  const dispatch = useDispatch();
  // Access Material UI managed styles defined above
  const classes = useStyles();
  // Manage the current URL.
  const history = useHistory();
  // Code that runs on page load
  useEffect(() => {
    requests.getRequest('/getsession')
      .then(res => dispatch(login(res.data.user)))
      .catch(err => {console.log('err'); dispatch(load())});
  }, [dispatch])

  return (
    <Router>
      <Header />
      <Container className={classes.app}>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/logout">
            <Logout />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/about">
            <About />
          </Route>
          <ProtectedRoute path="/newtask">
            <TaskCreation />
          </ProtectedRoute>
          <ProtectedRoute path="/edit_task/:id">
            <TaskEdit />
          </ProtectedRoute>
          <ProtectedRoute path="/user/:id">
            <User />
          </ProtectedRoute>
          <ProtectedRoute path="/error">
            <Error />
          </ProtectedRoute>
          <ProtectedRoute path="/connections/requests/create">
            <CreateConnection />
          </ProtectedRoute>
          <ProtectedRoute path="/connections/requests">
            <ConnectionRequests />
          </ProtectedRoute>
          <ProtectedRoute path="/connections">
            <Connections />
          </ProtectedRoute>
          <ProtectedRoute path='/myprofile'>
            <UserProfile />
          </ProtectedRoute>
          <ProtectedRoute path='/editprofile'>
            <EditProfile />
          </ProtectedRoute>
          <ProtectedRoute exact path="/">
            <Home />
          </ProtectedRoute>
          <ProtectedRoute path="/">
            <Error />
          </ProtectedRoute>
        </Switch>
      </Container>
      <footer className={classes.footer}>
        <span className='laptop'>&#128187;</span>
        <span>Made by Cooders</span>
      </footer>
    </Router>
  );
}

export default App;
