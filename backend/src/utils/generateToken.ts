// import jwt from 'jsonwebtoken';
// import { User } from '../db/entities/User.js';

// interface TokenPayload {
//     id: string;
//     email: string;
//     role: string;
// }

// const secretKey = process.env.SECRET_KEY || '';

// const generateToken = (id: string, email: string, role: string) => {
//     const payload: TokenPayload = { id, email, role };
//     const options = { expiresIn: '1d' };
//     // @ts-ignore
//     return jwt.sign(payload, secretKey, options);
// };

// const generateUserToken = (user: User) => {
//     return generateToken(user.id, user.email, user.role);
// };

// export {
//     generateUserToken
// }