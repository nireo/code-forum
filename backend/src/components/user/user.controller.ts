import express, { Response, Router, Request } from "express";
import User from "./user.interface";
import Controller from "../../interfaces/controller.interface";
import userModel from "./user.model";
import { HttpException } from "../../exceptions/HttpException";
import { NextFunction } from "connect";
import { NotFoundException } from "../../exceptions/NotFoundException";
import jwt from "jsonwebtoken";
import DataStoredInToken from "../../interfaces/data.in.token.interface";
import bcrypt from "bcrypt";
import validationMiddleware from "../../utils/validation.middleware";
import { UpdatePassword } from "./user.dto";

export class UserController implements Controller {
  public path: string = "/api/user";
  public router: Router = express.Router();
  private user = userModel;

  constructor() {
    this.initRoutes();
  }

  public initRoutes() {
    this.router.get(this.path, this.getAllUsers);
    this.router.get(`${this.path}/:amount`, this.getUserById);
    this.router.patch(`${this.path}/:id`, this.updateUser);
    this.router.delete(`${this.path}/:id`, this.deleteUser);
    this.router.get(
      `${this.path}/username/:username`,
      this.getUserWithUsername
    );
    this.router.post(
      `${this.path}/update`,
      validationMiddleware(UpdatePassword),
      this.changeUserPassword
    );
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
      if (request.params.amount) {
        let users;
        // unary operator converts page string into integer
        const amount: number = +request.params.amount;
        if (amount > 10) {
          next(new HttpException(400, "Too many users requested"));
        } else {
          users = await this.user.find().limit(amount);
          if (users) {
            response.send(users);
          } else {
            next(new NotFoundException("No users have been found"));
          }
        }
      } else {
        next(new HttpException(400, "You need to add amount as a parameter"));
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

  private deleteUser = async (
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
          await this.user.findByIdAndDelete(decodedToken._id).then(success => {
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

  private getUserWithUsername = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = await this.user.find({ username: request.params.username });
      if (user) {
        response.json(user);
      } else {
        next(
          new NotFoundException(
            `${request.params.username} has not been found.`
          )
        );
      }
    } catch (e) {
      next(new HttpException(500, e.message));
    }
  };

  private changeUserPassword = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const token = this.getToken(request);
      const { password } = request.body;
      if (token) {
        const decodedToken = jwt.verify(
          token,
          "EnvSecret"
        ) as DataStoredInToken;
        if (decodedToken) {
          const user = await this.user.findById(request.params.id);
          if (user) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const updated = await this.user.findById(
              decodedToken._id,
              { ...user, password: hashedPassword },
              { new: true }
            );
            if (updated) {
              response.json(updated);
            } else {
              next(new HttpException(500, "Internal server error"));
            }
          } else {
            next(new NotFoundException("User not found"));
          }
        } else {
          next(new HttpException(401, "Invalid token"));
        }
      } else {
        next(new HttpException(401, "Invalid token"));
      }
    } catch (e) {
      next(new HttpException(500, e.message));
    }
  };
}
