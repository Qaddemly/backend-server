import { Repository } from 'typeorm';
import { Account } from '../entity/Account';
import { AppDataSource } from '../data-source';
import { Review } from '../entity/Review';
import { Business } from '../entity/Business';

class ReviewRepositoryClass extends Repository<Review> {}

export const ReviewRepository = AppDataSource.getRepository(Account).extend(
    ReviewRepositoryClass.prototype,
);
