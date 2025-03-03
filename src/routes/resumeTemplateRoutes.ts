import express from 'express';
import { protect } from '../services/authServices';
import {
    createCourseOfResumeTemplate,
    createCustomSectionOfResumeTemplate,
    createExperienceOfResumeTemplate,
    createInterestOfResumeTemplate,
    createLanguageOfResumeTemplate,
    createOrganizationOfResumeTemplate,
    createReferenceOfResumeTemplate,
    createResumeTemplate,
    deleteCourseOfResumeTemplate,
    deleteCustomSectionOfResumeTemplate,
    deleteExperienceOfResumeTemplate,
    deleteInterestOfResumeTemplate,
    deleteLanguageOfResumeTemplate,
    deleteOrganizationOfResumeTemplate,
    deleteReferenceOfResumeTemplate,
    deleteResumeTemplate,
    getAllCoursesOfResumeTemplate,
    getAllCustomSectionsOfResumeTemplate,
    getAllExperiencesOfResumeTemplate,
    getAllInterestsOfResumeTemplate,
    getAllLanguagesOfResumeTemplate,
    getAllOrganizationsOfResumeTemplate,
    getAllReferencesOfResumeTemplate,
    getAllResumeTemplatesOfUser,
    getCourseOfResumeTemplate,
    getCustomSectionOfResumeTemplate,
    getExperienceOfResumeTemplate,
    getInterestOfResumeTemplate,
    getLanguageOfResumeTemplate,
    getOrganizationOfResumeTemplate,
    getReferenceOfResumeTemplate,
    getResumeTemplatesById,
    isUserOwnsThisResume,
    updateCourseOfResumeTemplate,
    updateCustomSectionOfResumeTemplate,
    updateExperienceOfResumeTemplate,
    updateInterestOfResumeTemplate,
    updateLanguageOfResumeTemplate,
    updateOrganizationOfResumeTemplate,
    updateProfileOfResumeTemplate,
    updateReferenceOfResumeTemplate,
} from '../controllers/resumeTemplateController';
import validateRequestMiddleware from '../middlewares/validator';
import {
    createOrUpdateExperienceOfResumeTemplateValidator,
    updateResumeTemplateProfileValidator,
} from '../middlewares/validators/resumeTemplateValidator';

export const resumeTemplateRouter = express.Router();

resumeTemplateRouter.get('/', protect, getAllResumeTemplatesOfUser);

resumeTemplateRouter.get('/:id', protect, getResumeTemplatesById);

resumeTemplateRouter.post('/', protect, createResumeTemplate);

resumeTemplateRouter.delete('/:id', protect, deleteResumeTemplate);

resumeTemplateRouter.put(
    '/:id/profile',
    protect,
    isUserOwnsThisResume,
    validateRequestMiddleware(updateResumeTemplateProfileValidator),
    updateProfileOfResumeTemplate,
);

resumeTemplateRouter.post(
    '/:id/experience',
    protect,
    isUserOwnsThisResume,
    validateRequestMiddleware(
        createOrUpdateExperienceOfResumeTemplateValidator,
    ),
    createExperienceOfResumeTemplate,
);

resumeTemplateRouter.get(
    '/:id/experience/:experienceId',
    protect,
    isUserOwnsThisResume,
    getExperienceOfResumeTemplate,
);

resumeTemplateRouter.get(
    '/:id/experience',
    protect,
    isUserOwnsThisResume,
    getAllExperiencesOfResumeTemplate,
);

resumeTemplateRouter.put(
    '/:id/experience/:experienceId',
    protect,
    isUserOwnsThisResume,
    validateRequestMiddleware(
        createOrUpdateExperienceOfResumeTemplateValidator,
    ),
    updateExperienceOfResumeTemplate,
);

resumeTemplateRouter.delete(
    '/:id/experience/:experienceId',
    protect,
    isUserOwnsThisResume,
    deleteExperienceOfResumeTemplate,
);

resumeTemplateRouter.post(
    '/:id/language',
    protect,
    isUserOwnsThisResume,
    createLanguageOfResumeTemplate,
);

resumeTemplateRouter.get(
    '/:id/language/:languageId',
    protect,
    isUserOwnsThisResume,
    getLanguageOfResumeTemplate,
);

resumeTemplateRouter.get(
    '/:id/language',
    protect,
    isUserOwnsThisResume,
    getAllLanguagesOfResumeTemplate,
);

