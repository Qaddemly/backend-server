import express from 'express';
import { globalErrorHandler } from './middlewares/error.middleWare';
import validateRequestMiddleware from './middlewares/validator';
import { userCreationValidatorStepOne } from './middlewares/validators/userValidator';

const app = express();
app.use(express.json());

app.post(
    '/testApi',
    validateRequestMiddleware(userCreationValidatorStepOne),
    (req, res) => {
        res.json(req.body);
    },
);

app.use(globalErrorHandler);

export default app;
