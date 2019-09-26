import express, { Response, Router, Request } from "express";
import User from "./user.interface";
import Controller from "../../interfaces/controller.interface";
import userModel from "./user.model";
import { HttpException } from "../../exceptions/HttpException";
import { NextFunction } from "connect";
import { NotFoundException } from "../../exceptions/NotFoundException";
import RequestWithUser from "../../interfaces/requestWithUser";
import authMiddleware from "../../utils/auth.middleware";
import jwt from "jsonwebtoken";
import DataStoredInToken from "../../interfaces/data.in.token.interface";

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
    this.router.patch(`${this.path}/:id`, this.updateUser);
    this.router.delete(`${this.path}/:id`, this.deleteUser);
  }

  private getToken = (request: Request): string | null => {
    const authorization: string | undefined = request.get("authorization");
    if (authorization && authorization.toLowerCase().startsWith("bearer")) {
      return authorization.substring(7);
    }
    return null;
  };

  private getAllUsers = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const users = await this.user.find({});
      if (users) {
        response.send(users);
      } else {
        next(new NotFoundException("No users have been found"));
      }
    } catch (e) {
      next(new HttpException(500, e.message));
    }
  };

  private getUserById = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = await this.user.findById(request.params.id);
      if (user) {
        response.json(user);
      } else {
        next(
          new NotFoundException(`User with id ${request.params.id} not found`)
        );
      }
    } catch (e) {
      next(new HttpException(500, e.message));
    }
  };

  private updateUser = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const token = this.getToken(request);
      if (token) {
        const decodedToken = jwt.verify(
          token,
          "EnvSecret"
        ) as DataStoredInToken;
        if (decodedToken) {
          const userData: User = request.body;
          const user = await this.user.findByIdAndUpdate(
            decodedToken._id,
            userData,
            { new: true }
          );
          response.json(user);
        } else {
          next(new HttpException(401, "Invalid token"));
        }
      }
    } catch (e) {
      next(new HttpException(500, e.message));
    }
  };

  private deleteUser = (
    request: Request,
    response: Response,
    next: express.NextFunction
  ): void => {
    try {
      const token = this.getToken(request);
      if (token) {
        const decodedToken = jwt.verify(
          token,
          "EnvSecret"
        ) as DataStoredInToken;
        if (decodedToken) {
          this.user.findByIdAndDelete(decodedToken._id).then(success => {
            if (success) {
              response.status(204);
            } else {
              // post not found
              next(new HttpException(404, "User not found"));
            }
          });
        }
      }
    } catch (e) {
      next(new HttpException(500, e.message));
    }
  };
}
