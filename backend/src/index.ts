import App from './app';
import validateEnv from './utils/validateEnv';
import { connectToDatabase } from './utils/helper';

const { MONGO_URI } = process.env;

// this is here to check for valid env variables
// since the application breaks if they're invalid
validateEnv();

// since the env variables are now checked
// we can safely connect to mongodb
connectToDatabase(`${MONGO_URI}`);

const app = new App(3001);
app.listen();
