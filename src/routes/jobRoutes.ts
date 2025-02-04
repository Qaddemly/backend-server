import express from 'express';
import {
    applyToJob,
    createJob,
    getAllJobApplicationsToJob,
    getAllJobs,
    getAllUserJobApplications,
    getAllUserSavedJobs,
    getOneJob,
    makeJobArchived,
    makeJobClosed,
    makeJobOpened,
    saveJobToUser,
    unSaveJobFromUser,
    updateOneJob,
} from '../controllers/jobController';
import { optionalProtect, protect } from '../services/authServices';
import validateRequestMiddleware from '../middlewares/validator';
import {
    applyToJobValidator,
    createJobValidator,
    idJobValidator,
    updateJobValidator,
} from '../middlewares/validators/jobValidator';
import { getAllJobsApplicationsForJobService } from '../services/jobServices';

const jobRouter = express.Router();

jobRouter.post(
    '/postJob',
    protect,
    validateRequestMiddleware(createJobValidator),
    createJob,
);

jobRouter.get(
    '/oneJob/:id',
    validateRequestMiddleware(idJobValidator),
    optionalProtect,
    getOneJob,
);

jobRouter.put(
    '/updateJob/:id',
    protect,
    validateRequestMiddleware(idJobValidator),
    validateRequestMiddleware(updateJobValidator),
    updateOneJob,
);

jobRouter.put(
    '/makeJobOpened/:id',
    protect,
    validateRequestMiddleware(idJobValidator),
    validateRequestMiddleware(updateJobValidator),
    makeJobOpened,
);

jobRouter.put(
    '/makeJobClosed/:id',
    protect,
    validateRequestMiddleware(idJobValidator),
    validateRequestMiddleware(updateJobValidator),
    makeJobClosed,
);

jobRouter.put(
    '/makeJobArchived/:id',
    protect,
    validateRequestMiddleware(idJobValidator),
    validateRequestMiddleware(updateJobValidator),
    makeJobArchived,
);

jobRouter.post(
    '/saveJob/:id',
    protect,
    validateRequestMiddleware(idJobValidator),
    saveJobToUser,
);

jobRouter.delete(
    '/unSaveJob/:id',
    protect,
    validateRequestMiddleware(idJobValidator),
    unSaveJobFromUser,
);

jobRouter.get('/allUserSavedJobs', protect, getAllUserSavedJobs);
jobRouter.get('/allUserJobApplications', protect, getAllUserJobApplications);
jobRouter.get(
    '/allJobApplicationsToOneJob/:id',
    protect,
    validateRequestMiddleware(idJobValidator),
    getAllJobApplicationsToJob,
);

jobRouter.post(
    '/applyToJob/:id',
    protect,
    validateRequestMiddleware(idJobValidator),
    validateRequestMiddleware(applyToJobValidator),

    applyToJob,
);

jobRouter.get(
    '/getAllJobs/',

    getAllJobs,
);

export default jobRouter;
