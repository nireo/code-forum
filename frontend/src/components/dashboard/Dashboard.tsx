import React, { FormEvent } from "react";
import { connect } from "react-redux";
import { User } from "../../interfaces/user.interface";
import Loading from "../Loading";
import { logUserOut } from "../../reducers/userReducer";
import UserService from "../../services/user.service";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    padding: theme.spacing(3, 2)
  }
}));

type Props = {
  user?: User;
  logUserOut: () => void;
};

const userService = new UserService();

const Dashboard: React.FC<Props> = ({ user, logUserOut }) => {
  const classes = useStyles();
  if (!user) {
    return <Loading />;
  }

  const handleRemove = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (window.confirm("Are you sure you want to delete your account.")) {
      try {
        logUserOut();
        userService.deleteUser(user._id);
      } catch {
        console.log("make notifications lady man");
      }
    }
  };

  return (
    <Container maxWidth="md">
      <Paper className={classes.paper} style={{ marginTop: "1rem" }}>
        <Typography variant="h5" component="h2">
          Delete account
        </Typography>
        <Typography variant="body2">
          After deleting your account, you can't get it back.
        </Typography>
        <form onSubmit={handleRemove}>
          <Button
            style={{ marginTop: "0.5rem" }}
            type="submit"
            variant="contained"
            color="primary"
          >
            Delete account
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

const mapStateToProps = (state: any) => {
  return {
    user: state.user
  };
};

export default connect(
  mapStateToProps,
  { logUserOut }
)(Dashboard);
