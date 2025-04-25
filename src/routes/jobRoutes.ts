import express from 'express';
import {
    applyToJob,
    createJob,
    getAllJobs,
    getOneJob,
    getRecommendedJobsForUser,
    makeJobArchived,
    makeJobClosed,
    makeJobOpened,
    saveJobToUser,
    unSaveJobFromUser,
    updateOneJob,
} from '../controllers/jobController';
import { protect, protectOptional } from '../services/authServices';
import validateRequestMiddleware from '../middlewares/validator';
import {
    applyToJobValidator,
    createJobValidator,
    idJobValidator,
    updateJobValidator,
} from '../middlewares/validators/jobValidator';
import { loadJobsFromCSV } from '../services/jobServices';
import {
    savingResumeInDisk,
    uploadCustomJobApplicationResume,
} from '../services/customJobApplicationServices';
import {
    CreateCustomJobApplicationSubmitValidator,
    customJobApplicationIdValidator,
} from '../middlewares/validators/customJobApplicationValidator';
import { createCustomJobApplicationSubmit } from '../controllers/customJobApplicationController';

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
    protectOptional,
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

jobRouter.post(
    '/applyToJob/:id',
    protect,
    validateRequestMiddleware(idJobValidator),
    validateRequestMiddleware(applyToJobValidator),

    applyToJob,
);

jobRouter.get('/getAllJobs/', getAllJobs);

jobRouter.get('/recommendedJobsForUser', protect, getRecommendedJobsForUser);

jobRouter.post('/loadJobsFromCSV', async (req, res) => {
    await loadJobsFromCSV();
    res.send('Loading jobs from CSV');
});

jobRouter.post(
    '/customJobApplication/:customJobApplicationId/submit',
    protect,
    uploadCustomJobApplicationResume,
    validateRequestMiddleware(CreateCustomJobApplicationSubmitValidator),
    savingResumeInDisk,
    createCustomJobApplicationSubmit,
);
export default jobRouter;
