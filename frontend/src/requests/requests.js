/**
 * Functions to make requests to the backend
 */
import axios from 'axios';

const baseUrl = 'http://localhost:5000'

const loginUser = (email, password) => {
  return axios.post(`${baseUrl}/login`, {
    username: email,
    password: password
  },
    { withCredentials: true })
}

const registerUser = (first_name, last_name, email, password) => {

  return axios.post(`${baseUrl}/register`, {
    name_first: first_name,
    name_last: last_name,
    username: email,
    password: password

  },
    { withCredentials: true })
    .catch(error => {
      console.log(error.response)
    })
}

const getUserProfile = (username) => {
  return axios.get(`${baseUrl}/user?username=${username}`, { headers: { 'Authorization': `Bearer ${sessionStorage.getItem("token")}` } })
    .then(res => res.data);
}

const fetchAssignedTasks = () => {
  return axios.get(baseUrl, {
    headers: {
      'Authorization': `Bearer ${sessionStorage.getItem("token")}`
    },
    withCredentials: true
  })
}

const fetchCreatedTasks = () => {
  return axios.get(`${baseUrl}/created_tasks`, {
    headers: {
      'Authorization': `Bearer ${sessionStorage.getItem("token")}`
    },
    withCredentials: true
  })
}

const setTaskStatus = (task_id, task_status) => {
  console.log(task_id, task_status)
  return axios.put(`${baseUrl}/taskstatus`, {
    task_id,
    task_status
  }, {
    headers: {
      'Authorization': `Bearer ${sessionStorage.getItem("token")}`,
      'Content-Type': 'application/json'
    },
    withCredentials: true
  })
}

const bumpTask = (task_id) => {
  return axios.post(`${baseUrl}/bump_task`, {
    task_id: task_id
  })
    .catch(error => {
      console.log(error.response)
    })
}

const editProfile = (first_name, last_name, email, password, username) => {
  return axios.post(`${baseUrl}/myprofile/edit`, {
    first_name: first_name,
    last_name: last_name,
    email: email,
    password: password,
    username: username
  })
    .catch(error => {
      console.log(error.response)
    })
}

const setDP = (username, image_url) => {
  return axios.post(`${baseUrl}/myprofile/setDP`, {
    username: username,
    image_url: image_url
  })
    .catch(error => {
      console.log(error.response)
    })
}

const getDP = (username) => {
  return axios.get(`${baseUrl}/myprofile/getDP?username=${username}`, {
    username: username
  })
    .catch(error => {
      console.log(error.response)
    })
}

const removeDP = (username) => {
  return axios.post(`${baseUrl}/myprofile/removeDP`, {
    username: username
  })
    .catch(error => {
      console.log(error.response)
    })
}

const deleteTask = (task_id) => {
  
  return axios.get(`${baseUrl}/delete_task?task_id=${task_id}`, 
  {
    headers: {
      'Authorization': `Bearer ${sessionStorage.getItem("token")}`,
      'Content-Type': 'application/json'
    },
    withCredentials: true
  })
}
/**
 * @returns Response {
 *  data: [{
 *    email,
 *    first_name,
 *    last_name,
 *    password,
 *    profile_pic,
 *    user_id
 *  }]
 * },
 * ...
 */


const getConnections = () => {
  return axios.get(`${baseUrl}/connections`, {
    headers: {
      'Authorization': `Bearer ${sessionStorage.getItem("token")}`
    },
    withCredentials: true
  })
  .catch(error => {
    console.log(error.response)
  })
}

const getRequest = (url, params={}) => {
  return axios.get(baseUrl+url, {
    headers: {
      'Authorization': `Bearer ${sessionStorage.getItem("token")}`
    },
    withCredentials: true,
    params: params
  })
  .catch(error => {
    console.log(error.response)
  })
}

const postRequest = (url, body={}) => {
  return axios.post(baseUrl+url, body, 
  {
    headers: {
      'Authorization': `Bearer ${sessionStorage.getItem("token")}`,
    },
    withCredentials: true,
  })
}

const requests = {
  loginUser,
  registerUser,
  getUserProfile,
  fetchAssignedTasks,
  fetchCreatedTasks,
  setTaskStatus,
  bumpTask,
  editProfile,
  setDP,
  getDP,
  removeDP,
  deleteTask,
  getRequest,
  postRequest,
  getConnections
};



export default requests;