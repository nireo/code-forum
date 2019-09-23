import * as bcrypt from "bcrypt";
import express, { Router, Response, Request } from "express";
import userModel from "../user/user.model";
import Controller from "../../interfaces/controller.interface";
import validationMiddleware from "../../utils/validation.middleware";
import CreateUserDto from "../user/user.dto";
import LogInDto from "./login.dto";
import { HttpException } from "../../exceptions/HttpException";
import { NotFoundException } from "../../exceptions/NotFoundException";
import User from "../user/user.interface";
import TokenData from "../../interfaces/token.data.interface";
import DataStoredInToken from "../../interfaces/data.in.token.interface";
import jwt from "jsonwebtoken";
import { ResponseUser } from "./user.res.interface";

export class AuthenticationController implements Controller {
  public path: string = "/api/auth";
  public router: Router = express.Router();
  private user = userModel;

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    this.router.post(
      `${this.path}/new`,
      validationMiddleware(CreateUserDto),
      this.registration
    );
    this.router.post(
      `${this.path}/login`,
      validationMiddleware(LogInDto),
      this.logIn
    );
  }

  private registration = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const userData: CreateUserDto = request.body;
    if (await this.user.findOne({ email: userData.email })) {
      next(new HttpException(400, "User already exists"));
    } else {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await this.user.create({
        ...userData,
        password: hashedPassword
      });
      const tokenData = this.createToken(user);
      const userReturn: ResponseUser = {
        user,
        tokenData
      };
      response.send(userReturn);
    }
  };

  private logIn = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const logInData: LogInDto = request.body;
    const user = await this.user.findOne({ username: logInData.username });
    if (user) {
      const isPasswordMatching = await bcrypt.compare(
        logInData.password,
        user.password
      );
      if (isPasswordMatching) {
        const tokenData = this.createToken(user);
        const userObject: ResponseUser = {
          user,
          tokenData
        };
        response.json(userObject);
      } else {
        next(new HttpException(403, "Forbidden"));
      }
    } else {
      next(new NotFoundException("Not found"));
    }
  };

  private createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = {
      _id: user._id
    };
    // 60 * 60 * 24 is one day
    const expiresIn = 60 * 60 * 24;
    const secret: string = "EnvSecret";
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn })
    };
  }
}
