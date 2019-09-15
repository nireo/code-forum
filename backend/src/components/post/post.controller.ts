import express, { Response, Router, Request } from 'express';
import Controller from '../../interfaces/controller.interface';
import postModel from './post.model';
import { NextFunction } from 'connect';
import { HttpException } from '../../exceptions/HttpException';
import RequestWithUser from '../../interfaces/requestWithUser';
import CreatePostDto, { UpdatePostDto } from './post.dto';
import authMiddleware from '../../utils/auth.middleware';
import validationMiddleware from '../../utils/validation.middleware';
import { NotFoundException } from '../../exceptions/NotFoundException';

export class PostController implements Controller {
  public path: string = '/api/post';
  public router: Router = express.Router();
  private post = postModel;
  constructor() {
    this.initRoutes();
  }

  public initRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.get(`${this.path}/:id`, this.getPostById);
    this.router
      .all('/*', authMiddleware)
      .post(this.path, validationMiddleware(CreatePostDto), this.createPost)
      .patch(
        `${this.path}/:id`,
        validationMiddleware(UpdatePostDto),
        this.updatePost
      )
      .delete(`${this.path}/:id`, this.removePost);
  }

  private getAllPosts = async (request: Request, response: Response) => {
    const posts = await this.post.find().populate('byUser');
    response.json(posts);
  };

  private getPostById = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    const post = this.post.findById(request.params.id);
    if (post) {
      response.json(post);
    } else {
      next(new HttpException(404, 'Post not found'));
    }
  };

  private createPost = async (
    request: RequestWithUser,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    const data: CreatePostDto = request.body;
    if (request.user) {
      const newPost = new this.post({
        ...data,
        byUser: request.user._id
      });
      const saved = await newPost.save();
      await saved.populate('byUser').execPopulate();
      response.json(saved);
    } else {
      next(new HttpException(403, 'Forbidden'));
    }
  };

  private removePost = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    const id = request.params.id;
    const success = await this.post.findByIdAndRemove(id);
    if (success) {
      response.send(204).end();
    } else {
      next(new NotFoundException('Post was not found'));
    }
  };

  private updatePost = async (
    request: RequestWithUser,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    if (request.user) {
      const newData: UpdatePostDto = request.body;
      const newPost = this.post.findByIdAndUpdate(request.params.id, newData, {
        new: true
      });
      if (newPost) {
        response.json(newPost);
      } else {
        // this is since most of the time 'findByIdAndUpdate' only returns
        // one type of error when the post has not been found.
        next(new NotFoundException('Post has not been found'));
      }
    } else {
      next(new HttpException(401, 'Invalid token'));
    }
  };
}
