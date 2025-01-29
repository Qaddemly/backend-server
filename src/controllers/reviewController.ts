import { Request, Response } from 'express';
import catchAsync from 'express-async-handler';
import { CreateReviewBodyDTO, CreateReviewDTO } from '../dtos/reviewDto';
import { createReview } from '../services/reviewServices';

/**
 * But now user can have only 1 review to a business
 * */
export const addReviewToBusiness = catchAsync(
    async (req: Request<{}, {}, CreateReviewBodyDTO>, res: Response) => {
        const createReviewDTO: CreateReviewDTO = {
            description: req.body.description,
            rating: req.body.rating,
            business_id: req.body.business_id,
            account_id: req.user.id,
        };
        const rev = createReview(createReviewDTO);
        res.status(201).json({
            status: 'success',
            data: {
                review: rev,
            },
        });
    },
);
