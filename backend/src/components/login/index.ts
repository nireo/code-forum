import express from 'express';
import { handleLogin } from './login.controller';
const router: express.Router = express.Router();

router.post('/', handleLogin);

export default Router;
