import express from 'express';
import {
    createJob,
    getAllJobs,
    getOneJob,
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
    uploadJobApplicationResume,
} from '../services/jobApplicationServices';
import {
    CreateJobApplicationValidator,
    jobApplicationIdValidator,
} from '../middlewares/validators/jobApplicationValidator';
import { applyToJob } from '../controllers/jobApplicationController';
import * as jobApplicationController from '../controllers/jobApplicationController';
import * as jobApplicationValidator from '../middlewares/validators/jobApplicationValidator';

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
    makeJobOpened,
);

jobRouter.put(
    '/makeJobClosed/:id',
    protect,
    validateRequestMiddleware(idJobValidator),
    makeJobClosed,
);

jobRouter.put(
    '/makeJobArchived/:id',
    protect,
    validateRequestMiddleware(idJobValidator),
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

jobRouter.get('/getAllJobs/', getAllJobs);

jobRouter.post('/loadJobsFromCSV', async (req, res) => {
    await loadJobsFromCSV();
    res.send('Loading jobs from CSV');
});

jobRouter.post(
    '/:jobId/jobApplication',
    protect,
    uploadJobApplicationResume,
    validateRequestMiddleware(CreateJobApplicationValidator),
    savingResumeInDisk,
    applyToJob,
);

jobRouter.get(
    '/:jobId/questions',
    protect,
    validateRequestMiddleware(jobApplicationValidator.JobIdValidator),
    jobApplicationController.getJobApplicationForm,
);
export default jobRouter;
