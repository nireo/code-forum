import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import io from "socket.io-client";
import { User } from "../interfaces/user.interface";

let socket;

type Props = {
  user: User;
};

const Chat: React.FC<Props> = ({ user }) => {
  const [message, setMessage] = useState<string>("");
  const endpoint = "localhost:3001";
  useEffect(() => {
    socket = io(endpoint);

    if (user) {
      socket.emit("join", { user: user.username });
    }
  }, [endpoint]);
  return (
    <div>
      <p></p>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  user: state.user
});

export default connect(
  mapStateToProps,
  null
)(Chat);
