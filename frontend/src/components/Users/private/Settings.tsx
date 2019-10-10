import React, { useState, FormEvent } from "react";
import { connect } from "react-redux";
import { User } from "../../../interfaces/user.interface";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { makeStyles, Theme } from "@material-ui/core/styles";
import NotFound from "../../NotFound";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

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

const Settings: React.FC<Props> = ({ user }) => {
  const classes = useStyles();
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");

  if (!user) {
    return <NotFound />;
  }

  const handlePasswordChange = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (confirmNewPassword === newPassword && newPassword != "") {
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4">Settings</Typography>
      <Paper className={classes.paper} style={{ marginBottom: "1rem" }}>
        <h4>username</h4>
      </Paper>
      <Paper className={classes.paper} style={{ marginBottom: "1rem" }}>
        <h4>email</h4>
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
