import App from './app';
import validateEnv from './utils/validateEnv';
import { connectToDatabase } from './utils/helper';
import { UserController } from './components/user/user.controller';
import { LoginController } from './components/login/login.controller';
import { PostController } from './components/post/post.controller';

const { MONGO_URI } = process.env;

// this is here to check for valid env variables
// since the application breaks if they're invalid
validateEnv();

// since the env variables are now checked
// we can safely connect to mongodb
connectToDatabase(`${MONGO_URI}`);

// init controllers and port
const app = new App(
  [new UserController(), new LoginController(), new PostController()],
  3001
);

// start the server itself
app.listen();
