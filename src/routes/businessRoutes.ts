import express from 'express';
import * as businessController from '../controllers/businessController';
import {
    resizeBusinessLogo,
    uploadSingleImage,
} from '../middlewares/upload.middleWare';
import { protect } from '../services/authServices';
import validateRequestMiddleware from '../middlewares/validator';
import {
    businessAddPhoneNumberValidator,
    businessCreationValidator,
    businessUpdatePhoneNumberValidator,
    businessUpdateValidator,
    checkCreateOrUpdateHr,
    checkDeleteHr,
    getAllHrQueryValidator,
    searchAndFilterValidator,
} from '../middlewares/validators/bussiness.Validator';
import {
    addHrToBusiness,
    checkAddNewHrAuthority,
    checkOwnerOrSuperAdmin,
    checkDeleteHrAuthority,
    checkUpdateHrAuthority,
    deleteHr,
    getFollowersOfBusiness,
    hrDashboardEntry,
    updateBusiness,
    updateHrRole,
    checkRoleInBusiness,
} from '../controllers/businessController';
import { getAllPhonesOfBusiness } from '../services/businessServices';
import { idJobValidator } from '../middlewares/validators/jobValidator';
import { getAllJobApplicationsToJob } from '../controllers/jobController';
import jobRouter from './jobRoutes';

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
    hrDashboardEntry,
    checkOwnerOrSuperAdmin,
    checkAddNewHrAuthority,
    addHrToBusiness,
);
businessRouter.put(
    '/myBusiness/dashboard/hr/:businessId',
    protect,
    validateRequestMiddleware(checkCreateOrUpdateHr),
    hrDashboardEntry,
    checkOwnerOrSuperAdmin,
    checkUpdateHrAuthority,
    updateHrRole,
);
businessRouter.delete(
    '/myBusiness/dashboard/hr/:businessId',
    protect,
    validateRequestMiddleware(checkDeleteHr),
    hrDashboardEntry,
    checkOwnerOrSuperAdmin,
    checkDeleteHrAuthority,
    deleteHr,
);
businessRouter.get(
    '/myBusiness/dashboard/hr/all/:businessId',
    protect,
    checkRoleInBusiness,
    validateRequestMiddleware(getAllHrQueryValidator),
    businessController.getAllHrOfBusiness,
);
//-----------------------------

businessRouter.put(
    '/myBusiness/dashboard/settings/:businessId',
    protect,
    checkOwnerOrSuperAdmin,
    uploadSingleImage('logo'),
    resizeBusinessLogo,
    validateRequestMiddleware(businessUpdateValidator),
    updateBusiness,
);

// Phone Number

businessRouter.get(
    '/myBusiness/dashboard/settings/:businessId/phone',
    protect,
    businessController.getAllPhonesOfBusiness,
);

businessRouter.post(
    '/myBusiness/dashboard/settings/:businessId/phone',
    protect,
    checkOwnerOrSuperAdmin,
    validateRequestMiddleware(businessAddPhoneNumberValidator),
    businessController.addPhoneNumberToBusiness,
);

businessRouter.put(
    '/myBusiness/dashboard/settings/:businessId/phone/:phoneId',
    protect,
    checkOwnerOrSuperAdmin,
    validateRequestMiddleware(businessUpdatePhoneNumberValidator),
    businessController.updatePhoneNumberOfBusiness,
);

businessRouter.delete(
    '/myBusiness/dashboard/settings/:businessId/phone/:phoneId',
    protect,
    checkOwnerOrSuperAdmin,
    businessController.deletePhoneNumberOfBusiness,
);

businessRouter.get(
    '/myBusiness/dashboard/followers/:businessId',
    protect,
    checkOwnerOrSuperAdmin,
    getFollowersOfBusiness,
);
// TODO : Recheck here
businessRouter.get(
    '/myBusiness/dashboard/job/:jobId/applications',
    protect,
    validateRequestMiddleware(idJobValidator),
    getAllJobApplicationsToJob,
);
// jobRouter.get(
//     '/allJobApplicationsToOneJob/:id',
//     protect,
//     validateRequestMiddleware(idJobValidator),
//     getAllJobApplicationsToJob,
// );

// businessRouter.post(
//     '/myBusiness/dashboard/edit/phoneNumber',
//     protect,
//     businessController.addPhoneNumberToBusiness,
// );

businessRouter.get(
    '/searchAndFilter',
    validateRequestMiddleware(searchAndFilterValidator),
    businessController.getAllBusinessWithSearchAndFilter,
);
