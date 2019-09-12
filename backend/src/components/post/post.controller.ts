import express, { Response, Router, Request } from 'express';
import Controller from '../../interfaces/controller.interface';

export class PostController implements Controller {
  public path: string = '/api/post';
  public router: Router = express.Router();

  constructor() {
    this.initRoutes();
  }

  public initRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.get(`${this.path}/:id`, this.getPostById);
  }

  private getAllPosts = (request: Request, response: Response) => {};
  private getPostById = (request: Request, response: Response) => {};
}
