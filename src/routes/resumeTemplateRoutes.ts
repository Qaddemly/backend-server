import express from 'express';
import { protect } from '../services/authServices';
import {
    createPersonaInfoContent,
    deleteOnePersonaInfoContent,
    getOnePersonaInfoContent,
    updateOnePersonaInfoContent,
} from '../controllers/resumeTemplateController';
import validateRequestMiddleware from '../middlewares/validator';
import {
    createPersonalInfoValidator,
    deletePersonalInfoValidator,
    getOnePersonalInfoValidator,
    updatePersonalInfoValidator,
} from '../middlewares/validators/resumeTemplate/perosnalInfoValidator';
import {
    resizePersonalInfoImage,
    uploadPersonalInfoImage,
} from '../services/resumeTemplateServices/resumeTemplatePersonalInfoServices';

export const resumeTemplateRouter = express.Router();
resumeTemplateRouter.post(
    '/:resumeTemplateId/PersonalInfo',
    protect,
    uploadPersonalInfoImage,
    validateRequestMiddleware(createPersonalInfoValidator),
    resizePersonalInfoImage,
    createPersonaInfoContent,
);
resumeTemplateRouter.get(
    '/:resumeTemplateId/PersonalInfo/:personaInfoContentId',
    protect,
    validateRequestMiddleware(getOnePersonalInfoValidator),
    getOnePersonaInfoContent,
);
resumeTemplateRouter.put(
    '/:resumeTemplateId/PersonalInfo/:personaInfoContentId',
    protect,
    uploadPersonalInfoImage,
    validateRequestMiddleware(updatePersonalInfoValidator),
    resizePersonalInfoImage,
    updateOnePersonaInfoContent,
);
resumeTemplateRouter.delete(
    '/:resumeTemplateId/PersonalInfo/:personaInfoContentId',
    protect,
    validateRequestMiddleware(deletePersonalInfoValidator),
    deleteOnePersonaInfoContent,
);
export default resumeTemplateRouter;
