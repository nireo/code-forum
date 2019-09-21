import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { initAllUsers } from "../../../reducers/usersReducer";

type Props = {
  users?: Array<object>;
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
  return <div></div>;
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
