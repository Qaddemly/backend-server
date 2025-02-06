import express from 'express';
import { protect } from '../services/authServices';
import {
    addReviewToBusiness,
    deleteReviewToBusiness,
    updateReviewToBusiness,
} from '../controllers/reviewController';
import {
    createReviewValidator,
    idValidator,
    updateReviewValidator,
} from '../middlewares/validators/reviewValidator';
import validateRequestMiddleware from '../middlewares/validator';

export const reviewRouter = express.Router();

reviewRouter.post(
    '/',
    protect,
    validateRequestMiddleware(createReviewValidator),
    addReviewToBusiness,
);
reviewRouter.get('/:reviewId', protect);
reviewRouter.delete(
    '/:id',
    protect,
    validateRequestMiddleware(idValidator),
    deleteReviewToBusiness,
);
reviewRouter.put(
    '/:id',
    validateRequestMiddleware(idValidator),
    validateRequestMiddleware(updateReviewValidator),
    protect,
    updateReviewToBusiness,
);
