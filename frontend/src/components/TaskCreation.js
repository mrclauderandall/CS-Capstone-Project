/**
 * TaskCreation.js
 * Task Creation screen/dashboard.
 */
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { useSelector } from 'react-redux';
import { React, useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Navigation from './Navigation';



import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'




import {
  DateTimePicker,
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';



const useStyles = makeStyles((theme) => ({
  title: {
    height: '64px',
    width: '150px',
    margin: '10px'
  },
  description: {
    height: '200px',
    width: '300px',
    margin: '10px',
  },
  priority: {
    height: '32px',
    width: '100px',
    margin: '10px'
  },
  btn: {
    margin: '10px'
  }
}));



const TaskCreation = () => {
  const history = useHistory();
  const classes = useStyles();

  const user = useSelector(state => state.user.userDtls);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [connections, setConnections] = useState([]);
  const [priority, setPriority] = useState('');
  const [openPriority, setOpenPriority] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleDateChange = (date) => {
    setSelectedDate(date);
    console.log(priority)
  };



  const handlePriorityChange = (event) => {
    setPriority(event.target.value);
  };

  const handlePriorityClose = () => {
    setOpenPriority(false);
  };

  const handlePriorityOpen = () => {
    setOpenPriority(true);
  };



  useEffect(() => {
    const getConnections = async () => {
      const conn = await fetchConnections();
      console.log(conn);
      setConnections(conn);
      setPriority('1');
    }
    getConnections();
  }, [])

  const fetchConnections = async () => {
    const res = await fetch('http://localhost:5000/connections_for_task', {
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem("token")}`
      }
    })
    const data = await res.json()
    return data
  }





  var default_priority = 1;


  const onFormSubmit = (event) => {
    event.preventDefault();
    const data = {
      'title': title.toString(),
      'description': description.toString(),
      'deadline': selectedDate.toUTCString(),
      'priority': priority.toString(),
      'status_id': 0,
      'parent_task_id': 0,
      'user': event.target.user.value
    };
    fetch('http://localhost:5000/newtask', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem("token")}`,
        'Access-Control-Allow-Credentials': 'true',
        'crossorigin': 'true'
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        history.push('/');
        alert("Successfully created!")
      })
      .catch(err => {
        console.log('error', err, err.response, err.message);
        history.push({
          pathname: '/error',
          state: {
            code: err.response.status,
            message: err.response.data
          }
        })
      })
      .then(res => console.log(res));
  }

  return (
    <div className="form_container">
      <Navigation links={[{ href: "/", page: "Dashboard" }, { href: "/newtask", page: "Create Task" }]} currentLink="Create Task" />
      <form onSubmit={onFormSubmit}>
        <h2>Create Task</h2>
        <div>
          <TextField
            id="standard-basic"
            className={classes.title}
            value={title} onChange={(event) => setTitle(event.target.value)}
            label="title"
            fontsize={20}
          />
        </div>
        <div>
          <TextField
            id="outlined-multiline-static"
            className={classes.description}
            value={description} onChange={(event) => setDescription(event.target.value)}
            label="Description"
            multiline
            rows={5}
            variant="outlined"
          />
        </div>
        <div>
          <select name="user">
            {connections.map((element, index) => <option key={index}>{element}</option>)}
          </select>
        </div>


        <div>
          <FormControl className='input'>
            <InputLabel id="demo-controlled-open-select-label">set priority</InputLabel>
            <Select
              labelId="demo-controlled-open-select-label"
              id="demo-controlled-open-select"
              className={classes.priority}
              open={openPriority}
              onClose={handlePriorityClose}
              onOpen={handlePriorityOpen}
              value={priority}
              onChange={handlePriorityChange}
            >
              <MenuItem value={1}>Low</MenuItem>
              <MenuItem value={2}>Medium</MenuItem>
              <MenuItem value={3}>High</MenuItem>
            </Select>
          </FormControl>
        </div>

        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="dd/MM/yyyy"
            margin="normal"
            id="date-picker-inline"
            label="Date picker inline"
            value={selectedDate}
            onChange={handleDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
          <KeyboardTimePicker
            margin="normal"
            id="time-picker"
            label="Time picker"
            value={selectedDate}
            onChange={handleDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change time',
            }}
          />
        </MuiPickersUtilsProvider>

        <div>
          <Button type="submit" variant="contained">Create</Button> 
        </div>
      </form>
    </div>
  )

};
export default TaskCreation;