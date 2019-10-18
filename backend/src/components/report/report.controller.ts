import express, { Response, Router, Request } from "express";
import Controller from "../../interfaces/controller.interface";
import reportModel from "./report.model";
import { NextFunction } from "connect";
import { HttpException } from "../../exceptions/HttpException";
import jwt from "jsonwebtoken";
import DataStoredInToken from "../../interfaces/data.in.token.interface";
import { CreateReport } from "./report.dto";
import userModel from "../user/user.model";
import validationMiddleware from "../../utils/validation.middleware";
import TokenMissingException from "../../exceptions/TokenMissing";
import NotAuthorizedException from "../../exceptions/NotAuthorized";

export class ReportController implements Controller {
  public path: string = "/api/report";
  public router: Router = express.Router();
  private report = reportModel;
  private user = userModel;

  constructor() {
    this.initRoutes();
  }

  public initRoutes() {
    this.router.post(
      `${this.path}/:id`,
      validationMiddleware(CreateReport),
      this.createReport
    );

    this.router.delete(`${this.path}/:id`, this.removeReport);
  }

  private getToken = (request: Request): string | null => {
    const authorization: string | undefined = request.get("authorization");
    if (authorization && authorization.toLowerCase().startsWith("bearer")) {
      return authorization.substring(7);
    }
    return null;
  };

  private createReport = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const token = this.getToken(request);
      const data: CreateReport = request.body;
      if (token && data) {
        const decodedToken = jwt.verify(
          token,
          "EnvSecret"
        ) as DataStoredInToken;
        if (decodedToken) {
          const user = await this.user.findById(decodedToken._id);
          if (user) {
            const newReport = new this.report({
              ...data,
              from: user._id,
              to: request.params.id
            });
            const saved = await newReport.save();
            await saved
              .populate("from")
              .populate("to")
              .execPopulate();
            response.json(saved);
          } else {
            next(new HttpException(403, "Forbidden"));
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

  private checkUserOwnership = async (
    reportId: string,
    userId: string
  ): Promise<boolean> => {
    const report = await this.report.findById(reportId);
    if (report) {
      if (report.from === userId) {
        return true;
      }
    }
    return false;
  };

  private removeReport = async (
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

        const user = await this.report.findById(decodedToken._id);
        if (user) {
          if (this.checkUserOwnership(request.params.id, user._id)) {
            const deleted = await this.report.findByIdAndRemove(
              request.params.id
            );
            if (deleted) {
              response.status(204).json({
                success: `removed ${request.params.id} successfully`
              });
            } else {
              next(new HttpException(500, "Internal server error"));
            }
          } else {
            next(new NotAuthorizedException());
          }
        } else {
          next(new NotAuthorizedException());
        }
      } else {
        next(new TokenMissingException());
      }
    } catch (e) {
      next(new HttpException(500, e.message));
    }
  };
}
