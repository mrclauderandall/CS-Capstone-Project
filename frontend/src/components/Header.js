/**
 * Header:
 * Navigation menu at top of page
 */
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  makeStyles
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { useSelector } from 'react-redux';

const useStyles = makeStyles(() => ({
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  title: {
    cursor: 'pointer',
    color: 'white'
  }
}));

const Header = () => {
  // Use classes to access styles
  const classes = useStyles();
  // Manage the current URL.
  const history = useHistory();
  // Get loggedin status from state/userSlice
  const loggedIn = useSelector(state => state.user.loggedIn);
  return (
    <AppBar position="relative">
      <Toolbar className={classes.toolbar}>
        <Typography variant="h6" className={classes.title} onClick={() => history.push('/')}>
          Task Master
        </Typography>
        <div id='nav-buttons'>
          {loggedIn && <>
            <Button color="inherit" key="/" onClick={() => history.push('/')}>Dashboard</Button>
            <Button color="inherit" key="/newtask" onClick={() => history.push('/newtask')}>Create Task</Button>
            <Button color="inherit" key="/connections" onClick={() => history.push('/connections')}>Connections</Button>
            <Button color="inherit" key="/myprofile" onClick={() => history.push('/myprofile')}>My Profile</Button>
          </>}
          {!loggedIn
            ? <Button color="inherit" onClick={() => history.push('/login')}>Login</Button>
            : <Button color="inherit" onClick={() => history.push('/logout')}>Logout</Button>
          }
        </div>
      </Toolbar>
    </AppBar>
  )
}

export default Header;