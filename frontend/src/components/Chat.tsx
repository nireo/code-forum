import React, { useEffect, useState, FormEvent } from "react";
import { connect } from "react-redux";
import io from "socket.io-client";
import { User } from "../interfaces/user.interface";
import Container from "@material-ui/core/Container";

let socket: any;

type Props = {
  user?: User;
};

interface SocketUser {
  id: string;
  username: string;
}

const Chat: React.FC<Props> = ({ user }) => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);
  const [users, setUsers] = useState<SocketUser[]>([]);
  const endpoint = "localhost:3001";
  useEffect(() => {
    socket = io(endpoint);

    if (user) {
      socket.emit("join", { user: user.username, id: user._id });
    } else {
      socket.emit("join", { user: "anonymous  " });
    }
  }, [endpoint]);

  useEffect(() => {
    socket.on("message", (message: any) => {
      setMessages([...messages, message]);
    });
    socket.on("chatData", (data: any) => {
      setUsers(data.users);
    });
    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [messages]);

  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (message) {
      socket.emit("messageSent", message, () => setMessage(""));
    }
  };

  return (
    <Container maxWidth="md">
      {messages.map(m => (
        <li>{m}</li>
      ))}
      <form onSubmit={sendMessage}>
        <input
          value={message}
          onChange={({ target }) => setMessage(target.value)}
        />
        <button type="submit">Send message</button>
      </form>
    </Container>
  );
};

const mapStateToProps = (state: any) => ({
  user: state.user
});

export default connect(
  mapStateToProps,
  null
)(Chat);
