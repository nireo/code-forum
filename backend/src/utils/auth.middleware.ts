import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import RequestWithUser from '../interfaces/requestWithUser';
import { HttpException } from '../exceptions/HttpException';
import DataStoredInToken from '../interfaces/data.in.token.interface';
import userModel from '../components/user/user.model';

const authMiddleware = async (
  request: RequestWithUser,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const cookies = request.cookies;
  if (cookies && cookies.Authorization) {
    const secret: string = 'EnvSecret';
    try {
      const verifyResponse = jwt.verify(
        cookies.Authorization,
        secret
      ) as DataStoredInToken;
      const user = await userModel.findById(verifyResponse._id);
      if (user) {
        request.user = user;
        next();
      } else {
        next(new HttpException(401, 'Invalid token'));
      }
    } catch (error) {
      next(new HttpException(401, 'Invalid token'));
    }
  } else {
    next(new HttpException(403, 'Forbidden'));
  }
};

export default authMiddleware;
