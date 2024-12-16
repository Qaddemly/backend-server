import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { FollowBusiness } from '../entity/FollowBusiness';

class FollowBusinessRepositoryClass extends Repository<FollowBusiness> {
    async checkIfUserFollowBusiness(accountId: number, businessId: number) {
        return await this.query(
            `SELECT * FROM follow_business WHERE account_id = ${accountId} AND business_id = ${businessId}`,
        );
    }
    async getFollowedBusinesses(accountId: number) {
        return await this.query(
            `SELECT * FROM follow_business WHERE account_id = ${accountId}`,
        );
    }
}

export const FollowBusinessRepository = AppDataSource.getRepository(
    FollowBusiness,
).extend(FollowBusinessRepositoryClass.prototype);
