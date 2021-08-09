import Button from '@material-ui/core/Button';
import { useDispatch } from 'react-redux';
import { logout } from '../state/userSlice';
import { useHistory } from "react-router-dom";

const Logout = () => {
  // Manage the state of the application.
  const dispatch = useDispatch();
  // Manage the current URL.
  const history = useHistory();

  const logoutButton = () => {
    sessionStorage.removeItem('token')
    dispatch(logout());
    history.push('/about');
  }

  return (
    <div>
      <Button variant="contained" color="secondary" onClick={logoutButton}>Logout</Button>
    </div>
  )
} 

export default Logout;