import io from "socket.io";

interface SocketHandlerInterface {
  io: io.Server;
}

export default SocketHandlerInterface;
