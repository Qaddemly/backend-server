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
            `SELECT b.id          AS business_id,
                    b.name        AS business_name,
                    b.logo        AS business_logo,
                    b.description AS business_description
                FROM follow_business as fb JOIN business as b ON (fb.business_id = b.id AND fb.account_id = ${accountId})`,
        );
    }
}

export const FollowBusinessRepository = AppDataSource.getRepository(
    FollowBusiness,
).extend(FollowBusinessRepositoryClass.prototype);
