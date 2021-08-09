/**
 * Home.js
 * Home screen/dashboard.
 */
import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/';
import Navigation from './Navigation';
import { useHistory } from "react-router-dom";
import AssignedTasks from './AssignedTasks';
import CreatedTasks from './CreatedTasks';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const useStyles = makeStyles((theme) => ({
  profilePic: {
    height: '64px',
    width: '64px',
    marginRight: '10px',
    backgroundColor: 'red'
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '20px',
    paddingBottom: '20px',
    '& h1, h3': {
      marginBottom: '0'
    }
  },
  userTitle: {
    display: 'flex',
    alignItems: 'center'
  }
}));

const Home = () => {
  // Get state variables. Defined in src/state/userSlice.js
  const user = useSelector(state => state.user.userDtls);
  // Material UI managed styles
  const classes = useStyles();
  // Manage the current URL.
  const history = useHistory();

  return (
    <div>
      <Navigation links={[{href: "/",page: "Dashboard"}]} currentLink="Dashboard" />
      <div className={classes.topBar}>
        <div className={classes.userTitle}>
          <img src={window.localStorage.getItem(user.user_id) || 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'} className={classes.profilePic} />
          <h1>{user && <span>{user.first_name} {user.last_name}</span>}</h1>
        </div>
        <h3>{(new Date()).toLocaleString('en-AU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
      </div>
      <h1>Welcome{user && <span>, {user.first_name}</span>}</h1>
      

      <Tabs>
        <TabList>
          <Tab>Assigned Tasks</Tab>
          <Tab>Created Tasks</Tab>
        </TabList>

        <TabPanel>
          <AssignedTasks/>
        </TabPanel>
        <TabPanel>
          <CreatedTasks/>
        </TabPanel>
      </Tabs>
    </div>
  )
};

export default Home;