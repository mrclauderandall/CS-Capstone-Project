import React from 'react';

import {
  makeStyles,
  Card,
  IconButton,
  // CardActions,
  CardContent,
  // Button,
  Typography,
  InputLabel,
  MenuItem,
  FormControl,
  Select
} from '@material-ui/core';

import { Link } from "react-router-dom";

import DeleteIcon from '@material-ui/icons/Delete';

import requests from '../requests/requests';



const useStyles = makeStyles((theme) => ({
  button: {
    display: 'block',
    marginTop: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  root: {
    minWidth: 275,
    maxWidth: 500,
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  deleteButton: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

export default function CreatedTask({ task }) {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  const [status, setStatus] = React.useState('');
  const [open, setOpen] = React.useState(false);
  //const [bump, setBump] = React.useState('');

  const handleChange = (event) => {
    console.log('new status', event.target.value);
    requests.setTaskStatus(task[0], event.target.value).then(res => console.log(res));
    setStatus(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleDelete = () => {
    console.log("delete" + task[0])
    requests.deleteTask(task[0]).then(res => console.log(res));
  }
    
  const bumpTask = (event) => {
    event.preventDefault();
    requests.bumpTask(task[0])
      .then((res) => {
        if (res != null) {
          console.log(res.data)
          if (res.data) {
            alert("Successfully Bumped")
            window.location.reload(false);
          }
          else {
            alert("Unbumped")
            window.location.reload(false);
          }
        }
        else {
          alert("Unable to bump")
        }
      });
  }
  const getBumped = () => {
    if (task[9]) {
      return "red"
    }
    else {
      return "white"
    }
  }

  /* get task data
    0   task_id
    1   title
    2   Description
    3   created time
    4   Due time
    5   completed time
    6   priority 
    7   status 
        0 = not started
        1 = in progress
        2 = blocked
        3 = finished
    8   parent task
  */

  var statusName;

  switch (task[7]) {

    case 1:
      statusName = "In Progress"
      break;
    case 2:
      statusName = "Blocked"
      break;
    case 3:
      statusName = "Finished"
      break;
    default:
      statusName = "Not Started"
  }

  var link_string = '/edit_task/' + task[0]


  console.log(task)

  return (
    <Card className={classes.root} id={task[0]} style={{ backgroundColor: getBumped() }}>
      <CardContent>
        <Typography variant="h5" component="h2">
          {task[1]}
        </Typography>
        <Typography variant="body2" component="p">
          {task[2]}
        </Typography>
        <Typography variant="body2" component="p">
          Created: {task[3]}
        </Typography>
        <Typography variant="body2" component="p">
          Priority: {task[6]}
        </Typography>
        <Typography variant="body2" component="p">
          Status: {task[7]}
        </Typography>
        <Typography variant="body2" component="p">
          Due: {task[4]}
        </Typography>
        <Typography variant="body2" component="p">
          Bumped: {task[9].toString()}
        </Typography>
      </CardContent>

      <div>
        <FormControl className={classes.formControl}>
          
          <button onClick={bumpTask}>Bump Task!</button>
          <Link to={link_string}>
            <button type="button">
              Edit
            </button>
          </Link>
        </FormControl>
        <IconButton aria-label="delete" onClick = {handleDelete}>
          <DeleteIcon />
        </IconButton>
      </div>
    </Card >
  );
}
