import { Router } from 'express';
import {
    createUserOneExperience,
    createUserOneLanguage,
    createUserOneOrMoreSkills,
    deleteMe,
    deleteUserOneExperience,
    deleteUserOneOrMoreLanguage,
    deleteUserOneOrMoreSkill,
    updateUserOneEducation,
    updateUserOneExperience,
    deleteUserOneEducation,
    updateUserBasicInfo,
    createUserOneEducation,
    addUserOneResume,
    deleteUserOneResume,
    getAllUserResumes,
} from '../controllers/profileController';
import {
    protect,
    resizeUserImage,
    savingResumeInDisk,
    uploadProfilePic,
    uploadResume,
    uploadUserPICAndResume,
} from '../services/authServices';
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
    createUserOneEducationValidator,
    updateUserBasicInfoValidator,
    createUserOneResumeValidator,
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
    createUserOneOrMoreSkills,
);

profileRouter.delete(
    '/deleteSkill',
    protect,
    validateRequestMiddleware(deleteUserOneSkillValidator),
    deleteUserOneOrMoreSkill,
);

profileRouter.post(
    '/addNewLanguage',
    protect,
    validateRequestMiddleware(createUserOneLanguageValidator),
    createUserOneLanguage,
);

profileRouter.delete(
    '/deleteLanguage',
    protect,
    validateRequestMiddleware(deleteUserOneLanguageValidator),
    deleteUserOneOrMoreLanguage,
);

profileRouter.put(
    '/updateEducation',
    protect,
    validateRequestMiddleware(updateUserOneEducationValidator),
    updateUserOneEducation,
);

profileRouter.post(
    '/addEducation',
    protect,
    validateRequestMiddleware(createUserOneEducationValidator),
    createUserOneEducation,
);

profileRouter.delete('/deleteEducation', protect, deleteUserOneEducation);

profileRouter.post(
    '/addResume',
    protect,
    uploadResume,
    savingResumeInDisk,
    //validateRequestMiddleware(createUserOneResumeValidator),
    addUserOneResume,
);
profileRouter.get('/getAllResumes', protect, getAllUserResumes);
profileRouter.delete('/deleteResume/:id', protect, deleteUserOneResume);
profileRouter.patch(
    '/updateBasicInfo',
    protect,
    uploadProfilePic,
    validateRequestMiddleware(updateUserBasicInfoValidator),
    resizeUserImage,
    updateUserBasicInfo,
);

profileRouter.delete('/deleteMe', protect, deleteMe);

export default profileRouter;
