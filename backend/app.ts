import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './src/routes/index.js';
import {
  customErrorHandler,
  DefaultErrorHandler,
} from './src/middleware/errorHandlers.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* -------------------- Middlewares -------------------- */
const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload({ limits: { fileSize: 50 * 1024 * 1024 } }));
app.use(cookieParser());

/* -------------------- Routes -------------------- */
app.get('/', (req: Request, res: Response) => {
  res.send('Server UP!');
});

app.use('/', router());

/* -------------------- Error Handlers (LAST) -------------------- */
app.use(customErrorHandler);
app.use(DefaultErrorHandler);

/* -------------------- DB + Server Bootstrap -------------------- */
async function startServer() {
  try {
    mongoose.set('strictQuery', true);
    mongoose.set('bufferCommands', false);

    await mongoose.connect(process.env.MONGO_URI as string, {
      dbName: 'sma-tenders',
    });

    console.log('✅ MongoDB connected (Mongoose)');

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
