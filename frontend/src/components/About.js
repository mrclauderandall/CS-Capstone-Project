import {
  Typography,
  Button,
  makeStyles
} from "@material-ui/core";
import { Link } from "react-router-dom";
import banner from '../images/andrew-neel-cckf4TsHAuw-unsplash.jpg';

const useStyles = makeStyles(() => ({
  img: {
    maxWidth: '100%'
  },
  imgContainer: {
    height: '30vh',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center'
  },
  btn: {
    margin: '5px'
  },
  ref: {
    textAlign: 'right',
    width: '100%'
  }
}));

const About = () => {
  // Use classes to access styles
  const classes = useStyles();
  return (
    <div>
      <div className={classes.imgContainer}>
        <img className={classes.img} src={banner} alt="desk-with-laptop"/>
      </div>
      <div className={classes.ref}>
        Photo by <a href="https://unsplash.com/@andrewtneel?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Andrew Neel</a> on <a href="https://unsplash.com/s/photos/task-list?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
      </div>
      <Typography variant='h2' component='h2'>Task Master</Typography>
      <Link to="/login"><Button className={classes.btn} variant="contained">Login</Button></Link>
      <Link to="/register"><Button className={classes.btn} variant="contained">Sign Up</Button></Link>
      <Typography variant='body1' component='p'>
        A new solution to organising your tasks. <br/>
        <Typography variant='body2' component='span'>Brought to you by the Cooders team.</Typography>
      </Typography>

    </div>
  )
}

export default About;