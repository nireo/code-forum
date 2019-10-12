import React, { useState, FormEvent, useEffect } from "react";
import { connect } from "react-redux";
import { User } from "../../../interfaces/user.interface";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { makeStyles, Theme } from "@material-ui/core/styles";
import NotFound from "../../NotFound";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import UserService from "../../../services/user.service";

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    padding: theme.spacing(1, 1)
  },
  container: {
    display: "flex",
    flexWrap: "wrap"
  }
}));

type Props = {
  user?: User;
};

const userService = new UserService();

const Settings: React.FC<Props> = ({ user }) => {
  const classes = useStyles();
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [warning, setWarning] = useState<string>("");

  useEffect(() => {
    if (newPassword !== confirmNewPassword) {
      setWarning("The passwords need to match");
    }
  }, [newPassword, setNewPassword]);

  if (!user) {
    return <NotFound />;
  }

  const handlePasswordChange = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (confirmNewPassword === newPassword && newPassword !== "") {
      if (window.confirm("Are you sure you want to change you password")) {
        userService.updatePassword(newPassword);
      }
    }
  };

  const handleEmailChange = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (window.confirm("Are you sure you want to change your email")) {
      userService.changeEmail(email);
    }
  };

  const handleUsernameChange = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (window.confirm("Are you sure you want to change your username")) {
      userService.changeUsername(username);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4">Settings</Typography>
      <Paper className={classes.paper} style={{ marginBottom: "1rem" }}>
        <h4>username</h4>
        <div className={classes.container}>
          <p>Current: {user.username}</p>
          <form onSubmit={handleUsernameChange}>
            <TextField
              id="outlined-name"
              label="New Username"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
              variant="outlined"
              margin="dense"
              style={{ paddingTop: "0", marginTop: "0" }}
            />
            <Button type="submit" color="primary" variant="contained">
              Change
            </Button>
          </form>
        </div>
      </Paper>
      <Paper className={classes.paper} style={{ marginBottom: "1rem" }}>
        <h4>email</h4>
        <div className={classes.container}>
          <p>Current: {user.email}</p>
          <form onSubmit={handleEmailChange}>
            <TextField
              id="outlined-name"
              label="New Email"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              variant="outlined"
              margin="dense"
              style={{ paddingTop: "0", marginTop: "0" }}
            />
            <Button type="submit" color="primary" variant="contained">
              Change
            </Button>
          </form>
        </div>
      </Paper>
      <Paper className={classes.paper} style={{ marginBottom: "1rem" }}>
        password
        <div className={classes.container}>
          <form onSubmit={handlePasswordChange}>
            <TextField
              id="outlined-name"
              label="New Password"
              value={newPassword}
              onChange={({ target }) => setNewPassword(target.value)}
              variant="outlined"
              margin="dense"
              style={{ paddingTop: "0", marginTop: "0" }}
            />{" "}
            <TextField
              id="outlined-name"
              label="Confirm New Password"
              value={confirmNewPassword}
              onChange={({ target }) => setConfirmNewPassword(target.value)}
              variant="outlined"
              margin="dense"
              style={{ paddingTop: "0", marginTop: "0" }}
            />
            {"  "}
            <Button type="submit" color="primary" variant="contained">
              Change
            </Button>
          </form>
        </div>
      </Paper>
    </Container>
  );
};

const mapStateToProps = (state: any) => ({
  user: state.user
});

export default connect(
  mapStateToProps,
  null
)(Settings);
