import express from 'express';
import merge from 'lodash/merge.js';
import { getUserBySessionToken } from '../db/users.js';

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies['SMA-AUTH'];

    if (!sessionToken) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const existingUser = await getUserBySessionToken(sessionToken);

    if (!existingUser) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    merge(req, { identity: existingUser });

    return next();
  } catch (error) {
    console.error(error);
    return res.sendStatus(400);
  }
};
