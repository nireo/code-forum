import { NextFunction, Response } from "express";
import * as jwt from "jsonwebtoken";
import DataStoredInToken from "../interfaces/data.in.token.interface";
import RequestWithUser from "../interfaces/requestWithUser";
import userModel from "../components/user/user.model";
import { HttpException } from "../exceptions/HttpException";

const getToken = (request: RequestWithUser): string | null => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer")) {
    return authorization.substring(7);
  }
  return null;
};

const authMiddleware = async (
  request: RequestWithUser,
  response: Response,
  next: NextFunction
) => {
  const token = getToken(request);
  if (token) {
    const secret = "EnvSecret";
    try {
      const verificationResponse = jwt.verify(
        token,
        secret
      ) as DataStoredInToken;
      const id = verificationResponse._id;
      const user = await userModel.findById(id);
      if (user) {
        request.user = user;
        request.token = token;
        next();
      } else {
        next(new HttpException(403, "Forbidden"));
      }
    } catch (error) {
      next(new HttpException(403, "Forbidden"));
    }
  } else {
    next(new HttpException(403, "Forbidden"));
  }
};

export default authMiddleware;
