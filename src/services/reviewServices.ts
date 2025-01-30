import { CreateReviewDTO } from '../dtos/reviewDto';
import { BusinessRepository } from '../Repository/businessRepository';
import { Logger } from '../utils/logger';
import { ReviewRepository } from '../Repository/reviewRepository';

export const createReview = async (createReviewDTO: CreateReviewDTO) => {
    const business = BusinessRepository.findOneBy({
        id: createReviewDTO.business_id,
    });
    if (!business) {
        Logger.error('Business not found, id not found');
        throw new Error('Business not found');
    }
    await ReviewRepository.addReviewToBusiness(createReviewDTO);
    return 0;
};
