import { Router } from 'express';
import {
    createUserOneExperience,
    createUserOneSkill,
    deleteMe,
    deleteUserOneExperience,
    deleteUserOneSkill,
    updateUserOneExperience,
} from '../controllers/profileController';
import { protect } from '../services/authServices';
import validateRequestMiddleware from '../middlewares/validator';
import {
    updateUserOneExperienceValidator,
    createUserOneExperienceValidator,
    deleteUserOneExperienceValidator,
    createUserOneSkillValidator,
    deleteUserOneSkillValidator,
} from '../middlewares/validators/profileValidator';

const profileRouter = Router();

profileRouter.post(
    '/addNewExperience',
    protect,
    validateRequestMiddleware(createUserOneExperienceValidator),
    createUserOneExperience,
);
profileRouter.put(
    '/updateExperience/:id',
    protect,
    validateRequestMiddleware(updateUserOneExperienceValidator),
    updateUserOneExperience,
);

profileRouter.delete(
    '/deleteExperience/:id',
    protect,
    validateRequestMiddleware(deleteUserOneExperienceValidator),
    deleteUserOneExperience,
);

profileRouter.post(
    '/addNewSkill',
    protect,
    validateRequestMiddleware(createUserOneSkillValidator),
    createUserOneSkill,
);

profileRouter.delete(
    '/deleteSkill/:id',
    protect,
    validateRequestMiddleware(deleteUserOneSkillValidator),
    deleteUserOneSkill,
);

profileRouter.delete('/deleteMe', protect, deleteMe);

export default profileRouter;
