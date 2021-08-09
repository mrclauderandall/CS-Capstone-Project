import React from 'react';

//import './AssignedTask.css'


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

import requests from '../requests/requests';
import DeleteIcon from '@material-ui/icons/Delete';
import { useHistory } from "react-router-dom";


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
    width: 230,
    minHeight: 200,
    margin: 10,
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

export default function AssignedTask({ task }) {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  const [status, setStatus] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const history = useHistory();

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
    requests.deleteTask(task[0])
      .then(res => window.location.reload())
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
      statusName = "Completed"
      break;
    default:
      statusName = "Not Started"
  }

  var priorityName;

  switch (task[6]) {
    case 1:
      priorityName = "Low"
      break;
    case 2:
      priorityName = "Medium"
      break;
    default:
      priorityName = "High"
  }


  console.log(task)
  return (
    <Card className={classes.root} id={classes.root} style={{ backgroundColor: getBumped() }}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom id={classes.title}>
          Task owner: {task[10]}
        </Typography>
        <Typography variant="h5" component="h2">
          {task[1]}
        </Typography>
        <Typography variant="body2" component="p">
          {task[2]}
        </Typography>
        <Typography variant="body2" component="p">
          Created: {task[3]}
        </Typography>
        <Typography variant="body2" component="b">
          Priority: {priorityName}
        </Typography>
        <Typography variant="body2" component="p">
          Due: {task[4]}
        </Typography>
      </CardContent>

      <div>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-controlled-open-select-label">{statusName}</InputLabel>
          <Select
            labelId="demo-controlled-open-select-label"
            id="demo-controlled-open-select"
            open={open}
            onClose={handleClose}
            onOpen={handleOpen}
            value={status}
            onChange={handleChange}
          >
            <MenuItem value={0}>Not Started</MenuItem>
            <MenuItem value={1}>In Progress</MenuItem>
            <MenuItem value={2}>Blocked</MenuItem>
            <MenuItem value={3}>Complete</MenuItem>
          </Select>
        </FormControl>
        <IconButton aria-label="delete" onClick = {handleDelete}>
          <DeleteIcon />
        </IconButton>
      </div>

    </Card >
  );
}
