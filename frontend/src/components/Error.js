import { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import Button from '@material-ui/core/Button';

const Error = () => {
  const location = useLocation();
  const history = useHistory();
  const [code, setCode] = useState(404);
  const [message, setMessage] = useState('Page not found');

  useEffect(() => {
    if (location.state?.code) setCode(location.state.code);
    if (location.state?.message) setMessage(location.state.message);
  },[location])
  
  return(
    <div>
      <h1>{code}</h1>
      <p>{message}</p>
      <Button onClick={() => history.goBack()} variant='contained'>Click to go back</Button>
    </div>
  )
};

export default Error;