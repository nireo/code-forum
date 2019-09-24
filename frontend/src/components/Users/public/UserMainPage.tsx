import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { initAllUsers } from "../../../reducers/usersReducer";
import Loading from "../../Loading";
import NavBar from "../../layout/NavBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Container from "@material-ui/core/Container";
import { User } from "../../../interfaces/user.interface";

type Props = {
  users?: User[];
  initAllUsers: any;
};

const UserMainPage: React.FC<Props> = ({ users, initAllUsers }) => {
  const [requested, setRequested] = useState(false);
  useEffect(() => {
    if (users) {
      if (!requested && users.length === 0) {
        initAllUsers();
        setRequested(true);
      }
    }
  }, [users, initAllUsers, requested]);
  if (users === [] || !users) {
    return <Loading />;
  }
  return (
    <div>
      <CssBaseline />
      <Container maxWidth="md">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>username</TableCell>
              <TableCell>email</TableCell>
              <TableCell>id</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(row => (
              <TableRow key={row._id}>
                <TableCell>{row.username}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row._id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Container>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    users: state.users
  };
};

export default connect(
  mapStateToProps,
  { initAllUsers }
)(UserMainPage);
