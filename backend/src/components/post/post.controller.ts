import express, { Response, Router, Request } from "express";
import Controller from "../../interfaces/controller.interface";
import postModel from "./post.model";
import { NextFunction } from "connect";
import { HttpException } from "../../exceptions/HttpException";
import RequestWithUser from "../../interfaces/requestWithUser";
import CreatePostDto, { UpdatePostDto } from "./post.dto";
import authMiddleware from "../../utils/auth.middleware";
import validationMiddleware from "../../utils/validation.middleware";
import { NotFoundException } from "../../exceptions/NotFoundException";
import jwt from "jsonwebtoken";
import DataStoredInToken from "../../interfaces/data.in.token.interface";
import userModel from "../user/user.model";

export class PostController implements Controller {
  public path: string = "/api/post";
  public router: Router = express.Router();
  private post = postModel;
  private user = userModel;

  constructor() {
    this.initRoutes();
  }

  public initRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.get(`${this.path}/:id`, this.getPostById);
    this.router.post(
      this.path,
      validationMiddleware(CreatePostDto),
      this.createPost
    );
    this.router.delete(`${this.path}/:id`, this.removePost);
  }

  private getAllPosts = async (request: Request, response: Response) => {
    const posts = await this.post.find().populate("byUser");
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
      next(new HttpException(404, "Post not found"));
    }
  };

  private getToken = (request: Request): string | null => {
    const authorization = request.get("authorization");
    if (authorization && authorization.toLowerCase().startsWith("bearer")) {
      return authorization.substring(7);
    }
    return null;
  };

  private createPost = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    const data: CreatePostDto = request.body;
    const token: string | null = this.getToken(request);
    if (token && data) {
      const decodedToken = jwt.verify(token, "EnvSecret") as DataStoredInToken;
      const user = await this.user.findById(decodedToken._id);
      if (user) {
        const newPost = new this.post({
          ...data,
          byUser: user._id
        });
        const saved = await newPost.save();
        await saved.populate("byUser").execPopulate();
        response.json(saved);
      } else {
        next(new HttpException(403, "Forbidden"));
      }
    }
  };

  private checkForUserOwnership = (
    posts: Array<string>,
    postId: string
  ): Boolean => {
    const checkForItem = posts.find(id => id === postId);
    if (checkForItem) {
      return true;
    }
    return false;
  };

  private removePost = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    const token = this.getToken(request);
    if (token) {
      const id = request.params.id;
      const decodedToken = jwt.verify(token, "EnvSecret") as DataStoredInToken;
      const user = await this.user.findById(decodedToken._id);
      if (user) {
        if (this.checkForUserOwnership(user.posts, id)) {
          const success = await this.post.findByIdAndRemove(id);
          if (success) {
            response.send(204).end();
          } else {
            next(new NotFoundException("Post was not found"));
          }
        }
        next(new HttpException(403, "Forbidden"));
      }
    } else {
      next(new HttpException(401, "Invalid token"));
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
        next(new NotFoundException("Post has not been found"));
      }
    } else {
      next(new HttpException(401, "Invalid token"));
    }
  };
}
