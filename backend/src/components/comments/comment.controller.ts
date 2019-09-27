import express, { Response, Router, Request } from "express";
import Controller from "../../interfaces/controller.interface";
import commentModel from "./comment.model";
import { NextFunction } from "connect";
import { HttpException } from "../../exceptions/HttpException";
import CreateCommentDto, { UpdateCommentDto } from "./comment.dto";
import RequestWithUser from "../../interfaces/requestWithUser";
import postModel from "../post/post.model";
import authMiddleware from "../../utils/auth.middleware";
import validationMiddleware from "../../utils/validation.middleware";
import { NotFoundException } from "../../exceptions/NotFoundException";
import jwt from "jsonwebtoken";
import userModel from "../user/user.model";
import DataStoredInToken from "../../interfaces/data.in.token.interface";

export class CommentController implements Controller {
  public path: string = "/api/comment";
  public router: Router = express.Router();
  private comment = commentModel;
  private post = postModel;
  private user = userModel;

  constructor() {
    this.initRoutes();
  }

  public initRoutes() {
    // comments won't get a 'get all method' since there isn't any point
    // in initializing all the comments on the whole website
    this.router.get(`${this.path}/:id`, this.getCommentsInPost);
    this.router.post(
      `${this.path}/:id`,
      validationMiddleware(CreateCommentDto),
      this.createComment
    );
    this.router.delete(`${this.path}/:id`, this.deleteComment);
    this.router.patch(
      `${this.path}/:id`,
      validationMiddleware(UpdateCommentDto),
      this.updateComment
    );
  }

  private getToken = (request: Request): string | null => {
    const authorization: string | undefined = request.get("authorization");
    if (authorization && authorization.toLowerCase().startsWith("bearer")) {
      return authorization.substring(7);
    }
    return null;
  };

  private getCommentsInPost = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const comments = await this.comment
        .find({ toPost: request.params.id })
        .populate("byUser");
      if (comments) {
        response.json(comments);
      } else {
        next(new HttpException(404, "No comments found for post"));
      }
    } catch (e) {
      next(new HttpException(500, e.message));
    }
  };

  private createComment = async (
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
          const post = await this.post.findById(request.params.id);
          if (post) {
            const user = await this.user.findById(decodedToken._id);
            const data: CreateCommentDto = request.body;
            if (user) {
              const newPost = new this.comment({
                ...data,
                byUser: user._id,
                toPost: post._id
              });
              const newComment = await newPost.save();
              response.json(newComment);
            } else {
              next(new HttpException(403, "Forbidden"));
            }
          } else {
            next(new NotFoundException("Post not found"));
          }
          next(new HttpException(403, "Forbidden"));
        }
        next(new HttpException(403, "Forbidden"));
      }
    } catch (e) {
      next(new HttpException(500, e.message));
    }
  };

  private deleteComment = async (
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
        const user = await this.user.findById(decodedToken._id);
        if (user) {
          const comment = await this.comment.findById(request.params.id);
          if (comment) {
            if (comment.byUser === user._id) {
              await this.comment.findByIdAndRemove(request.params.id);
              response.status(204).end();
            } else {
              next(new HttpException(403, "Forbidden"));
            }
          } else {
            next(new NotFoundException("Post was not found"));
          }
        } else {
          next(new HttpException(403, "Forbidden"));
        }
      }
    } catch (e) {
      next(new HttpException(500, e.message));
    }
  };

  private updateComment = async (
    request: RequestWithUser,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (request.user) {
        const newData: UpdateCommentDto = request.body;
        const newPost = this.comment.findByIdAndUpdate(
          request.params.id,
          newData,
          { new: true }
        );
        if (newPost) {
          response.json(newPost);
        } else {
          next(new NotFoundException("Comment has not been found"));
        }
      } else {
        next(new HttpException(401, "Not a valid token"));
      }
    } catch (e) {
      next(new HttpException(500, e.message));
    }
  };
}
