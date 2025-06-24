import express from 'express';

import * as aiFeaturesController from '../controllers/aiFeaturesController';

export const aiFeaturesRouter = express.Router();

import { protect } from '../services/authServices';

aiFeaturesRouter.get(
    '/recommendJobsForUser',
    protect,
    aiFeaturesController.recommendJobsForUser,
);

aiFeaturesRouter.post(
    '/enhanceJobPost',
    protect,
    aiFeaturesController.enhanceJobPost,
);

aiFeaturesRouter.get(
    '/coverLetterBuilderInputData',
    protect,
    aiFeaturesController.coverLetterBuilderInputData,
);
