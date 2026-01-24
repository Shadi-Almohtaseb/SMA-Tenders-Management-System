import express from 'express';
import { createUser, getUserByEmail } from '../db/users.js';
import { authentication, random } from '../helpers/index.js';

export const registerUser = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res.status(400).json({ message: 'Email, password and username are required' });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const salt = random();
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password)
      }
    })

    return res.status(201).json({ message: 'User registered successfully', user })
  } catch (error) {
    console.log(error);
    return res.sendStatus(400)
  }
}

export const loginUser = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await getUserByEmail(email).select('+authentication.password +authentication.salt');
    if (!user || !user.authentication || !user.authentication.salt) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const expectedHash = authentication(user.authentication.salt, password);
    if (user.authentication.password !== expectedHash) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const salt = random();
    user.authentication.sessionToken = authentication(salt, user._id.toString());

    await user.save();

    res.cookie('SMA-AUTH', user.authentication.sessionToken, { httpOnly: true, secure: true, sameSite: 'strict' });
    return res.status(200).json({ message: 'Login successful', user })
  } catch (error) {
    console.log(error);
    return res.sendStatus(400)
  }
}