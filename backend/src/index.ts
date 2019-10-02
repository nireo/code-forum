import App from "./app";
import validateEnv from "./utils/validateEnv";
import { connectToDatabase } from "./utils/helper";
import { UserController } from "./components/user/user.controller";
import { PostController } from "./components/post/post.controller";
import { AuthenticationController } from "./components/authentication/authentication.controller";
import { CommentController } from "./components/comments/comment.controller";
import { SocketHandler } from "./socket/socket-manager";

const { MONGO_URI } = process.env;

// this is here to check for valid env variables
// since the application breaks if they're invalid
validateEnv();

// since the env variables are now checked
// we can safely connect to mongodb
connectToDatabase(`${MONGO_URI}`);

// init controllers
const app = new App(
  [
    new UserController(),
    new AuthenticationController(),
    new PostController(),
    new CommentController()
  ],
  new SocketHandler(),
  3001
);

// start the server itself
app.listen();
