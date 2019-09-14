import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import DataStoredInToken from '../interfaces/data.in.token.interface';
import RequestWithUser from '../interfaces/requestWithUser';
import userModel from '../components/user/user.model';
import { HttpException } from '../exceptions/HttpException';

const authMiddleware = async (
  request: RequestWithUser,
  response: Response,
  next: NextFunction
) => {
  const cookies = request.cookies;
  if (cookies && cookies.Authorization) {
    const secret = 'EnvSecret';
    try {
      const verificationResponse = jwt.verify(
        cookies.Authorization,
        secret
      ) as DataStoredInToken;
      const id = verificationResponse._id;
      const user = await userModel.findById(id);
      if (user) {
        request.user = user;
        next();
      } else {
        next(new HttpException(403, 'Forbidden'));
      }
    } catch (error) {
      next(new HttpException(403, 'Forbidden'));
    }
  } else {
    next(new HttpException(403, 'Forbidden'));
  }
};

export default authMiddleware;
