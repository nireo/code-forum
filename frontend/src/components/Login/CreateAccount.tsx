import React, { useState, FormEvent } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import { Link } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import NavBar from "../layout/NavBar";
import Copyright from "../Copyright";
import userService from "../../services/users";
import CreateUser from "../../interfaces/user.interface";

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

const CreateAccount: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const classes = useStyles();

  const createAccount = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    if (confirmEmail === email && confirmPassword === password) {
      const newUserObject: CreateUser = {
        username,
        password,
        email
      };
      await userService.registerUser(newUserObject);
    }
  };

  return (
    <div>
      <CssBaseline />
      <NavBar />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            Create User
          </Typography>
          <form className={classes.form} onSubmit={createAccount}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Email"
              autoComplete="email"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Confirm Email"
              autoComplete="Confirm Email"
              value={confirmEmail}
              onChange={({ target }) => setConfirmEmail(target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              type="password"
              label="Password"
              autoComplete="Password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              type="password"
              required
              fullWidth
              label="Confirm Password"
              autoComplete="Confirm password"
              value={confirmPassword}
              onChange={({ target }) => setConfirmPassword(target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
            <Link to="/login">Already got a user? login</Link>
          </form>
        </Paper>
        <Copyright />
      </main>
    </div>
  );
};

export default CreateAccount;
