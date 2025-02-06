import { CreateReviewDTO } from '../dtos/reviewDto';
import { BusinessRepository } from '../Repository/businessRepository';
import { Logger } from '../utils/logger';
import { ReviewRepository } from '../Repository/reviewRepository';
import { Request } from 'express';
import AppError from '../utils/appError';
import { Business } from '../entity/Business';
import { CalculationAvgOn } from '../enums/calculatingAvg';
import { Review } from '../entity/Review';

export const createReview = async (
    req: Request,
    createReviewDTO: CreateReviewDTO,
) => {
    try {
        const userId = req.user.id;
        const business = await BusinessRepository.findOneBy({
            id: createReviewDTO.business_id,
        });
        if (!business) {
            Logger.error('Business not found, id not found');
            throw new Error('Business not found');
        }
        const foundedReview = await ReviewRepository.findOne({
            where: {
                business: { id: business.id },
                account: { id: userId },
            },
        });
        console.log(foundedReview);
        if (foundedReview) {
            throw new AppError('You have already reviewed this business');
        }
        const review =
            await ReviewRepository.addReviewToBusiness(createReviewDTO);
        await calculatingAvgRatings(
            business,
            review,
            CalculationAvgOn.Create,
            createReviewDTO.rating,
        );

        await BusinessRepository.save(business);

        return review;
    } catch (error) {
        Logger.error('Error creating review', error);
        throw new AppError(error.message);
    }
};

export const updateReview = async (req: Request) => {
    const userId = req.user.id;
    const reviewId = Number(req.params.id);
    const { description, rating } = req.body;
    const review = await ReviewRepository.findOne({
        where: {
            id: reviewId,
        },
        relations: ['account', 'business'],
    });
    if (!review) {
        throw new AppError('Review not found', 404);
    }
    if (review.account.id !== userId) {
        throw new AppError('you don`t have access to do this action', 403);
    }
    const business = await BusinessRepository.findOneBy({
        id: review.business.id,
    });
    review.description = description ? description : review.description;
    if (rating) {
        // const reviews = await ReviewRepository.query(
        //     `select * from review
        //     where business_id=${business.id}`,
        // );
        // let num = reviews.length;
        // business.reviewsRatingsQuantity =
        //     business.reviewsRatingsQuantity - review.rating;

        // business.reviewsRatingsQuantity =
        //     Number(business.reviewsRatingsQuantity) + Number(rating);
        // business.reviewsRatingsAverage = Number(
        //     (business.reviewsRatingsQuantity / num).toFixed(1),
        // );
        // console.log(business);
        await calculatingAvgRatings(
            business,
            review,
            CalculationAvgOn.Update,
            rating,
        );
    }
    review.rating = rating;
    await BusinessRepository.save(business);
    await ReviewRepository.save(review);
    const returnedReview = { ...review };
    returnedReview.business = undefined;
    returnedReview.account = undefined;
    return returnedReview;
};

export const deleteReview = async (req: Request) => {
    const userId = req.user.id;
    const reviewId = Number(req.params.id);
    const review = await ReviewRepository.findOne({
        where: {
            id: reviewId,
        },
        relations: ['account', 'business'],
    });
    if (!review) {
        throw new AppError('Review not found', 404);
    }
    if (review.account.id !== userId) {
        throw new AppError('you don`t have access to do this action', 403);
    }
    const business = await BusinessRepository.findOneBy({
        id: review.business.id,
    });
    await calculatingAvgRatings(business, review, CalculationAvgOn.Delete, 0);
    await BusinessRepository.save(business);

    await ReviewRepository.remove(review);
};

const calculatingAvgRatings = async (
    business: Business,
    review: Review,
    operationType: CalculationAvgOn,
    rating?: number,
) => {
    const reviews = await ReviewRepository.query(
        `select * from review
        where business_id=${business.id}`,
    );
    let num = reviews.length;
    if (operationType == CalculationAvgOn.Update) {
        business.reviewsRatingsQuantity =
            business.reviewsRatingsQuantity - review.rating;
    } else if (operationType == CalculationAvgOn.Delete) {
        rating = -review.rating;
        num--;
    }
    // console.log('count', reviews.length);
    business.reviewsRatingsQuantity =
        Number(business.reviewsRatingsQuantity) + Number(rating);
    business.reviewsRatingsAverage = Number(
        (business.reviewsRatingsQuantity / num).toFixed(1),
    );
    // console.log(business);
    // await BusinessRepository.save(business);
};
