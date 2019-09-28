import React from "react";
import { connect } from "react-redux";
import { User } from "../../../interfaces/user.interface";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

type Props = {
  user?: User;
};

const Settings: React.FC<Props> = ({ user }) => {
  return (
    <Container maxWidth="md">
      <Typography variant="h2">Settings</Typography>
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
