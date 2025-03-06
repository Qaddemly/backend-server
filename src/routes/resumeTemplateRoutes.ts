import express from 'express';
import { protect } from '../services/authServices';
import * as personaInfoContentController from '../controllers/resumeTemplateController/resumeTemplatePersonalInfoController';
import * as skillContentController from '../controllers/resumeTemplateController/resumeTemplateSkillController';
import * as personalInfoValidator from '../middlewares/validators/resumeTemplateValidator/personalInfoValidator';
import * as skillValidator from '../middlewares/validators/resumeTemplateValidator/skillValidator';
import * as educationValidator from '../middlewares/validators/resumeTemplateValidator/educationValidator';
import * as certificateValidator from '../middlewares/validators/resumeTemplateValidator/certificateValidator';
import * as awardValidator from '../middlewares/validators/resumeTemplateValidator/awardValidator';
import * as publicationValidator from '../middlewares/validators/resumeTemplateValidator/publicationValidator';

import * as personaInfoContentService from '../services/resumeTemplateServices/resumeTemplatePersonalInfoServices';
import * as resumeTemplateController from './../controllers/resumeTemplateController';
import * as educationContentController from '../controllers/resumeTemplateController/resumeTemplateEducationController';
import * as certificateContentController from '../controllers/resumeTemplateController/resumeTemplateCertificateController';
import * as awardContentController from '../controllers/resumeTemplateController/resumeTemplateAwardController';
import * as publicationContentController from '../controllers/resumeTemplateController/resumeTemplatePublicationController';

import validateRequestMiddleware from '../middlewares/validator';
import {
    createOrUpdateLanguageOfResumeTemplateValidator,
    createOrUpdateExperienceOfResumeTemplateValidator,
    updateResumeTemplateProfileValidator,
    createOrUpdateInterestOfResumeTemplateValidator,
    createCourseOfResumeTemplateValidator,
    createOrganizationOfResumeTemplateValidator,
    createCustomSectionOfResumeTemplateValidator,
    createOrUpdateReferenceOfResumeTemplateValidator,
    updateCustomSectionOfResumeTemplateValidator,
    updateOrganizationOfResumeTemplateValidator,
    updateCourseOfResumeTemplateValidator,
} from '../middlewares/validators/resumeTemplateValidator';
import { getAllOrganizationsOfResumeTemplate } from '../controllers/resumeTemplateController';

export const resumeTemplateRouter = express.Router();

resumeTemplateRouter.get(
    '/',
    protect,
    resumeTemplateController.getAllResumeTemplatesOfUser,
);

resumeTemplateRouter.get(
    '/:id',
    protect,
    resumeTemplateController.getResumeTemplatesById,
);

resumeTemplateRouter.post(
    '/',
    protect,
    resumeTemplateController.createResumeTemplate,
);

resumeTemplateRouter.delete(
    '/:id',
    protect,
    resumeTemplateController.deleteResumeTemplate,
);

resumeTemplateRouter.put(
    '/:id/profile',
    protect,
    resumeTemplateController.isUserOwnsThisResume,
    validateRequestMiddleware(updateResumeTemplateProfileValidator),
    resumeTemplateController.updateProfileOfResumeTemplate,
);

resumeTemplateRouter.post(
    '/:id/experience',
    protect,
    resumeTemplateController.isUserOwnsThisResume,
    validateRequestMiddleware(
        createOrUpdateExperienceOfResumeTemplateValidator,
    ),
    resumeTemplateController.createExperienceOfResumeTemplate,
);

resumeTemplateRouter.get(
    '/:id/experience/:experienceId',
    protect,
    resumeTemplateController.isUserOwnsThisResume,
    resumeTemplateController.getExperienceOfResumeTemplate,
);

resumeTemplateRouter.get(
    '/:id/experience',
    protect,
    resumeTemplateController.isUserOwnsThisResume,
    resumeTemplateController.getAllExperiencesOfResumeTemplate,
);

resumeTemplateRouter.put(
    '/:id/experience/:experienceId',
    protect,
    resumeTemplateController.isUserOwnsThisResume,
    validateRequestMiddleware(
        createOrUpdateExperienceOfResumeTemplateValidator,
    ),
    resumeTemplateController.updateExperienceOfResumeTemplate,
);

resumeTemplateRouter.delete(
    '/:id/experience/:experienceId',
    protect,
    resumeTemplateController.isUserOwnsThisResume,
    resumeTemplateController.deleteExperienceOfResumeTemplate,
);

resumeTemplateRouter.post(
    '/:id/language',
    protect,
    resumeTemplateController.isUserOwnsThisResume,
    validateRequestMiddleware(createOrUpdateLanguageOfResumeTemplateValidator),
    resumeTemplateController.createLanguageOfResumeTemplate,
);

