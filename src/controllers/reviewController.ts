import { NextFunction, Request, Response } from 'express';
import catchAsync from 'express-async-handler';
import { CreateReviewBodyDTO, CreateReviewDTO } from '../dtos/reviewDto';
import {
    createReview,
    deleteReview,
    updateReview,
} from '../services/reviewServices';

/**
 * But now user can have only 1 review to a business
 * */
export const addReviewToBusiness = catchAsync(
    async (
        req: Request<{}, {}, CreateReviewBodyDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        const createReviewDTO: CreateReviewDTO = {
            description: req.body.description,
            rating: req.body.rating,
            business_id: req.body.business_id,
            account_id: req.user.id,
        };
        try {
            const rev = await createReview(req, createReviewDTO);
            res.status(201).json({
                status: 'success',
                review: rev,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const updateReviewToBusiness = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const rev = await updateReview(req);
            res.status(200).json({
                status: 'success',
                review: rev,
            });
        } catch (err) {
            console.log(err);
            return next(err);
        }
    },
);

export const deleteReviewToBusiness = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await deleteReview(req);
            res.status(204).json({});
        } catch (err) {
            console.log(err);
            return next(err);
        }
    },
);
