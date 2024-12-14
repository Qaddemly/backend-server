import { Repository } from 'typeorm';
import { Account } from '../entity/Account';
import { AppDataSource } from '../data-source';
import { Review } from '../entity/Review';
import { Business } from '../entity/Business';

class ReviewRepositoryClass extends Repository<Review> {
    async getFiveReviewsOfBusiness(businessId: number) {
        return await this.query(
            'SELECT a.id as account_id, ' +
                ' a.first_name as account_first_name,' +
                ' a.last_name as account_last_name,' +
                ' a.profile_picture as account_profile_picture,' +
                ' r.description as description,' +
                ' r.rating as review_rating,' +
                ' r.business_id as review_business_id,' +
                ' r.account_id as review_account_id,' +
                ' r.created_at as review_created_at,' +
                ' r.updated_at as review_updated_at ' +
                'FROM review AS r JOIN business AS b ON r.business_id = $1 JOIN account AS a ON r.account_id = a.id LIMIT 5',
            [businessId],
        );
    }
    async getAllReviewsOfBusiness(businessId: number) {
        return await this.query(
            'SELECT a.first_name as account_first_name,' +
                ' a.last_name as account_last_name,' +
                ' a.profile_picture as account_profile_picture,' +
                ' r.description as review_description,' +
                ' r.rating as review_rating,' +
                ' r.business_id as review_business_id,' +
                ' r.account_id as review_account_id,' +
                ' r.created_at as review_created_at,' +
                ' r.updated_at as review_updated_at ' +
                'FROM review AS r JOIN business AS b ON r.business_id = $1 JOIN account AS a ON r.account_id = a.id',
            [businessId],
        );
    }
}

export const ReviewRepository = AppDataSource.getRepository(Account).extend(
    ReviewRepositoryClass.prototype,
);
