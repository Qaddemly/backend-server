import express from 'express';
import {
    getNumberOfActiveJobs,
    getNumberOfNewlyPostedJobs,
} from '../controllers/jobController';
import { getNumberOfUsers } from '../controllers/accountController';
import { getNumberOfBusinesses } from '../controllers/businessController';

export const statsRouter = express.Router();
statsRouter.get('/getNumberOfActiveJobs', getNumberOfActiveJobs);
statsRouter.get('/getNumberOfNewPostedJobs', getNumberOfNewlyPostedJobs);
statsRouter.get('/getNumberOfUsers', getNumberOfUsers);
statsRouter.get('/getNumberOfBusinesses', getNumberOfBusinesses);
export default statsRouter;
