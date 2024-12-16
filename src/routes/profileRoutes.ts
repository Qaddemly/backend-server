import { Router } from 'express';
import {
    createUserOneExperience,
    createUserOneLanguage,
    createUserOneSkill,
    deleteMe,
    deleteUserOneExperience,
    deleteUserOneLanguage,
    deleteUserOneSkill,
    updateUserOneEducation,
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
    createUserOneLanguageValidator,
    deleteUserOneLanguageValidator,
    updateUserOneEducationValidator,
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

profileRouter.post(
    '/addNewLanguage',
    protect,
    validateRequestMiddleware(createUserOneLanguageValidator),
    createUserOneLanguage,
);

profileRouter.delete(
    '/deleteLanguage/:id',
    protect,
    validateRequestMiddleware(deleteUserOneLanguageValidator),
    deleteUserOneLanguage,
);

profileRouter.put(
    '/updateEducation',
    protect,
    validateRequestMiddleware(updateUserOneEducationValidator),
    updateUserOneEducation,
);

profileRouter.delete('/deleteMe', protect, deleteMe);

export default profileRouter;
