import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { initAllUsers } from "../../../reducers/usersReducer";
import { User } from "../../../interfaces/user.interface";
import Loading from "../../Loading";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

type Props = {
  id: string;
  users: User[];
  initAllUsers: () => Promise<void>;
};

const SingleUserPage: React.FC<Props> = ({ users, initAllUsers, id }) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  useEffect(() => {
    if (users === []) {
      initAllUsers();
    } else {
      setUser(users.find(u => u._id === id));
    }
  }, [users]);

  if (users === [] || user === undefined) {
    return <Loading />;
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h2">@{user.username}</Typography>
    </Container>
  );
};

const mapStateToProps = (state: any) => ({
  users: state.users
});

export default connect(
  mapStateToProps,
  { initAllUsers }
)(SingleUserPage);
