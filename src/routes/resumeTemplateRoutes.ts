import express from 'express';
import { protect } from '../services/authServices';
import * as personaInfoContentController from '../controllers/resumeTemplateController/resumeTemplatePersonalInfoController';
import * as skillContentController from '../controllers/resumeTemplateController/resumeTemplateSkillController';
import validateRequestMiddleware from '../middlewares/validator';
import * as personalInfoValidator from '../middlewares/validators/resumeTemplateValidator/personalInfoValidator';
import * as skillValidator from '../middlewares/validators/resumeTemplateValidator/skillValidator';

import * as personaInfoContentService from '../services/resumeTemplateServices/resumeTemplatePersonalInfoServices';

export const resumeTemplateRouter = express.Router();
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
export default resumeTemplateRouter;
