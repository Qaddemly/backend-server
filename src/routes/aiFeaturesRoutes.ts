import express from 'express';

import * as aiFeaturesController from '../controllers/aiFeaturesController';

export const aiFeaturesRouter = express.Router();

import { protect } from '../services/authServices';
import validateRequestMiddleware from '../middlewares/validator';
import {
    jobEnhancementOrGenerateValidation,
    jobPostGenerationValidation,
    matchScoreValidation,
} from '../middlewares/validators/resumeTemplateValidator/aiFeaturesValidations';

aiFeaturesRouter.get(
    '/recommendJobsForUser',
    protect,
    aiFeaturesController.recommendJobsForUser,
);

aiFeaturesRouter.post(
    '/enhanceJobDescription',
    protect,
    validateRequestMiddleware(jobEnhancementOrGenerateValidation),
    aiFeaturesController.enhanceJobDescription,
);

aiFeaturesRouter.post(
    '/enhanceOrGenerateJobSkills',
    protect,
    validateRequestMiddleware(jobEnhancementOrGenerateValidation),
    aiFeaturesController.enhanceOrGenerateJobSkills,
);

aiFeaturesRouter.post(
    '/enhanceOrGenerateJobKeywords',
    protect,
    validateRequestMiddleware(jobEnhancementOrGenerateValidation),
    aiFeaturesController.enhanceOrGenerateJobKeywords,
);

aiFeaturesRouter.post(
    '/generateJobPost',
    protect,
    validateRequestMiddleware(jobPostGenerationValidation),
    aiFeaturesController.generateJobPost,
);

aiFeaturesRouter.get(
    '/matchScore',
    protect,
    validateRequestMiddleware(matchScoreValidation),
    aiFeaturesController.matchingScore,
);

aiFeaturesRouter.post(
    '/generateOrEnhanceAboutMe',
    protect,
    aiFeaturesController.generateOrEnhanceAboutMe,
);
aiFeaturesRouter.post(
    '/generateOrEnhanceAboutMeBasedOnJob',
    protect,
    aiFeaturesController.generateOrEnhanceAboutMeBasedOnJob,
);
aiFeaturesRouter.post(
    '/generateOrEnhanceSkills',
    protect,
    aiFeaturesController.generateOrEnhanceSkills,
);
aiFeaturesRouter.post(
    '/generateOrEnhanceSkillsBasedOnJob',
    protect,
    aiFeaturesController.generateOrEnhanceSkillsBasedOnJob,
);

aiFeaturesRouter.get(
    '/coverLetterBuilderInputData',
    protect,
    aiFeaturesController.coverLetterBuilderInputData,
);
