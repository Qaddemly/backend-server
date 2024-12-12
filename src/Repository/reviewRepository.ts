import { Repository } from 'typeorm';
import { Account } from '../entity/Account';
import { AppDataSource } from '../data-source';
import { Review } from '../entity/Review';

class ReviewRepositoryClass extends Repository<Review> {
    async getFiveReviewsOfBusiness(businessId: number): Promise<Review[]> {
        return this.createQueryBuilder('review')
            .leftJoin('review.business', 'business')
            .leftJoin('review.account', 'account')
            .where('business.id = :id', { id: businessId })
            .getMany();
    }
}

export const ReviewRepository = AppDataSource.getRepository(Account).extend(
    ReviewRepositoryClass.prototype,
);
