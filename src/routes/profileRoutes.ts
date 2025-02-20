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
    createCertificate,
    updateCertificate,
    deleteCertificate,
    getOneCertificate,
    getMyALLCertificate,
    geALLCertificatesByUserId,
    getUserInfoAndJobs,
    getAllArchivedApplicationsOfUser,
    archiveJobApplication,
    getAllDetailsAboutJobApplication,
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
    createCertificateValidator,
    certificateMediaValidator,
    updateCertificateValidator,
    certificateOnUpdateMediaValidator,
} from '../middlewares/validators/profileValidator';
import {
    resizeCertificateImage,
    uploadCertificateImage,
} from '../services/profileServices';
import {
    getAllUserJobApplications,
    getAllUserSavedJobs,
    getOneUserJobApplication,
} from '../controllers/jobController';

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
profileRouter.post(
    '/createCertificate',
    protect,
    uploadCertificateImage,
    validateRequestMiddleware(createCertificateValidator),
    resizeCertificateImage,
    validateRequestMiddleware(certificateMediaValidator),
    createCertificate,
);

profileRouter.put(
    '/updateCertificate/:id',
    protect,
    uploadCertificateImage,
    validateRequestMiddleware(idValidator),
    validateRequestMiddleware(updateCertificateValidator),
    resizeCertificateImage,
    validateRequestMiddleware(certificateOnUpdateMediaValidator),
    updateCertificate,
);
profileRouter.delete(
    '/deleteCertificate/:id',
    protect,
    validateRequestMiddleware(idValidator),
    deleteCertificate,
);
profileRouter.get(
    '/jobApplication/myAllJobApplications',
    protect,
    getAllUserJobApplications,
);

profileRouter.get(
    '/jobApplication/:id',
    protect,
    getAllDetailsAboutJobApplication,
);
/**
 * Get All Job Applications of logged-in user
 * */
profileRouter.get('/jobApplication', protect);

/**
 * Get Details of certain job application (Joins)
 * */

//profileRouter.get('/jobApplication/:id', protect, getOneUserJobApplication);

/**
 * Get All Archived Job Applications of logged-in user
 * */
profileRouter.get(
    '/jobApplication/archived/all',
    protect,
    getAllArchivedApplicationsOfUser,
);

/**
 * Make Job Application Archived or Unarchived (Toggle) based on query params
 * */
profileRouter.put(
    '/jobApplication/archived/:id',
    protect,
    archiveJobApplication,
);

/**
 * Delete Job Application
 *
 * Make No sense to delete job application, but we can make it archived
 * */
// profileRouter.delete('/jobApplication/:id', protect);

profileRouter.get(
    '/get-one-certificate/:id',
    validateRequestMiddleware(idValidator),
    getOneCertificate,
);
profileRouter.get('/get-my-all-certificates', protect, getMyALLCertificate);
profileRouter.get(
    '/get-all-certificates/user/:id',
    validateRequestMiddleware(idValidator),
    geALLCertificatesByUserId,
);

profileRouter.get('/test', protect, getUserInfoAndJobs);
profileRouter.get('/job/mySavedJobs', protect, getAllUserSavedJobs);

export default profileRouter;
