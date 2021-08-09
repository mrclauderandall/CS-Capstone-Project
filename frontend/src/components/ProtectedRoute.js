import { useSelector } from 'react-redux';
import { Redirect, Route } from "react-router-dom";

function ProtectedRoute(props) {
  const {loggedIn, loaded} = useSelector(state => ({loggedIn: state.user.loggedIn, loaded: state.user.loaded}));
  return (
    <>
      {loaded && <Route path={props.path}>
        {loggedIn
          ? props.children
          : <Redirect to="/login" />
        }
      </Route>}
    </>
  );
}

export default ProtectedRoute;