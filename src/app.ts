import express from 'express';
import { globalErrorHandler } from './middlewares/error.middleWare';
import validateRequestMiddleware from './middlewares/validator';
import { userCreationValidatorStepTwo } from './middlewares/validators/userValidator';

const app = express();
app.use(express.json());

app.post(
    '/testApi',
    validateRequestMiddleware(userCreationValidatorStepTwo),
    (req, res) => {
        res.json(req.body);
    },
);

app.use(globalErrorHandler);

export default app;
