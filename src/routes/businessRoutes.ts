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
    checkCreateOrUpdateHr,
    checkDeleteHr,
} from '../middlewares/validators/bussiness.Validator';
import {
    addHrToBusiness,
    checkAddNewHrAuthority,
    checkBusinessDashboardAuthority,
    checkDeleteHrAuthority,
    checkUpdateSuperAdminAuthority,
    deleteHr,
    getFollowersOfBusiness,
    hrDashboardEntry,
    updateBusiness,
    updateHrRole,
} from '../controllers/businessController';

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

businessRouter.post(
    '/myBusiness/dashboard/hr/:businessId',
    protect,
    validateRequestMiddleware(checkCreateOrUpdateHr),
    checkBusinessDashboardAuthority, // check if user has role in business, and return role
    hrDashboardEntry, // check if user account Exists or not and return it's id
    checkAddNewHrAuthority,
    addHrToBusiness,
);
businessRouter.put(
    '/myBusiness/dashboard/hr/:businessId',
    protect,
    validateRequestMiddleware(checkCreateOrUpdateHr),
    checkBusinessDashboardAuthority,
    hrDashboardEntry,
    checkUpdateSuperAdminAuthority,
    updateHrRole,
);
businessRouter.delete(
    '/myBusiness/dashboard/hr/:businessId',
    protect,
    validateRequestMiddleware(checkDeleteHr),
    checkBusinessDashboardAuthority,
    hrDashboardEntry,
    checkDeleteHrAuthority,
    deleteHr,
);
businessRouter.get(
    '/myBusiness/dashboard/hr/all/:businessId',
    protect,
    checkBusinessDashboardAuthority,
    businessController.getAllHrOfBusiness,
);
//-----------------------------
businessRouter.put(
    '/myBusiness/dashboard/edit/:businessId',
    protect,
    validateRequestMiddleware(businessUpdateValidator),
    checkBusinessDashboardAuthority,
    uploadSingleImage('logo'),
    resizeBusinessLogo,
    updateBusiness,
);

businessRouter.get(
    '/myBusiness/dashboard/followers/:businessId',
    protect,
    checkBusinessDashboardAuthority,
    getFollowersOfBusiness,
);

// businessRouter.post(
//     '/myBusiness/dashboard/edit/phoneNumber',
//     protect,
//     businessController.addPhoneNumberToBusiness,
// );
