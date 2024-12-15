import { Router } from 'express';
import {
    createUserOneExperience,
    deleteMe,
    deleteUserOneExperience,
    updateUserOneExperience,
} from '../controllers/userController';
import { protect } from '../services/authServices';
import validateRequestMiddleware from '../middlewares/validator';
import {
    updateUserOneExperienceValidator,
    createUserOneExperienceValidator,
    deleteUserOneExperienceValidator,
} from '../middlewares/validators/userValidator';

const userRouter = Router();

userRouter.post(
    '/addNewExperience',
    protect,
    validateRequestMiddleware(createUserOneExperienceValidator),
    createUserOneExperience,
);
userRouter.put(
    '/updateExperience/:id',
    protect,
    validateRequestMiddleware(updateUserOneExperienceValidator),
    updateUserOneExperience,
);

userRouter.delete(
    '/deleteExperience/:id',
    protect,
    validateRequestMiddleware(deleteUserOneExperienceValidator),
    deleteUserOneExperience,
);

userRouter.delete('/deleteMe', protect, deleteMe);

export default userRouter;
