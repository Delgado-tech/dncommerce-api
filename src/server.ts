import express, { Request, Response } from 'express';
import usersRouter from './routes/users';
import productsRouter from './routes/products';
import requestsRouter from './routes/requests';
import paymentStatusRouter from './routes/paymentStatus';
import loginRouter from './routes/login';
import regenerateTokenRouter from './routes/regenerateToken';
import auth from './middlewares/auth';
import cookieParse from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';

const app = express();
const port = 5173;

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParse());

app.get("/", async (req: Request, res: Response) => {
    res.status(200).json({"message": "ok"});
});

app.use(loginRouter);
app.use(regenerateTokenRouter);
app.use(auth, usersRouter);
app.use(auth, productsRouter);
app.use(auth, requestsRouter);
app.use(auth, paymentStatusRouter);

app.listen(port, () => {
    console.log("Listening at port: " + port);
});
