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
    updateCourseOfResumeTemplate,
    updateCustomSectionOfResumeTemplate,
    updateExperienceOfResumeTemplate,
    updateInterestOfResumeTemplate,
    updateLanguageOfResumeTemplate,
    updateOrganizationOfResumeTemplate,
    updateProfileOfResumeTemplate,
    updateReferenceOfResumeTemplate,
} from '../controllers/resumeTemplateController';

export const resumeTemplateRouter = express.Router();

resumeTemplateRouter.get('/', protect, getAllResumeTemplatesOfUser);

resumeTemplateRouter.get('/:id', protect, getResumeTemplatesById);

resumeTemplateRouter.post('/', protect, createResumeTemplate);

resumeTemplateRouter.delete('/:id', protect, deleteResumeTemplate);

resumeTemplateRouter.put(
    '/:id/profile',
    protect,
    updateProfileOfResumeTemplate,
);

resumeTemplateRouter.post(
    '/:id/experience',
    protect,
    createExperienceOfResumeTemplate,
);

resumeTemplateRouter.get(
    '/:id/experience/:experienceId',
    protect,
    getExperienceOfResumeTemplate,
);

resumeTemplateRouter.get(
    '/:id/experience',
    protect,
    getAllExperiencesOfResumeTemplate,
);

resumeTemplateRouter.put(
    '/:id/experience/:experienceId',
    protect,
    updateExperienceOfResumeTemplate,
);

resumeTemplateRouter.delete(
    '/:id/experience/:experienceId',
    protect,
    deleteExperienceOfResumeTemplate,
);

resumeTemplateRouter.post(
    '/:id/language',
    protect,
    createLanguageOfResumeTemplate,
);

resumeTemplateRouter.get(
    '/:id/language/:languageId',
    protect,
    getLanguageOfResumeTemplate,
);

resumeTemplateRouter.get(
    '/:id/language',
    protect,
    getAllLanguagesOfResumeTemplate,
);

resumeTemplateRouter.put(
    '/:id/language/:languageId',
    protect,
    updateLanguageOfResumeTemplate,
);

resumeTemplateRouter.delete(
    '/:id/language/:languageId',
    protect,
    deleteLanguageOfResumeTemplate,
);

resumeTemplateRouter.post(
    '/:id/interest',
    protect,
    createInterestOfResumeTemplate,
);

resumeTemplateRouter.get(
    '/:id/interest/:interestId',
    protect,
    getInterestOfResumeTemplate,
);

resumeTemplateRouter.get(
    '/:id/interest',
    protect,
    getAllInterestsOfResumeTemplate,
);

resumeTemplateRouter.put(
    '/:id/interest/:interestId',
    protect,
    updateInterestOfResumeTemplate,
);

resumeTemplateRouter.delete(
    '/:id/interest/:interestId',
    protect,
    deleteInterestOfResumeTemplate,
);

resumeTemplateRouter.post('/:id/course', protect, createCourseOfResumeTemplate);

resumeTemplateRouter.get(
    '/:id/course/:courseId',
    protect,
    getCourseOfResumeTemplate,
);

resumeTemplateRouter.get('/:id/course', protect, getAllCoursesOfResumeTemplate);

resumeTemplateRouter.put(
    '/:id/course/:courseId',
    protect,
    updateCourseOfResumeTemplate,
);

resumeTemplateRouter.delete(
    '/:id/course/:courseId',
    protect,
    deleteCourseOfResumeTemplate,
);

resumeTemplateRouter.post(
    '/:id/organization',
    protect,
    createOrganizationOfResumeTemplate,
);

resumeTemplateRouter.get(
    '/:id/organization/:organizationId',
    protect,
    getOrganizationOfResumeTemplate,
);

resumeTemplateRouter.get(
    '/:id/organization',
    protect,
    getAllOrganizationsOfResumeTemplate,
);

resumeTemplateRouter.put(
    '/:id/organization/:organizationId',
    protect,
    updateOrganizationOfResumeTemplate,
);

resumeTemplateRouter.delete(
    '/:id/organization/:organizationId',
    protect,
    deleteOrganizationOfResumeTemplate,
);

resumeTemplateRouter.post(
    '/:id/reference',
    protect,
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
    getAllReferencesOfResumeTemplate,
);

resumeTemplateRouter.put(
    '/:id/reference/:referenceId',
    protect,
    updateReferenceOfResumeTemplate,
);

resumeTemplateRouter.delete(
    '/:id/reference/:referenceId',
    protect,
    deleteReferenceOfResumeTemplate,
);

resumeTemplateRouter.post(
    '/:id/customSection',
    protect,
    createCustomSectionOfResumeTemplate,
);

resumeTemplateRouter.get(
    '/:id/customSection/:customSectionId',
    protect,
    getCustomSectionOfResumeTemplate,
);

resumeTemplateRouter.get(
    '/:id/customSection',
    protect,
    getAllCustomSectionsOfResumeTemplate,
);

resumeTemplateRouter.put(
    '/:id/customSection/:customSectionId',
    protect,
    updateCustomSectionOfResumeTemplate,
);

resumeTemplateRouter.delete(
    '/:id/customSection/:customSectionId',
    protect,
    deleteCustomSectionOfResumeTemplate,
);
