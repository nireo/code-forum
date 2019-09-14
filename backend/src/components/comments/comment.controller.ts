import express, { Response, Router, Request } from 'express';
import Controller from '../../interfaces/controller.interface';
import commentModel from './comment.model';
import { NextFunction } from 'connect';
import { HttpException } from '../../exceptions/HttpException';
import CreateCommentDto from './comment.dto';
import RequestWithUser from '../../interfaces/requestWithUser';
import postModel from '../post/post.model';
import authMiddleware from '../../utils/auth.middleware';
import validationMiddleware from '../../utils/validation.middleware';
import { NotFoundException } from '../../exceptions/NotFoundException';
import e from 'express';

export class CommentController implements Controller {
  public path: string = '/api/comment';
  public router: Router = express.Router();
  private comment = commentModel;
  private post = postModel;

  constructor() {
    this.initRoutes();
  }

  public initRoutes() {
    // comments won't get a 'get all method' since there isn't any point
    // in initializing all the comments on the whole website
    this.router.get(`${this.path}/:id`, this.getCommentsInPost);
    this.router
      .all('/*', authMiddleware)
      .post(
        `${this.path}/:id`,
        validationMiddleware(CreateCommentDto),
        this.createComment
      )
      .delete(`${this.path}/:id`, this.deleteComment);
  }

  private getCommentsInPost = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    const comments = await this.comment
      .find({ toPost: request.params.id })
      .populate('byUser');
    if (comments) {
      response.json(comments);
    } else {
      next(new HttpException(404, 'No comments found for post'));
    }
  };

  private createComment = async (
    request: RequestWithUser,
    response: Response,
    next: NextFunction
  ) => {
    const post = await this.post.findById(request.params.id);
    if (post) {
      const data: CreateCommentDto = request.body;
      if (request.user) {
        const newPost = new this.comment({
          ...data,
          byUser: request.user._id,
          toPost: post._id
        });
        const savedComment = await newPost.save();
        post.comments = post.comments.concat(savedComment._id);
        const saved = await post.save();
        response.json(saved);
      } else {
        next(new HttpException(403, 'Forbidden'));
      }
    } else {
      next(new NotFoundException('Post not found'));
    }
  };

  private deleteComment = async (
    request: RequestWithUser,
    response: Response,
    next: NextFunction
  ) => {
    if (request.user) {
      const comment = await this.comment.findById(request.params.id);
      if (comment) {
        if (comment.byUser === request.user._id) {
          await this.comment.findByIdAndRemove(request.params.id);
          response.status(204).end();
        } else {
          next(new HttpException(403, 'Forbidden'));
        }
      } else {
        next(new NotFoundException('Post was not found'));
      }
    } else {
      next(new HttpException(403, 'Forbidden'));
    }
  };
}
