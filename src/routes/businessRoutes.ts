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
    updateJobApplicationStatus,
} from '../controllers/businessController';
import { idJobValidator } from '../middlewares/validators/jobValidator';
import {
    getAllArchivedJobs,
    getAllJobApplicationsToJob,
    getOneJobApplication,
} from '../controllers/jobController';
import { CreateCustomJobApplicationValidator } from '../middlewares/validators/customJobApplicationValidator';
import { createCustomJobApplication } from '../controllers/customJobApplicationController';
import * as customJobApplicationController from '../controllers/customJobApplicationController';
import * as customJobApplicationValidator from '../middlewares/validators/customJobApplicationValidator';
import {
    savingResumeInDisk,
    uploadCustomJobApplicationResume,
} from '../services/customJobApplicationServices';

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
businessRouter.get(
    '/myBusiness/dashboard/job/:jobId/applications',
    protect,
    validateRequestMiddleware(idJobValidator),
    getAllJobApplicationsToJob,
);

businessRouter.put(
    '/myBusiness/dashboard/job/:jobId/applications/:applicationId',
    protect,
    validateRequestMiddleware(updateJobStatusValidator),
    updateJobApplicationStatus,
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
    businessController.getAllBusinessWithSearchAndFilter,
);

businessRouter.get(
    '/jobApplication/getAllJobApplications/job/:id',
    protect,
    validateRequestMiddleware(idJobValidator),
    getAllJobApplicationsToJob,
);
businessRouter.get(
    '/jobApplication/:id',
    protect,
    validateRequestMiddleware(idJobValidator),
    getOneJobApplication,
);

businessRouter.get(
    '/myBusiness/dashboard/AllArchivedJobs/:id',
    protect,
    validateRequestMiddleware(idJobValidator),
    getAllArchivedJobs,
);

businessRouter.post(
    '/dashboard/job/:jobId/customJobApplication/create',
    protect,
    validateRequestMiddleware(CreateCustomJobApplicationValidator),
    createCustomJobApplication,
);

businessRouter.get(
    '/dashboard/job/:jobId/customJobApplication',
    protect,
    validateRequestMiddleware(customJobApplicationValidator.JobIdValidator),
    customJobApplicationController.getCustomJobApplication,
);

businessRouter.post(
    '/dashboard/job/customJobApplication/:customJobApplicationId/submit',
    protect,
    uploadCustomJobApplicationResume,
    validateRequestMiddleware(
        customJobApplicationValidator.CreateCustomJobApplicationSubmitValidator,
    ),
    savingResumeInDisk,
    customJobApplicationController.createCustomJobApplicationSubmit,
);

businessRouter.get(
    '/dashboard/job/customJobApplication/:customJobApplicationId/customJobApplicationSubmit',
    protect,
    validateRequestMiddleware(
        customJobApplicationValidator.customJobApplicationIdValidator,
    ),
    customJobApplicationController.getAllCustomJobApplicationSubmits,
);

businessRouter.get(
    '/dashboard/job/customJobApplication/:customJobApplicationId/customJobApplicationSubmit/:customJobApplicationSubmitId',
    protect,
    validateRequestMiddleware(
        customJobApplicationValidator.getOneCustomJobApplicationSubmitByBusinessValidator,
    ),
    customJobApplicationController.getOneCustomJobApplicationSubmitByBusiness,
);

businessRouter.put(
    '/dashboard/job/customJobApplication/:customJobApplicationId/customJobApplicationSubmit/:customJobApplicationSubmitId/update-state',
    protect,
    validateRequestMiddleware(
        customJobApplicationValidator.updateCustomJobApplicationSubmitStateValidator,
    ),
    customJobApplicationController.updateCustomJobApplicationSubmitState,
);

businessRouter.delete(
    '/dashboard/job/customJobApplication/:customJobApplicationId',
    protect,
    validateRequestMiddleware(
        customJobApplicationValidator.customJobApplicationIdValidator,
    ),
    customJobApplicationController.deleteCustomJobApplication,
);

businessRouter.post(
    '/dashboard/job/customJobApplication/:customJobApplicationId/question/add',
    protect,
    validateRequestMiddleware(
        customJobApplicationValidator.addQuestionToCustomJobApplicationValidator,
    ),
    customJobApplicationController.addCustomJobApplicationQuestion,
);

businessRouter.put(
    '/dashboard/job/customJobApplication/:customJobApplicationId/question/update/:questionId',
    protect,
    validateRequestMiddleware(
        customJobApplicationValidator.updateQuestionToCustomJobApplicationValidator,
    ),
    customJobApplicationController.updateCustomJobApplicationQuestion,
);

businessRouter.delete(
    '/dashboard/job/customJobApplication/:customJobApplicationId/question/delete/:questionId',
    protect,
    validateRequestMiddleware(
        customJobApplicationValidator.deleteQuestionToCustomJobApplicationValidator,
    ),
    customJobApplicationController.deleteCustomJobApplicationQuestion,
);
