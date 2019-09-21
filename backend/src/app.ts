import express, { response } from "express";
import * as bodyParser from "body-parser";
import { errorMiddleware } from "./utils/error.middleware";
import Controller from "./interfaces/controller.interface";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";
import "dotenv/config";

class App {
  public app: express.Application;
  public port: number;

  constructor(controllers: Controller[], port: number) {
    this.app = express();
    this.port = port;

    this.initMiddleware();
    this.initControllers(controllers);
  }

  private initMiddleware() {
    this.app.use(bodyParser.json());
    this.app.use(errorMiddleware);
    this.app.use(cookieParser());
    this.app.use(compression());
    this.app.use(helmet());
  }

  private initControllers(controllers: Controller[]) {
    controllers.forEach(controller => {
      this.app.use("/", controller.router);
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App running on port ${this.port}`);
    });
  }
}

export default App;