resumeTemplateRouter.get(
    '/:id/language/:languageId',
    protect,
    resumeTemplateController.isUserOwnsThisResume,
    resumeTemplateController.getLanguageOfResumeTemplate,
);

resumeTemplateRouter.get(
    '/:id/language',
    protect,
    resumeTemplateController.isUserOwnsThisResume,
    resumeTemplateController.getAllLanguagesOfResumeTemplate,
);

resumeTemplateRouter.put(
    '/:id/language/:languageId',
    protect,
    resumeTemplateController.isUserOwnsThisResume,
    validateRequestMiddleware(createOrUpdateLanguageOfResumeTemplateValidator),
    resumeTemplateController.updateLanguageOfResumeTemplate,
);

resumeTemplateRouter.delete(
    '/:id/language/:languageId',
    protect,
    resumeTemplateController.isUserOwnsThisResume,
    resumeTemplateController.deleteLanguageOfResumeTemplate,
);

resumeTemplateRouter.post(
    '/:id/interest',
    protect,
    resumeTemplateController.isUserOwnsThisResume,
    validateRequestMiddleware(createOrUpdateInterestOfResumeTemplateValidator),
    resumeTemplateController.createInterestOfResumeTemplate,
);

resumeTemplateRouter.get(
    '/:id/interest/:interestId',
    protect,
    resumeTemplateController.isUserOwnsThisResume,
    resumeTemplateController.getInterestOfResumeTemplate,
);

resumeTemplateRouter.get(
    '/:id/interest',
    protect,
    resumeTemplateController.isUserOwnsThisResume,
    resumeTemplateController.getAllInterestsOfResumeTemplate,
);

resumeTemplateRouter.put(
    '/:id/interest/:interestId',
    protect,
    resumeTemplateController.isUserOwnsThisResume,
    validateRequestMiddleware(createOrUpdateInterestOfResumeTemplateValidator),
    resumeTemplateController.updateInterestOfResumeTemplate,
);

resumeTemplateRouter.delete(
    '/:id/interest/:interestId',
    protect,
    resumeTemplateController.isUserOwnsThisResume,
    resumeTemplateController.deleteInterestOfResumeTemplate,
);

resumeTemplateRouter.post(
    '/:id/course',
    protect,
    resumeTemplateController.isUserOwnsThisResume,
    validateRequestMiddleware(createCourseOfResumeTemplateValidator),
    resumeTemplateController.createCourseOfResumeTemplate,
);

resumeTemplateRouter.get(
    '/:id/course/:courseId',
    protect,
    resumeTemplateController.isUserOwnsThisResume,
    resumeTemplateController.getCourseOfResumeTemplate,
);

resumeTemplateRouter.get(
    '/:id/course',
    protect,
    resumeTemplateController.isUserOwnsThisResume,
    resumeTemplateController.getAllCoursesOfResumeTemplate,
);

resumeTemplateRouter.put(
    '/:id/course/:courseId',
    protect,
    resumeTemplateController.isUserOwnsThisResume,
    validateRequestMiddleware(updateCourseOfResumeTemplateValidator),
    resumeTemplateController.updateCourseOfResumeTemplate,
);

resumeTemplateRouter.delete(
    '/:id/course/:courseId',
    protect,
    resumeTemplateController.isUserOwnsThisResume,
    resumeTemplateController.deleteCourseOfResumeTemplate,
);

resumeTemplateRouter.post(
    '/:id/organization',
    protect,
    resumeTemplateController.isUserOwnsThisResume,
    validateRequestMiddleware(createOrganizationOfResumeTemplateValidator),
    resumeTemplateController.createOrganizationOfResumeTemplate,
);

resumeTemplateRouter.get(
    '/:id/organization/:organizationId',
    protect,
    resumeTemplateController.isUserOwnsThisResume,
    resumeTemplateController.getOrganizationOfResumeTemplate,
);

resumeTemplateRouter.get(
    '/:id/organization',
    protect,
    resumeTemplateController.isUserOwnsThisResume,
    resumeTemplateController.getAllOrganizationsOfResumeTemplate,
);

resumeTemplateRouter.put(
    '/:id/organization/:organizationId',
    protect,
    resumeTemplateController.isUserOwnsThisResume,
    validateRequestMiddleware(updateOrganizationOfResumeTemplateValidator),
    resumeTemplateController.updateOrganizationOfResumeTemplate,
);

resumeTemplateRouter.delete(
    '/:id/organization/:organizationId',
    protect,
    resumeTemplateController.isUserOwnsThisResume,
    resumeTemplateController.deleteOrganizationOfResumeTemplate,
);

resumeTemplateRouter.post(
    '/:id/reference',
    protect,
    resumeTemplateController.isUserOwnsThisResume,
    validateRequestMiddleware(createOrUpdateReferenceOfResumeTemplateValidator),
    resumeTemplateController.createReferenceOfResumeTemplate,
);

