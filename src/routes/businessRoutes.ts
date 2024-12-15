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

export const businessRoute = express.Router();

businessRoute.post(
    '/',
    protect,
    uploadSingleImage('logo'),
    resizeBusinessLogo,
    validateRequestMiddleware(businessCreationValidator),
    businessController.createBusiness,
);
businessRoute.get(
    '/userBusinesses',
    protect,
    businessController.getUserBusinesses,
);
businessRoute.get('/', protect, businessController.searchBusinessByName);
businessRoute.get(
    '/profile/:businessId',
    protect,
    businessController.getBusinessById,
);
businessRoute.put(
    '/:businessId',
    protect,
    uploadSingleImage('logo'),
    resizeBusinessLogo,
    validateRequestMiddleware(businessUpdateValidator),
    businessController.updateBusiness,
);
businessRoute.get(
    '/profile/reviewsFive/:businessId',
    protect,
    businessController.getFiveReviewsOfBusiness,
);
businessRoute.get(
    '/profile/reviews/:businessId',
    protect,
    businessController.getAllReviewsOfBusiness,
);
businessRoute.get(
    '/profile/jobsSix/:businessId',
    protect,
    businessController.getSixJobsOfBusiness,
);
businessRoute.get(
    '/profile/jobs/:businessId',
    protect,
    businessController.getAllJobsOfBusiness,
);

// Admin
businessRoute.post(
    '/myBusiness/dashboard/hr/:businessId',
    protect,
    validateRequestMiddleware(checkAddNewHrValidator),
    businessController.addHrToBusiness,
);
