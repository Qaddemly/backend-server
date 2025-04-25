import express from 'express';
import { protect } from '../services/authServices';

import * as accountController from '../controllers/accountController';

export const accountRouter = express.Router();

accountRouter.post(
    '/followBusiness/:businessId',
    protect,
    accountController.followBusiness,
);
accountRouter.get(
    '/followedBusinesses',
    protect,
    accountController.getFollowedBusinesses,
);
accountRouter.delete(
    '/unfollowBusiness/:businessId',
    protect,
    accountController.unfollowBusiness,
);

accountRouter.get('/testForAI', accountController.testForAI);
