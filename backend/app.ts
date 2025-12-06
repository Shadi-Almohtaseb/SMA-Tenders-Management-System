import { Request, Response } from "express";
import dotenv from 'dotenv';
dotenv.config();
import express from 'express'
import cookieParser from 'cookie-parser'
import "reflect-metadata"
import { customErrorHandler, DefaultErrorHandler } from "./src/middleware/errorHandlers.js";
import fileUpload from "express-fileupload";
import cors from 'cors';

const app = express();
const PORT = 3000;
app.use(cors({
    origin: '*',
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload({ limits: { fileSize: 50 * 1024 * 1024 } }))
app.use(cookieParser());

app.use(customErrorHandler)
app.use(DefaultErrorHandler)

app.get("/", (req: Request, res: Response) => {
    res.send('Server UP!');
})

app.listen(PORT, () => {
    console.log(`App is running and listening on host http://localhost:${PORT}`);
});

export default app;