resumeTemplateRouter.put(
    '/:id/language/:languageId',
    protect,
    isUserOwnsThisResume,
    updateLanguageOfResumeTemplate,
);

resumeTemplateRouter.delete(
    '/:id/language/:languageId',
    protect,
    isUserOwnsThisResume,
    deleteLanguageOfResumeTemplate,
);

resumeTemplateRouter.post(
    '/:id/interest',
    protect,
    isUserOwnsThisResume,
    createInterestOfResumeTemplate,
);

resumeTemplateRouter.get(
    '/:id/interest/:interestId',
    protect,
    isUserOwnsThisResume,
    getInterestOfResumeTemplate,
);

resumeTemplateRouter.get(
    '/:id/interest',
    protect,
    isUserOwnsThisResume,
    getAllInterestsOfResumeTemplate,
);

resumeTemplateRouter.put(
    '/:id/interest/:interestId',
    protect,
    isUserOwnsThisResume,
    updateInterestOfResumeTemplate,
);

resumeTemplateRouter.delete(
    '/:id/interest/:interestId',
    protect,
    isUserOwnsThisResume,
    deleteInterestOfResumeTemplate,
);

resumeTemplateRouter.post(
    '/:id/course',
    protect,
    isUserOwnsThisResume,
    createCourseOfResumeTemplate,
);

resumeTemplateRouter.get(
    '/:id/course/:courseId',
    protect,
    isUserOwnsThisResume,
    getCourseOfResumeTemplate,
);

resumeTemplateRouter.get(
    '/:id/course',
    protect,
    isUserOwnsThisResume,
    getAllCoursesOfResumeTemplate,
);

resumeTemplateRouter.put(
    '/:id/course/:courseId',
    protect,
    isUserOwnsThisResume,
    updateCourseOfResumeTemplate,
);

resumeTemplateRouter.delete(
    '/:id/course/:courseId',
    protect,
    isUserOwnsThisResume,
    deleteCourseOfResumeTemplate,
);

resumeTemplateRouter.post(
    '/:id/organization',
    protect,
    isUserOwnsThisResume,
    createOrganizationOfResumeTemplate,
);

resumeTemplateRouter.get(
    '/:id/organization/:organizationId',
    protect,
    isUserOwnsThisResume,
    getOrganizationOfResumeTemplate,
);

resumeTemplateRouter.get(
    '/:id/organization',
    protect,
    isUserOwnsThisResume,
    getAllOrganizationsOfResumeTemplate,
);

resumeTemplateRouter.put(
    '/:id/organization/:organizationId',
    protect,
    isUserOwnsThisResume,
    updateOrganizationOfResumeTemplate,
);

resumeTemplateRouter.delete(
    '/:id/organization/:organizationId',
    protect,
    isUserOwnsThisResume,
    deleteOrganizationOfResumeTemplate,
);

resumeTemplateRouter.post(
    '/:id/reference',
    protect,
    isUserOwnsThisResume,
    createReferenceOfResumeTemplate,
);

resumeTemplateRouter.get(
    '/:id/reference/:referenceId',
    protect,
    getReferenceOfResumeTemplate,
);

resumeTemplateRouter.get(
    '/:id/reference',
    protect,
    isUserOwnsThisResume,
    getAllReferencesOfResumeTemplate,
);

resumeTemplateRouter.put(
    '/:id/reference/:referenceId',
    protect,
    isUserOwnsThisResume,
    updateReferenceOfResumeTemplate,
);

resumeTemplateRouter.delete(
    '/:id/reference/:referenceId',
    protect,
    isUserOwnsThisResume,
    deleteReferenceOfResumeTemplate,
);

resumeTemplateRouter.post(
    '/:id/customSection',
    protect,
    isUserOwnsThisResume,
    createCustomSectionOfResumeTemplate,
);

resumeTemplateRouter.get(
    '/:id/customSection/:customSectionId',
    protect,
    isUserOwnsThisResume,
    getCustomSectionOfResumeTemplate,
);

resumeTemplateRouter.get(
    '/:id/customSection',
    protect,
    isUserOwnsThisResume,
    getAllCustomSectionsOfResumeTemplate,
);

resumeTemplateRouter.put(
    '/:id/customSection/:customSectionId',
    protect,
    isUserOwnsThisResume,
    updateCustomSectionOfResumeTemplate,
);

resumeTemplateRouter.delete(
    '/:id/customSection/:customSectionId',
    protect,
    isUserOwnsThisResume,
    deleteCustomSectionOfResumeTemplate,
);
