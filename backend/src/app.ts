//import express from 'express';

//const app: express.Application = express();

//app.get('/', (req: express.Request, res: express.Response) => {
//res.send('ts test');
//});

//export default app;

import express from 'express';
import * as bodyParser from 'body-parser';
import { UserController } from './components/user/user.controller';

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
