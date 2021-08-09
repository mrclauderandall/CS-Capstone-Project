import { useState, useEffect } from 'react';
import AssignedTask from './AssignedTask';
import './Tasks.css'


import { 
  makeStyles, 
  Checkbox, 
  InputLabel, 
  MenuItem, 
  FormControl,
  Select,
  Typography,
  Button
} from '@material-ui/core/';
import FormControlLabel from "@material-ui/core/FormControlLabel";

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
}));

const AssignedTasks = () => {
  const classes = useStyles();
  const [tasks, setTasks] = useState([]);
  const [sortParameter, setSortParameter] = useState(4);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState(1);
  const [showFinished, setShowFinished] = useState(true);
  const [open, setOpen] = useState(false);

  // Code in useEffect runs when the page finishes loading.
  useEffect(() => {
    requests.fetchAssignedTasks()
    .then(res => setTasks(res.data))
    .catch(err => console.log('error getting tasks', err));
  }, [])

  
  
  
  
  
  
  
  var sortedTasks;

  if (sortParameter === 4 || sortParameter === 3) {
    
    sortedTasks = tasks.sort((a,b) => {
      return new Date(a[sortParameter]).getTime() - new Date(b[sortParameter]).getTime()
    })
  } else if (sortParameter === 1) {
    console.log("sort by title");
    sortedTasks = tasks.sort((a,b) => (a[sortParameter]) > (b[sortParameter]) ? 1 : -1)
  } else if (sortParameter === 6) {
    console.log("sort by title");
    sortedTasks = tasks.sort((a,b) => (a[sortParameter]) < (b[sortParameter]) ? 1 : -1)
  } else {
    console.log("sort by id");
  }
  
  if (!showFinished) {
    sortedTasks = sortedTasks.filter((task) => task[7] !== 3)
  }

  return (
    <div className = "taskScroll">
      <h1>Your Tasks</h1>
      <div>
      <Button className={classes.button} onClick={() => setOpen(true)}></Button>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-controlled-open-select-label">Sort Tasks</InputLabel>
        <Select
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          open={open}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          value={sortParameter}
          onChange={(event) => setSortParameter(event.target.value)}
        >
          <MenuItem value={4}>Deadline</MenuItem>
          <MenuItem value={3}>Date Created</MenuItem>
          <MenuItem value={1}>Title</MenuItem>
          <MenuItem value={6}>Priority</MenuItem>
        </Select>
      </FormControl>

      <FormControlLabel
        control={
          <Checkbox 
            defaultUnchhecked onChange={
              (event) => setShowFinished(event.target.checked)
            } 
          />
        }
        label="Show Completed Tasks"
      />
      </div>
      <div>
        <input
          type="text"
          id="filter"
          placeholder="Search Tasks.."
          onChange={(event) => setSearch(event.target.value)}
        />
        <select name="search_options" id="search_options" onChange={(event) => setSearchInput(event.target.value)}>
          <option value='1'>Title</option> 
          <option value='2'>Description</option> 
          <option value='0'>Task ID</option> 
          <option value='4'>Deadline</option> 
        </select>
      </div>
      <div className='row'>
        {sortedTasks.filter((task) => task[searchInput].includes(search)).map((task, i) => (
          <div> <AssignedTask key={i} task={task} /> </div>  
        ))}    
      </div>
    </div>
  )
}

export default AssignedTasks;