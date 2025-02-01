import { CreateReviewDTO } from '../dtos/reviewDto';
import { BusinessRepository } from '../Repository/businessRepository';
import { Logger } from '../utils/logger';
import { ReviewRepository } from '../Repository/reviewRepository';

export const createReview = async (createReviewDTO: CreateReviewDTO) => {
    try {
        const business = await BusinessRepository.findOneBy({
            id: createReviewDTO.business_id,
        });
        if (!business) {
            Logger.error('Business not found, id not found');
            throw new Error('Business not found');
        }
        await ReviewRepository.addReviewToBusiness(createReviewDTO);
        if (business) {
            const reviews = await ReviewRepository.query(
                `select * from review
            where business_id=${createReviewDTO.business_id} and account_id=${createReviewDTO.account_id}`,
            );

            console.log('count', reviews.length);
            business.reviewsRatingsQuantity =
                Number(business.reviewsRatingsQuantity) +
                Number(createReviewDTO.rating);
            business.reviewsRatingsAverage = Number(
                (business.reviewsRatingsQuantity / reviews.length).toFixed(1),
            );
            await BusinessRepository.save(business);
        }
        return 0;
    } catch (error) {
        Logger.error('Error creating review', error);
        throw new Error('Error creating review');
    }
};
