import React from 'react';

import {
  makeStyles,
  Card,
  CardContent,
  Typography,
} from '@material-ui/core';

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
    width: 400,
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

export default function TaskCard({ task }) {
  const classes = useStyles();

  const getBumped = () => {
    if (task[9]) {
      return "red"
    }
    else {
      return "white"
    }
  }
  var statusName;

  switch (task.status_id) {

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

  var priorityName;

  switch (task.priority) {
    case 1:
      priorityName = "Low"
      break;
    case 2:
      priorityName = "Medium"
      break;
    default:
      priorityName = "High"
  }

  return (
    <Card className={classes.root} id={classes.root} style={{ backgroundColor: getBumped() }}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom id={classes.title}>
          Task assignee: INSERT
        </Typography>
        <Typography variant="h5" component="h2">
          {task.title}
        </Typography>
        <Typography variant="body2" component="p">
          {task.description}
        </Typography>
        <Typography variant="body2" component="p">
          Created: {task.created}
        </Typography>
        <Typography variant="body2" component="b">
          Priority: {priorityName}
        </Typography>
        <Typography variant="body2" component="p">
          Due: {task.deadline}
        </Typography>
      </CardContent>
    </Card >
  );
}
