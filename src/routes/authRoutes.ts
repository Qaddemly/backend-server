import express from 'express';
import { activateEmail, signUp } from '../controllers/authControllers';
const authRouter = express.Router();

authRouter.post('/signup', signUp);
authRouter.put('/activateEmail/:activationToken', activateEmail);

export default authRouter;
