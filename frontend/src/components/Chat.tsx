import React, { useEffect, useState, FormEvent } from "react";
import { connect } from "react-redux";
import io from "socket.io-client";
import { User } from "../interfaces/user.interface";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { TextField, Divider } from "@material-ui/core";

let socket: any;

type Props = {
  user?: User;
};

interface SocketUser {
  id: string;
  username: string;
}

interface Messageinterface {
  username: object;
  text: string;
}

interface SendMessage {
  user: SocketUser;
  text: string;
}

const Chat: React.FC<Props> = ({ user }) => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Messageinterface[]>([]);
  const [users, setUsers] = useState<SocketUser[]>([]);
  const endpoint = "localhost:3001";
  useEffect(() => {
    socket = io(endpoint);

    if (user) {
      const userObject: SocketUser = {
        username: user.username,
        id: user._id
      };
      socket.emit("join", userObject);
    } else {
      socket.emit("join", {
        username: `anonymous${Math.floor(Math.random() * 100)}`,
        id: `${Math.floor(Math.random() * 100) ** 2}`
      });
    }
  }, [endpoint, user]);

  useEffect(() => {
    socket.on("message", (message: any) => {
      setMessages([...messages, message]);
    });
    socket.on("chatData", (data: any) => {
      setUsers(data.users);
      console.log(users);
    });
    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [messages, users]);

  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (message) {
      socket.emit("messageSent", message, () => {
        setMessage("");
      });
    }
  };

  return (
    <Container maxWidth="md">
      <div
        style={{
          height: "350px",
          overflow: "auto"
        }}
      >
        <Grid container>
          <Grid item xs={9}>
            {messages.map(m => {
              return (
                <div>
                  <strong>{m.username}</strong>
                  <li style={{ listStyle: "none" }}>{m.text}</li>
                  <Divider />
                </div>
              );
            })}
          </Grid>
        </Grid>
      </div>
      <form onSubmit={sendMessage}>
        <Grid container spacing={1}>
          <Grid item xs={9}>
            <TextField
              style={{ width: "100%", paddingTop: "0", marginTop: "0" }}
              id="outlined-dense"
              label="Message"
              type="text"
              name="message"
              autoComplete="message"
              variant="outlined"
              margin="dense"
              value={message}
              onChange={({ target }) => setMessage(target.value)}
            />
          </Grid>
          <Grid item xs={3}>
            <Button type="submit" variant="contained" color="primary">
              Send
            </Button>
          </Grid>
        </Grid>
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
