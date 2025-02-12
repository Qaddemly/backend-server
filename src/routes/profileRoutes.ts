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
    createProject,
    getProjectById,
    getProjectsOfUserById,
    getProjectsOfLoggedInUser,
    updateProject,
    deleteProject,
    createVolunteering,
    getVolunteeringById,
    getVolunteeringsOfUserById,
    getVolunteeringsOfLoggedInUser,
    updateVolunteering,
    deleteVolunteering,
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
    idValidator,
    createProjectValidator,
    updateProjectValidator,
    createVolunteeringValidator,
    updateVolunteeringValidator,
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
    '/updateEducation/:id',
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

profileRouter.delete(
    '/deleteEducation/:id',
    protect,
    validateRequestMiddleware(idValidator),
    deleteUserOneEducation,
);

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

/**
 * Profile Projects
 * */
profileRouter.post(
    '/project',
    protect,
    validateRequestMiddleware(createProjectValidator),
    createProject,
);

profileRouter.get('/project/:id', protect, getProjectById);

profileRouter.get('/projects/user/:userId', protect, getProjectsOfUserById);

profileRouter.get('/myProjects', protect, getProjectsOfLoggedInUser);

profileRouter.put(
    '/project/:id',
    protect,
    validateRequestMiddleware(updateProjectValidator),
    updateProject,
);

profileRouter.delete('/project/:id', protect, deleteProject);

/**
 * Profile Volunteering
 * */

profileRouter.post(
    '/volunteering',
    protect,
    validateRequestMiddleware(createVolunteeringValidator),
    createVolunteering,
);

profileRouter.get('/volunteering/:id', protect, getVolunteeringById);

profileRouter.get(
    '/volunteerings/user/:userId',
    protect,
    getVolunteeringsOfUserById,
);

profileRouter.get('/myVolunteerings', protect, getVolunteeringsOfLoggedInUser);

profileRouter.put(
    '/volunteering/:id',
    protect,
    validateRequestMiddleware(updateVolunteeringValidator),
    updateVolunteering,
);

profileRouter.delete('/volunteering/:id', protect, deleteVolunteering);

export default profileRouter;
