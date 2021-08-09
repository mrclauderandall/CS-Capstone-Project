import {
  Breadcrumbs, 
  Link
} from '@material-ui/core';
import { useHistory } from "react-router-dom";

const Navigation = ({ links, currentLink }) => {
  // Manage the current URL.
  const history = useHistory();
  if (!currentLink || !links || !Array.isArray(links)) return (<div></div>);

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {links.map((link, i) => 
        link.page === currentLink 
        ? <Link key={i} color="textPrimary" aria-current="page" onClick={() => history.push(link.href)}>{link.page}</Link>
        : <Link key={i} color="inherit" aria-current="page" onClick={() => history.push(link.href)}>{link.page}</Link>
      )}
    </Breadcrumbs>
  )
}

export default Navigation;