import express from 'express';
import { protect } from '../services/authServices';

import * as accountController from '../controllers/accountController';
import { LoadUsersData } from '../services/profileServices';

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


accountRouter.post('/LoadUsersData', async (req, res) => {
    // Assuming you have a function to load users data
    await LoadUsersData();
    res.send('Users data loaded successfully!');
});

