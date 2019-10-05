import express, { Response, Router, Request } from "express";
import Controller from "../../interfaces/controller.interface";
import postModel from "./post.model";
import { NextFunction } from "connect";
import { HttpException } from "../../exceptions/HttpException";
import CreatePostDto, { UpdatePostDto } from "./post.dto";
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
    this.router.get(`${this.path}/c/:category`, this.getPostsFromCategory);
    this.router.get(`${this.path}/user/:id`, this.getPostsFromUser);
    this.router.post(
      this.path,
      validationMiddleware(CreatePostDto),
      this.createPost
    );
    this.router.delete(`${this.path}/:id`, this.removePost);
    this.router.patch(
      `${this.path}/:id`,
      validationMiddleware(UpdatePostDto),
      this.updatePost
    );
  }

  private getAllPosts = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const posts = await this.post
        .find()
        .populate("byUser")
        .populate("comments")
        .populate({ path: "comments", populate: "byUser" });
      response.json(posts);
    } catch (e) {
      next(new HttpException(500, e.message));
    }
  };

  private getPostById = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const post = await this.post
        .findById(request.params.id)
        .populate("byUser")
        .populate("comments")
        .populate({ path: "comments", populate: "byUser" });
      response.json(post);
    } catch (e) {
      next(new HttpException(500, e.message));
    }
  };

  private getToken = (request: Request): string | null => {
    const authorization: string | undefined = request.get("authorization");
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
    try {
      const data: CreatePostDto = request.body;
      const token: string | null = this.getToken(request);
      if (token && data) {
        const decodedToken = jwt.verify(
          token,
          "EnvSecret"
        ) as DataStoredInToken;
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
    } catch (e) {
      next(new HttpException(500, e.message));
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
    try {
      const token = this.getToken(request);
      if (token) {
        const id = request.params.id;
        const decodedToken = jwt.verify(
          token,
          "EnvSecret"
        ) as DataStoredInToken;
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
    } catch (e) {
      next(new HttpException(500, e.message));
    }
  };

  private updatePost = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const token = this.getToken(request);
      const id: string = request.params.id;
      if (token) {
        const decodedToken = jwt.verify(
          token,
          "EnvSecret"
        ) as DataStoredInToken;
        const user = await this.user.findById(decodedToken._id);
        if (user) {
          if (this.checkForUserOwnership(user.posts, id)) {
            const newData: UpdatePostDto = request.body;
            const newPost = this.post.findByIdAndUpdate(id, newData, {
              new: true
            });
            if (newPost) {
              response.json(newPost);
            } else {
              // this is since most of the time 'findByIdAndUpdate' only returns
              // one type of error when the post has not been found.
              next(new NotFoundException("Post has not been found"));
            }
            next(new HttpException(403, "Forbidden"));
          } else {
            next(new HttpException(403, "Forbidden"));
          }
        } else {
          next(new HttpException(403, "Forbidden"));
        }
      } else {
        next(new HttpException(401, "Invalid token"));
      }
    } catch (e) {
      next(new HttpException(500, e.message));
    }
  };

  private getPostsFromCategory = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const results = await this.post.find({});
      const filteredResults = results.filter(
        r => r.category === request.params.category
      );
      if (filteredResults.length >= 1) {
        response.json(filteredResults);
      } else {
        next(
          new NotFoundException(
            `Posts in category ${request.params.category} have not been found`
          )
        );
      }
    } catch (e) {
      next(new HttpException(500, e.message));
    }
  };

  private getPostsFromUser = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const posts = await this.post
        .find({ byUser: request.params.id })
        .populate("-comments")
        .populate("-byUser");
      if (posts) {
        response.json(posts);
      } else {
        new NotFoundException(
          `Posts from user ${request.params.id} have not been found.`
        );
      }
    } catch (e) {
      next(new HttpException(500, e.message));
    }
  };
}
