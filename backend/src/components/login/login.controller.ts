import { Request, Response, NextFunction } from 'express';

exports.handleLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password }: String = req.body;
    return res.json({ username, password });
  } catch (error) {
    next(error);
  }
};
