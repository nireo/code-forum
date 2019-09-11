import * as express from 'express';
import User from './user.interface';
import Controller from '../../interfaces/controller.interface';
import userModel from './user.model';

export class UserController implements Controller {
  public path = '/api/user';
  public router: express.Router = express.Router();

  constructor() {
    this.initRoutes();
  }

  public initRoutes() {
    this.router.get(this.path, this.getAllUsers);
    this.router.post(this.path, this.createAUser);
    this.router.post(`${this.path}/:id`, this.getUserById);
  }

  getAllUsers = async (
    request: express.Request,
    response: express.Response
  ): Promise<void> => {
    await userModel.find().exec(users => {
      response.json(users);
    });
  };

  getUserById = async (
    request: express.Request,
    response: express.Response
  ): Promise<void> => {
    await userModel
      .findById(request.params.id)
      .exec(user => response.json(user));
  };

  createAUser = async (
    request: express.Request,
    response: express.Response
  ): Promise<void> => {
    const user: User = request.body;
    const createdUser = new userModel(user);
    await createdUser.save();
    response.json(createdUser);
  };
}
