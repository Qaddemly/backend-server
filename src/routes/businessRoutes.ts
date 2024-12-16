import express from 'express';
import * as businessController from '../controllers/businessController';
import {
    resizeBusinessLogo,
    uploadSingleImage,
} from '../middlewares/upload.middleWare';
import { protect } from '../services/authServices';
import validateRequestMiddleware from '../middlewares/validator';
import {
    businessCreationValidator,
    businessUpdateValidator,
    checkAddNewHrValidator,
} from '../middlewares/validators/bussiness.Validator';

export const businessRouter = express.Router();

businessRouter.post(
    '/',
    protect,
    uploadSingleImage('logo'),
    resizeBusinessLogo,
    validateRequestMiddleware(businessCreationValidator),
    businessController.createBusiness,
);
businessRouter.get(
    '/userBusinesses',
    protect,
    businessController.getUserBusinesses,
);
businessRouter.get('/', protect, businessController.searchBusinessByName);
businessRouter.get(
    '/profile/:businessId',
    protect,
    businessController.getBusinessById,
);

businessRouter.get(
    '/profile/reviewsFive/:businessId',
    protect,
    businessController.getFiveReviewsOfBusiness,
);
businessRouter.get(
    '/profile/reviews/:businessId',
    protect,
    businessController.getAllReviewsOfBusiness,
);
businessRouter.get(
    '/profile/jobsSix/:businessId',
    protect,
    businessController.getSixJobsOfBusiness,
);
businessRouter.get(
    '/profile/jobs/:businessId',
    protect,
    businessController.getAllJobsOfBusiness,
);
businessRouter.get(
    '/profile/followersNumber/:businessId',
    protect,
    businessController.getFollowersNumberOfBusiness,
);

// Admin
businessRouter.post(
    '/myBusiness/dashboard/hr/:businessId',
    protect,
    validateRequestMiddleware(checkAddNewHrValidator),
    businessController.addHrToBusiness,
);

businessRouter.put(
    '/myBusiness/dashboard/edit/:businessId',
    protect,
    uploadSingleImage('logo'),
    resizeBusinessLogo,
    validateRequestMiddleware(businessUpdateValidator),
    businessController.updateBusiness,
);

businessRouter.get(
    '/myBusiness/dashboard/followers/:businessId',
    protect,
    businessController.getFollowersOfBusiness,
);
