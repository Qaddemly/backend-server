import express from 'express';
import { protect } from '../services/authServices';
import { addReviewToBusiness } from '../controllers/reviewController';

export const reviewRouter = express.Router();

reviewRouter.post('/', protect, addReviewToBusiness);
reviewRouter.get('/:reviewId', protect);
reviewRouter.delete('/:reviewId', protect);
reviewRouter.put('/:reviewId', protect);
