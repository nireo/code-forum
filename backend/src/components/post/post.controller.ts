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
import InternalServerException from "../../exceptions/InternalServer";
import TokenMissingException from "../../exceptions/TokenMissing";

export class PostController implements Controller {
    public path: string = "/api/post";
    public router: Router = express.Router();
    private post = postModel;
    private user = userModel;

    constructor() {
        this.initRoutes();
    }

    public initRoutes() {
        this.router.get(`${this.path}/:page`, this.getAllPosts);
        this.router.get(`${this.path}/:id`, this.getPostById);
        this.router.get(`${this.path}/c/:category`, this.getPostsFromCategory);
        this.router.get(`${this.path}/user/:id`, this.getPostsFromUser);
        this.router.get(`${this.path}/search/:term`, this.searchForPosts);
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
        this.router.get(`${this.path}/recent`, this.getRecentTitles);
        this.router.get(`${this.path}/amount`, this.getAmountOfPosts);
    }

    private getAllPosts = async (
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            if (request.params.page) {
                let posts;
                // unary operator converts page string into integer
                const page: number = +request.params.page;
                if (page === 1) {
                    posts = await this.post
                        .find()
                        .populate("byUser")
                        .populate("comments")
                        .populate({ path: "comments", populate: "byUser" })
                        .limit(3);
                } else {
                    posts = await this.post
                        .find()
                        .populate("byUser")
                        .populate("comments")
                        .populate({ path: "comments", populate: "user" })
                        .skip(3 * page - 3)
                        .limit(3 * page);
                }
                response.json(posts);
            } else {
                next(new HttpException(500, "Please provide a page number"));
            }
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
            if (!token) {
                next(new TokenMissingException());
                return;
            }
            const id = request.params.id;
            const decodedToken = jwt.verify(
                token,
                "EnvSecret"
            ) as DataStoredInToken;
            if (!decodedToken) {
                next(new TokenMissingException());
                return;
            }
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
            if (!token) {
                next(new TokenMissingException());
                return;
            }

            const decodedToken = jwt.verify(
                token,
                "EnvSecret"
            ) as DataStoredInToken;
            if (!decodedToken) {
                next(new TokenMissingException());
                return;
            }

            const user = await this.user.findById(decodedToken._id);
            if (!user) {
                next(new NotFoundException("User has not been found"));
                return;
            }

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

    // this is for the feature on the frontpage to get the most recent posts
    private getRecentTitles = async (
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            interface PostTitleAndId {
                title: string;
                _id: string;
            }
            let filtered: PostTitleAndId[] = [];
            const posts = await this.post.find().limit(6);
            if (posts) {
                posts.forEach(p => {
                    filtered = filtered.concat({ title: p.title, _id: p._id });
                });
                response.json(filtered);
            } else {
                next(new NotFoundException("No posts were found."));
            }
        } catch (e) {
            next(new HttpException(500, e.message));
        }
    };

    private getAmountOfPosts = async (
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            await this.post.countDocuments({}, (err: any, results: number) => {
                if (err) {
                    next(new InternalServerException());
                    return;
                }

                response.json({
                    amount: results
                });
            });
        } catch (e) {
            next(e);
        }
    };

    private searchForPosts = async (
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            await this.post.find(
                {
                    $text: { $search: request.params.term }
                },
                (err: any, results: any) => {
                    if (err) {
                        next(new InternalServerException());
                        return;
                    }

                    response.json(results);
                }
            );
        } catch (e) {
            next(new HttpException(500, e.message));
        }
    };
}
