import express, { Response, Router, Request } from "express";
import Controller from "../../interfaces/controller.interface";
import commentModel from "../comments/comment.model";
import replyModel from "./reply.model";
import authMiddleware from "../../utils/auth.middleware";
import validationMiddleware from "../../utils/validation.middleware";
import { CreateReplyDto } from "./reply.dto";
import RequestWithUser from "../../interfaces/requestWithUser";

export class ReplyController implements Controller {
  public path: string = "/api/reply";
  public router: Router = express.Router();
  private comment = commentModel;
  private reply = replyModel;

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    this.router.post(
      `${this.path}/:id`,
      authMiddleware,
      validationMiddleware(CreateReplyDto),
      this.createReply
    );
  }

  private createReply = async (
    request: RequestWithUser,
    response: Response
  ): Promise<void> => {};
}
