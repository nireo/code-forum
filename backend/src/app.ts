import express from 'express';
import * as bodyParser from 'body-parser';
import { UserController } from './components/user/user.controller';
import { errorMiddleware } from './utils/error.middleware';
import 'dotenv/config';

class App {
  public app: express.Application;
  public port: number;
  private UserControllerObject = new UserController();

  constructor(port: number) {
    this.app = express();
    this.port = port;

    this.initMiddleware();
    this.initControllers();
  }

  private initMiddleware() {
    this.app.use(bodyParser.json());
    this.app.use(errorMiddleware);
  }

  private initControllers() {
    this.app.use('/', this.UserControllerObject.router);
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App running on port ${this.port}`);
    });
  }
}

export default App;
