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
    updateJobStatusValidator,
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
import { idJobValidator } from '../middlewares/validators/jobValidator';
import { getAllArchivedJobs } from '../controllers/jobController';
import * as jobApplicationController from '../controllers/jobApplicationController';
import * as jobApplicationValidator from '../middlewares/validators/jobApplicationValidator';
import {
    savingResumeInDisk,
    uploadJobApplicationResume,
} from '../services/jobApplicationServices';

export const businessRouter = express.Router();

businessRouter.post(
    '/',
    protect,
    uploadSingleImage('logo'),
    resizeBusinessLogo,
    // validateRequestMiddleware(businessCreationValidator),
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
    '/profile/getAllJobs/:id',
    protect,
    validateRequestMiddleware(idJobValidator),
    businessController.getAllJobsForBusiness,
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

businessRouter.get(
    '/myBusiness/dashboard/jobs/:businessId',
    protect,
    checkRoleInBusiness,
    businessController.getAllJobsFromDashboard,
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
    businessController.getAllBusinessWithSearchAndFilter,
);

businessRouter.get(
    '/myBusiness/dashboard/AllArchivedJobs/:id',
    protect,
    validateRequestMiddleware(idJobValidator),
    getAllArchivedJobs,
);

businessRouter.get(
    '/dashboard/job/:jobId/questions',
    protect,
    validateRequestMiddleware(jobApplicationValidator.JobIdValidator),
    jobApplicationController.getJobApplicationForm,
);

businessRouter.put(
    '/dashboard/job/:jobId/questions',
    protect,
    validateRequestMiddleware(
        jobApplicationValidator.updateJobQuestionsValidator,
    ),
    jobApplicationController.updateJobApplicationsQuestions,
);

businessRouter.get(
    '/dashboard/job/:jobId/jobApplications',
    protect,
    validateRequestMiddleware(jobApplicationValidator.JobIdValidator),
    jobApplicationController.getAllJobApplicationsToJob,
);

businessRouter.get(
    '/dashboard/job/:jobId/jobApplication/:jobApplicationId',
    protect,
    validateRequestMiddleware(
        jobApplicationValidator.getOneJobApplicationByBusinessValidator,
    ),
    jobApplicationController.getOneJobApplicationByBusiness,
);

businessRouter.put(
    '/dashboard/job/:jobId/jobApplication/:jobApplicationId/update-state',
    protect,
    validateRequestMiddleware(
        jobApplicationValidator.updateJobApplicationFormStateValidator,
    ),
    jobApplicationController.updateJobApplicationState,
);
