import express, { Response, Router, Request } from 'express';
import User from './user.interface';
import Controller from '../../interfaces/controller.interface';
import userModel from './user.model';
import { request } from 'https';
import { runInNewContext } from 'vm';
import { HttpException } from '../../exceptions/HttpException';

export class UserController implements Controller {
  public path = '/api/user';
  public router: Router = express.Router();
  private user = userModel;

  constructor() {
    this.initRoutes();
  }

  public initRoutes() {
    this.router.get(this.path, this.getAllUsers);
    this.router.post(this.path, this.createAUser);
    this.router.get(`${this.path}/:id`, this.getUserById);
    this.router.patch(`${this.path}/:id`, this.updateUser);
    this.router.delete(`${this.path}/:id`, this.deleteUser);
  }

  private getAllUsers = (request: Request, response: Response): void => {
    this.user.find().exec(users => {
      response.json(users);
    });
  };

  private getUserById = (request: Request, response: Response): void => {
    this.user.findById(request.params.id).then(user => {
      if (user) {
        response.json(user);
      } else {
        response.status(404).send({ error: 'User not found' });
      }
    });
  };

  private createAUser = (request: Request, response: Response): void => {
    const user: User = request.body;
    const createdUser = new this.user(user);
    createdUser.save().then(saved => {
      response.json(saved);
    });
  };

  private updateUser = (request: Request, response: Response): void => {
    const userData: User = request.body;
    this.user
      .findByIdAndUpdate(request.params.id, userData, { new: true })
      .then(user => {
        response.json(user);
      });
  };

  private deleteUser = (
    request: Request,
    response: Response,
    next: express.NextFunction
  ): void => {
    this.user.findByIdAndDelete(request.params.id).then(success => {
      if (success) {
        response.status(204);
      } else {
        // post not found
        next(new HttpException(404, 'User not found'));
      }
    });
  };
}