resumeTemplateRouter.get(
    '/:id/reference/:referenceId',
    protect,
    resumeTemplateController.getReferenceOfResumeTemplate,
);

resumeTemplateRouter.get(
    '/:id/reference',
    protect,
    resumeTemplateController.isUserOwnsThisResume,
    resumeTemplateController.getAllReferencesOfResumeTemplate,
);

resumeTemplateRouter.put(
    '/:id/reference/:referenceId',
    protect,
    resumeTemplateController.isUserOwnsThisResume,
    validateRequestMiddleware(createOrUpdateReferenceOfResumeTemplateValidator),
    resumeTemplateController.updateReferenceOfResumeTemplate,
);

resumeTemplateRouter.delete(
    '/:id/reference/:referenceId',
    protect,
    resumeTemplateController.isUserOwnsThisResume,
    resumeTemplateController.deleteReferenceOfResumeTemplate,
);

resumeTemplateRouter.post(
    '/:id/customSection',
    protect,
    resumeTemplateController.isUserOwnsThisResume,
    validateRequestMiddleware(createCustomSectionOfResumeTemplateValidator),
    resumeTemplateController.createCustomSectionOfResumeTemplate,
);

resumeTemplateRouter.get(
    '/:id/customSection/:customSectionId',
    protect,
    resumeTemplateController.isUserOwnsThisResume,
    resumeTemplateController.getCustomSectionOfResumeTemplate,
);

resumeTemplateRouter.get(
    '/:id/customSection',
    protect,
    resumeTemplateController.isUserOwnsThisResume,
    resumeTemplateController.getAllCustomSectionsOfResumeTemplate,
);

resumeTemplateRouter.put(
    '/:id/customSection/:customSectionId',
    protect,
    resumeTemplateController.isUserOwnsThisResume,
    validateRequestMiddleware(updateCustomSectionOfResumeTemplateValidator),
    resumeTemplateController.updateCustomSectionOfResumeTemplate,
);

resumeTemplateRouter.delete(
    '/:id/customSection/:customSectionId',
    protect,
    resumeTemplateController.isUserOwnsThisResume,
    resumeTemplateController.deleteCustomSectionOfResumeTemplate,
);

resumeTemplateRouter.post(
    '/:resumeTemplateId/PersonalInfo',
    protect,
    personaInfoContentService.uploadPersonalInfoImage,
    validateRequestMiddleware(
        personalInfoValidator.createPersonalInfoValidator,
    ),
    personaInfoContentService.resizePersonalInfoImage,
    personaInfoContentController.createPersonaInfoContent,
);
resumeTemplateRouter.get(
    '/:resumeTemplateId/PersonalInfo/:personaInfoContentId',
    protect,
    validateRequestMiddleware(
        personalInfoValidator.getOnePersonalInfoValidator,
    ),
    personaInfoContentController.getOnePersonaInfoContent,
);
resumeTemplateRouter.put(
    '/:resumeTemplateId/PersonalInfo/:personaInfoContentId',
    protect,
    personaInfoContentService.uploadPersonalInfoImage,
    validateRequestMiddleware(
        personalInfoValidator.updatePersonalInfoValidator,
    ),
    personaInfoContentService.resizePersonalInfoImage,
    personaInfoContentController.updateOnePersonaInfoContent,
);
resumeTemplateRouter.delete(
    '/:resumeTemplateId/PersonalInfo/:personaInfoContentId',
    protect,
    validateRequestMiddleware(
        personalInfoValidator.deletePersonalInfoValidator,
    ),
    personaInfoContentController.deleteOnePersonaInfoContent,
);
//////////////////////////////////////////////////////////////
resumeTemplateRouter.post(
    '/:resumeTemplateId/skill',
    protect,
    validateRequestMiddleware(skillValidator.createSkillValidator),
    skillContentController.createSkillContent,
);
resumeTemplateRouter.get(
    '/:resumeTemplateId/skill',
    protect,
    validateRequestMiddleware(skillValidator.getAllSkillsValidator),
    skillContentController.getAllSkillsContent,
);
resumeTemplateRouter.get(
    '/:resumeTemplateId/skill/:skillContentId',
    protect,
    validateRequestMiddleware(skillValidator.getOneSkillValidator),
    skillContentController.getOneSkillContent,
);

resumeTemplateRouter.put(
    '/:resumeTemplateId/skill/:skillContentId',
    protect,
    validateRequestMiddleware(skillValidator.updateSkillValidator),
    skillContentController.updateOneSkillContent,
);

resumeTemplateRouter.delete(
    '/:resumeTemplateId/skill/:skillContentId',
    protect,
    validateRequestMiddleware(skillValidator.deleteSkillValidator),
    skillContentController.deleteOneSkillContent,
);
///////////////////////////////////////////////////

