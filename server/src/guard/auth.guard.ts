import { Request, Response, NextFunction } from 'express';

export const _auth_guard = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user_id = req.cookies.user_id;
  console.log('USER ID FROM COOKIE: ', req.cookies);

  res.locals.user = {
    id: user_id,
  };
  next();
};
