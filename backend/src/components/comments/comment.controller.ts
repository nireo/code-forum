import express, { Response, Router, Request } from 'express';
import Controller from '../../interfaces/controller.interface';
import commentModel from './comment.model';
import { NextFunction } from 'connect';
import { HttpException } from '../../exceptions/HttpException';

export class CommentController implements Controller {
  public path: string = '/api/comment';
  public router: Router = express.Router();
  private comment = commentModel;

  constructor() {
    this.initRoutes();
  }

  public initRoutes() {
    // comments won't get a 'get all method' since there isn't any point
    // in initializing all the comments on the whole website
    this.router.get(`${this.path}/:id`, this.getCommentsInPost);
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
}
