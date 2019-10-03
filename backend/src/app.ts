import express from "express";
import * as bodyParser from "body-parser";
import { errorMiddleware } from "./utils/error.middleware";
import Controller from "./interfaces/controller.interface";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import http from "http";
import socketio from "socket.io";
import "dotenv/config";
import SocketHandlerInterface from "./interfaces/socket.interface";

class App {
  public app: express.Application;
  public port: number;
  private server: http.Server;
  private io: socketio.Server;

  constructor(controllers: Controller[], port: number) {
    this.app = express();
    this.port = port;
    this.server = http.createServer(this.app);
    this.io = socketio(this.server);

    this.initMiddleware();
    this.initControllers(controllers);
    this.startSocketHandler();
  }

  private initMiddleware() {
    this.app.use(bodyParser.json());
    this.app.use(errorMiddleware);
    this.app.use(cookieParser());
    this.app.use(compression());
    this.app.use(helmet());
    this.app.use(cors());
  }

  private startSocketHandler() {
    this.io.on("connection", (socket: socketio.Socket) => {
      console.log("user connected");
    });
  }

  private initControllers(controllers: Controller[]) {
    controllers.forEach(controller => {
      this.app.use("/", controller.router);
    });
  }

  public listen() {
    this.server.listen(this.port, () => {
      console.log(`App running on port ${this.port}`);
    });
  }
}

export default App;
