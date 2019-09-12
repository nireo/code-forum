import * as bcrypt from 'bcrypt';
import express, { Router, Response, Request } from 'express';
import userModel from '../user/user.model';
import Controller from '../../interfaces/controller.interface';
import validationMiddleware from '../../utils/validation.middleware';
import CreateUserDto from '../user/user.dto';
import LogInDto from './login.dto';
import { HttpException } from '../../exceptions/HttpException';
import { NotFoundException } from '../../exceptions/NotFoundException';

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
        response.send(user);
      } else {
        next(new HttpException(403, 'Forbidden'));
      }
    } else {
      next(new NotFoundException('Not found'));
    }
  };
}
