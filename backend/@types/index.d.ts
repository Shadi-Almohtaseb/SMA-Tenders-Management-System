import express from 'express';
// import { User } from '../src/db/entities/User.ts';

interface pagination {
    page: string;
    pageSize: string;
}

// namespace ExpressNS {
//     export interface RequestWithUser extends express.Request {
//         user?: User | null;
//     }
// }