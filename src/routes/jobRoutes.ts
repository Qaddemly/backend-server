import express from 'express';
import {
    createJob,
    getOneJob,
    updateOneJob,
} from '../controllers/jobController';
import { protect } from '../services/authServices';
import validateRequestMiddleware from '../middlewares/validator';
import {
    createJobValidator,
    idJobValidator,
    updateJobValidator,
} from '../middlewares/validators/jobValidator';

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
    getOneJob,
);

jobRouter.put(
    '/updateJob/:id',
    protect,
    validateRequestMiddleware(idJobValidator),
    validateRequestMiddleware(updateJobValidator),
    updateOneJob,
);
export default jobRouter;
