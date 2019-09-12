import * as bcrypt from 'bcrypt';
import express, { Router, Response, Request } from 'express';
import userModel from '../user/user.model';
import Controller from '../../interfaces/controller.interface';
import validationMiddleware from '../../utils/validation.middleware';
import CreateUserDto from '../user/user.dto';
import LogInDto from './login.dto';
import { HttpException } from '../../exceptions/HttpException';
import { NotFoundException } from '../../exceptions/NotFoundException';
import User from '../user/user.interface';
import TokenData from '../../interfaces/token.data.interface';
import DataStoredInToken from '../../interfaces/data.in.token.interface';
import jwt from 'jsonwebtoken';

export class AuthenticationController implements Controller {
  public path: string = '/api/auth';
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
    this.router.post(`${this.path}/logout`, this.logOut);
  }

  private registration = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const userData: CreateUserDto = request.body;
    if (await this.user.findOne({ email: userData.email })) {
      next(new HttpException(400, 'User already exists'));
    } else {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await this.user.create({
        ...userData,
        password: hashedPassword
      });
      const tokenData = this.createToken(user);
      response.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
      response.send(user);
    }
  };

  private logIn = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const logInData: LogInDto = request.body;
    const user = await this.user.findOne({ email: logInData.email });
    if (user) {
      const isPasswordMatching = await bcrypt.compare(
        logInData.password,
        user.password
      );
      if (isPasswordMatching) {
        const tokenData = this.createToken(user);
        response.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
        response.send(user);
      } else {
        next(new HttpException(403, 'Forbidden'));
      }
    } else {
      next(new NotFoundException('Not found'));
    }
  };

  private createCookie(tokenData: TokenData) {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
  }

  private createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = {
      _id: user._id
    };
    const expiresIn = 60 * 60;
    const secret = 'thisIsTemporarySinceEnvIsStupid';
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn })
    };
  }

  private logOut = (request: Request, response: Response) => {
    // clear the header
    response.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
    // if success send 200 status code
    response.send(200);
  };
}
