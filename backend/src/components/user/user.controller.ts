import express, { Response, Router, Request } from "express";
import User from "./user.interface";
import Controller from "../../interfaces/controller.interface";
import userModel from "./user.model";
import { HttpException } from "../../exceptions/HttpException";
import { NextFunction } from "connect";
import { NotFoundException } from "../../exceptions/NotFoundException";
import jwt from "jsonwebtoken";
import DataStoredInToken from "../../interfaces/data.in.token.interface";
import bcrypt from "bcrypt";
import validationMiddleware from "../../utils/validation.middleware";
import { UpdatePassword, UpdateUsername, UpdateEmail } from "./user.dto";
import InternalServerException from "../../exceptions/InternalServer";

export class UserController implements Controller {
    public path: string = "/api/user";
    public router: Router = express.Router();
    private user = userModel;

    constructor() {
        this.initRoutes();
    }

    public initRoutes() {
        this.router.get(this.path, this.getAllUsers);
        this.router.get(`${this.path}/amount/main`, this.getAmountOfUsers);
        this.router.get(`${this.path}/amount/:amount`, this.getUserById);
        this.router.get(`${this.path}/search/:term`, this.searchForUser);
        this.router.patch(`${this.path}/:id`, this.updateUser);
        this.router.delete(`${this.path}/:id`, this.deleteUser);
        this.router.get(
            `${this.path}/username/:username`,
            this.getUserWithUsername
        );
        this.router.post(
            `${this.path}/update`,
            validationMiddleware(UpdatePassword),
            this.changeUserPassword
        );
        this.router.post(
            `${this.path}/update/username`,
            validationMiddleware(UpdateUsername),
            this.changeUsername
        );
        this.router.post(
            `${this.path}/update/email`,
            validationMiddleware(UpdateEmail),
            this.changeEmail
        );
    }

    private getToken = (request: Request): string | null => {
        const authorization: string | undefined = request.get("authorization");
        if (authorization && authorization.toLowerCase().startsWith("bearer")) {
            return authorization.substring(7);
        }
        return null;
    };

    private getAllUsers = async (
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            if (request.params.amount) {
                let users;
                // unary operator converts page string into integer
                const amount: number = +request.params.amount;
                if (amount > 10) {
                    next(new HttpException(400, "Too many users requested"));
                } else {
                    users = await this.user.find().limit(amount);
                    if (users) {
                        response.send(users);
                    } else {
                        next(new NotFoundException("No users have been found"));
                    }
                }
            } else {
                next(
                    new HttpException(
                        400,
                        "You need to add amount as a parameter"
                    )
                );
            }
        } catch (e) {
            next(new HttpException(500, e.message));
        }
    };

    private getUserById = async (
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const user = await this.user.findById(request.params.id);
            if (user) {
                response.json(user);
            } else {
                next(
                    new NotFoundException(
                        `User with id ${request.params.id} not found`
                    )
                );
            }
        } catch (e) {
            next(new HttpException(500, e.message));
        }
    };

    private updateUser = async (
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
                    const userData: User = request.body;
                    const user = await this.user.findByIdAndUpdate(
                        decodedToken._id,
                        userData,
                        { new: true }
                    );
                    response.json(user);
                } else {
                    next(new HttpException(401, "Invalid token"));
                }
            }
        } catch (e) {
            next(new HttpException(500, e.message));
        }
    };

    private deleteUser = async (
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
                    await this.user
                        .findByIdAndDelete(decodedToken._id)
                        .then(success => {
                            if (success) {
                                response.status(204);
                            } else {
                                // post not found
                                next(new HttpException(404, "User not found"));
                            }
                        });
                }
            }
        } catch (e) {
            next(new HttpException(500, e.message));
        }
    };

    private getUserWithUsername = async (
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const user = await this.user.find({
                username: request.params.username
            });
            if (user) {
                response.json(user);
            } else {
                next(
                    new NotFoundException(
                        `${request.params.username} has not been found.`
                    )
                );
            }
        } catch (e) {
            next(new HttpException(500, e.message));
        }
    };

    private changeUserPassword = async (
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const token = this.getToken(request);
            const { password } = request.body;
            if (token) {
                const decodedToken = jwt.verify(
                    token,
                    "EnvSecret"
                ) as DataStoredInToken;
                if (decodedToken) {
                    const user = await this.user.findById(request.params.id);
                    if (user) {
                        const hashedPassword = await bcrypt.hash(password, 10);
                        const updated = await this.user.findById(
                            decodedToken._id,
                            { ...user, password: hashedPassword },
                            { new: true }
                        );
                        if (updated) {
                            response.json(updated);
                        } else {
                            next(
                                new HttpException(500, "Internal server error")
                            );
                        }
                    } else {
                        next(new NotFoundException("User not found"));
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

    // for checking functions true = user already exists and false = doesn't
    private checkEmailDuplicate = async (email: string): Promise<Boolean> => {
        const user = await this.user.find({ email: email });
        if (user) {
            return true;
        }
        return false;
    };

    private checkUsernameDuplicate = async (
        username: string
    ): Promise<Boolean> => {
        const user = await this.user.find({ username: username });
        if (user) {
            return true;
        }
        return false;
    };

    private changeUsername = async (
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            if (this.checkUsernameDuplicate(request.body.username)) {
                next(new HttpException(403, "User already exists"));
            } else {
                const token = await this.getToken(request);
                if (token) {
                    const decodedToken = jwt.verify(
                        token,
                        "EnvSecret"
                    ) as DataStoredInToken;
                    if (decodedToken) {
                        const userData = await this.user.findById(
                            decodedToken._id
                        );
                        if (userData) {
                            const user = await this.user.findByIdAndUpdate(
                                decodedToken._id,
                                {
                                    ...userData,
                                    username: request.body.username
                                },
                                { new: true }
                            );
                            if (user) {
                                response.json(user);
                            } else {
                                next(
                                    new HttpException(
                                        500,
                                        "Internal server error"
                                    )
                                );
                            }
                        } else {
                            next(
                                new NotFoundException("User has not been found")
                            );
                        }
                    } else {
                        next(new HttpException(401, "Invalid token"));
                    }
                } else {
                    next(new HttpException(401, "Invalid token"));
                }
            }
        } catch (e) {
            next(new HttpException(500, e.message));
        }
    };

    private changeEmail = async (
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { email } = request.body;
            if (this.checkEmailDuplicate(email)) {
                next(new HttpException(403, "User already exists"));
            }
            const token = await this.getToken(request);
            if (token) {
                const decodedToken = jwt.verify(
                    token,
                    "EnvSecret"
                ) as DataStoredInToken;
                if (decodedToken) {
                    const userData = await this.user.findById(decodedToken._id);
                    if (userData) {
                        const user = await this.user.findByIdAndUpdate(
                            userData._id,
                            { ...userData, email: email },
                            { new: true }
                        );
                        if (user) {
                            response.json(user);
                        } else {
                            next(
                                new HttpException(500, "Internal server error")
                            );
                        }
                    } else {
                        next(new NotFoundException("User has not been found"));
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

    private getAmountOfUsers = async (
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            await this.user.countDocuments({}, (err: any, results: number) => {
                if (err) {
                    next(new InternalServerException());
                    return;
                }

                response.json({
                    amount: results
                });
            });
        } catch (e) {
            next(new InternalServerException());
        }
    };

    private searchForUser = async (
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            await this.user.find(
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
