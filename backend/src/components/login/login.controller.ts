import express, { Response, Router, Request } from 'express';
import Controller from '../../interfaces/controller.interface';

export class LoginController implements Controller {
  public path: string = '/api/login';
  public router: Router = express.Router();

  constructor() {
    this.initRoutes();
  }

  public initRoutes() {
    this.router.post(this.path, this.handleLogin);
  }

  private handleLogin = (request: Request, response: Response) => {};
}
