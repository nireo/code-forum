import * as express from 'express';
import User from './user.interface';
import Controller from '../../interfaces/controller.interface';

export class UserController implements Controller {
  public path = '/api/user';
  public router: express.Router = express.Router();
  private users: User[] = [
    {
      username: 'nireo',
      email: 'test@test.fi',
      password: '1234'
    }
  ];

  constructor() {
    this.initRoutes();
  }

  public initRoutes() {
    this.router.get(this.path, this.getAllUsers);
    this.router.post(this.path, this.createAPost);
  }

  getAllUsers = (request: express.Request, response: express.Response) => {
    response.send(this.users);
  };

  createAPost = (request: express.Request, response: express.Response) => {
    const user: User = request.body;
    this.users.push(user);
    response.send(user);
  };
}
