import { Router } from 'express';
import { updateUserOneExperience } from '../controllers/userController';
import { protect } from '../services/authServices';
import validateRequestMiddleware from '../middlewares/validator';
import { userCreationValidatorStepTwo } from '../middlewares/validators/userValidator';

const userRouter = Router();
userRouter.put(
    '/updateExperience/:id',
    protect,
    validateRequestMiddleware(userCreationValidatorStepTwo),
    updateUserOneExperience,
);

export default userRouter;