resumeTemplateRouter.post(
    '/:resumeTemplateId/education',
    protect,
    validateRequestMiddleware(educationValidator.createEducationValidator),
    educationContentController.createEducationContent,
);
resumeTemplateRouter.get(
    '/:resumeTemplateId/education',
    protect,
    validateRequestMiddleware(educationValidator.getAllEducationsValidator),
    educationContentController.getAllEducationsContent,
);
resumeTemplateRouter.get(
    '/:resumeTemplateId/education/:educationContentId',
    protect,
    validateRequestMiddleware(educationValidator.getOneEducationValidator),
    educationContentController.getOneEducationContent,
);

resumeTemplateRouter.put(
    '/:resumeTemplateId/education/:educationContentId',
    protect,
    validateRequestMiddleware(educationValidator.updateEducationValidator),
    educationContentController.updateOneEducationContent,
);

resumeTemplateRouter.delete(
    '/:resumeTemplateId/education/:educationContentId',
    protect,
    validateRequestMiddleware(educationValidator.deleteEducationValidator),
    educationContentController.deleteOneEducationContent,
);
///////////////////////////////////////////////////

resumeTemplateRouter.post(
    '/:resumeTemplateId/certificate',
    protect,
    validateRequestMiddleware(certificateValidator.createCertificateValidator),
    certificateContentController.createCertificateContent,
);
resumeTemplateRouter.get(
    '/:resumeTemplateId/certificate',
    protect,
    validateRequestMiddleware(certificateValidator.getAllCertificatesValidator),
    certificateContentController.getAllCertificatesContent,
);
resumeTemplateRouter.get(
    '/:resumeTemplateId/certificate/:certificateContentId',
    protect,
    validateRequestMiddleware(certificateValidator.getOneCertificateValidator),
    certificateContentController.getOneCertificateContent,
);

resumeTemplateRouter.put(
    '/:resumeTemplateId/certificate/:certificateContentId',
    protect,
    validateRequestMiddleware(certificateValidator.updateCertificateValidator),
    certificateContentController.updateOneCertificateContent,
);

resumeTemplateRouter.delete(
    '/:resumeTemplateId/certificate/:certificateContentId',
    protect,
    validateRequestMiddleware(certificateValidator.deleteCertificateValidator),
    certificateContentController.deleteOneCertificateContent,
);
///////////////////////////////////////////////////

resumeTemplateRouter.post(
    '/:resumeTemplateId/award',
    protect,
    validateRequestMiddleware(awardValidator.createAwardValidator),
    awardContentController.createAwardContent,
);
resumeTemplateRouter.get(
    '/:resumeTemplateId/award',
    protect,
    validateRequestMiddleware(awardValidator.getAllAwardsValidator),
    awardContentController.getAllAwardsContent,
);
resumeTemplateRouter.get(
    '/:resumeTemplateId/award/:awardContentId',
    protect,
    validateRequestMiddleware(awardValidator.getOneAwardValidator),
    awardContentController.getOneAwardContent,
);

resumeTemplateRouter.put(
    '/:resumeTemplateId/award/:awardContentId',
    protect,
    validateRequestMiddleware(awardValidator.updateAwardValidator),
    awardContentController.updateOneAwardContent,
);

resumeTemplateRouter.delete(
    '/:resumeTemplateId/award/:awardContentId',
    protect,
    validateRequestMiddleware(awardValidator.deleteAwardValidator),
    awardContentController.deleteOneAwardContent,
);
///////////////////////////////////////////////////

resumeTemplateRouter.post(
    '/:resumeTemplateId/publication',
    protect,
    validateRequestMiddleware(publicationValidator.createPublicationValidator),
    publicationContentController.createPublicationContent,
);
resumeTemplateRouter.get(
    '/:resumeTemplateId/publication',
    protect,
    validateRequestMiddleware(publicationValidator.getAllPublicationsValidator),
    publicationContentController.getAllPublicationsContent,
);
resumeTemplateRouter.get(
    '/:resumeTemplateId/publication/:publicationContentId',
    protect,
    validateRequestMiddleware(publicationValidator.getOnePublicationValidator),
    publicationContentController.getOnePublicationContent,
);

resumeTemplateRouter.put(
    '/:resumeTemplateId/publication/:publicationContentId',
    protect,
    validateRequestMiddleware(publicationValidator.updatePublicationValidator),
    publicationContentController.updateOnePublicationContent,
);

resumeTemplateRouter.delete(
    '/:resumeTemplateId/publication/:publicationContentId',
    protect,
    validateRequestMiddleware(publicationValidator.deletePublicationValidator),
    publicationContentController.deleteOnePublicationContent,
);

////////////////////////////////////////////////////////////////////////////////////
