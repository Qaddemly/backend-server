import express from 'express';
import { globalErrorHandler } from './middlewares/error.middleWare';
import catchAsync from 'express-async-handler';
import User from './models/userModel';

const app = express();
app.use(express.json());

app.use(globalErrorHandler);

app.post(
    '/',
    catchAsync(async (req, res) => {
        const user = new User(req.body);
        await user.save();
        res.json(user);
    }),
);

export default app;
