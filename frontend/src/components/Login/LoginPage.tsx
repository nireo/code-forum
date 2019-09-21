import React, { useState, FormEvent } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import NavBar from "../layout/NavBar";
import Copyright from "../Copyright";
import Login from "../../interfaces/login.interface";
import { connect } from "react-redux";
import { logUserIn } from "../../reducers/userReducer";
import { Link } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3)
    }
  },
  stepper: {
    padding: theme.spacing(3, 0, 5)
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end"
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1)
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    width: "100%"
  }
}));

type Props = {
  logUserIn: (loginObject: Login) => Promise<void>;
};

const LoginPage: React.FC<Props> = ({ logUserIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const classes = useStyles();

  const handleLogin = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    if (username && password) {
      const loginObject: Login = {
        username,
        password
      };
      await logUserIn(loginObject);
    }
  };

  return (
    <div>
      <CssBaseline />
      <NavBar />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            Login
          </Typography>
          <form className={classes.form} onSubmit={handleLogin}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Username or Email"
              autoFocus
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              name="password"
              label="Password"
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
            <button type="submit">Submit</button>

            <Link to="/signup">Don't have a user? Sign up</Link>
          </form>
        </Paper>
        <Copyright />
      </main>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    user: state.user
  };
};

export default connect(
  mapStateToProps,
  { logUserIn }
)(LoginPage);
