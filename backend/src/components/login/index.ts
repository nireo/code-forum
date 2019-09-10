import express from 'express';
import { handleLogin } from './loginController';
const router: express.Router = express.Router();

router.post('/', handleLogin);

export default Router;
