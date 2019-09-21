import express, { Response, Router, Request } from "express";
import User from "./user.interface";
import Controller from "../../interfaces/controller.interface";
import userModel from "./user.model";
import { HttpException } from "../../exceptions/HttpException";
import { NextFunction } from "connect";
import { NotFoundException } from "../../exceptions/NotFoundException";
import RequestWithUser from "../../interfaces/requestWithUser";
import authMiddleware from "../../utils/auth.middleware";

export class UserController implements Controller {
  public path: string = "/api/user";
  public router: Router = express.Router();
  private user = userModel;

  constructor() {
    this.initRoutes();
  }

  public initRoutes() {
    this.router.get(this.path, this.getAllUsers);
    this.router.get(`${this.path}/:id`, this.getUserById);
    this.router
      .all("/*", authMiddleware)
      .patch(`${this.path}/:id`, this.updateUser)
      .delete(`${this.path}/:id`, this.deleteUser);
  }

  private getAllUsers = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    const users = await this.user.find({});
    if (users) {
      response.send(users);
    } else {
      next(new NotFoundException("No users have been found"));
    }
  };

  private getUserById = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    const user = await this.user.findById(request.params.id);
    if (user) {
      response.json(user);
    } else {
      next(
        new NotFoundException(`User with id ${request.params.id} not found`)
      );
    }
  };

  private updateUser = async (
    request: RequestWithUser,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    if (request.user) {
      const userData: User = request.body;
      const user = await this.user.findByIdAndUpdate(
        request.user._id,
        userData,
        { new: true }
      );
      response.json(user);
    } else {
      next(new HttpException(401, "Invalid token"));
    }
  };

  private deleteUser = (
    request: RequestWithUser,
    response: Response,
    next: express.NextFunction
  ): void => {
    if (request.user) {
      this.user.findByIdAndDelete(request.user._id).then(success => {
        if (success) {
          response.status(204);
        } else {
          // post not found
          next(new HttpException(404, "User not found"));
        }
      });
    }
  };
}
