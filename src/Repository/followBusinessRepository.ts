import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { FollowBusiness } from '../entity/FollowBusiness';

class FollowBusinessRepositoryClass extends Repository<FollowBusiness> {
    async checkIfUserFollowBusiness(
        accountId: number,
        businessId: number,
    ): Promise<Boolean> {
        const query = await this.query(
            `SELECT * FROM follow_business WHERE account_id = ${accountId} AND business_id = ${businessId}`,
        );
        return query.length > 0;
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
    async unfollowBusiness(accountId: number, businessId: number) {
        return await this.query(
            `DELETE FROM follow_business WHERE account_id = ${accountId} AND business_id = ${businessId}`,
        );
    }
    async getFollowersOfBusiness(businessId: number) {
        return await this.query(
            `SELECT account.id AS account_id,
                    account.first_name AS account_first_name,
                    account.last_name AS account_last_name,
                    account.profile_picture as account_profile_picture
                FROM follow_business JOIN account ON (account.id = follow_business.account_id AND business_id = ${businessId})`,
        );
    }
    async getFollowersNumberOfBusiness(businessId: number) {
        return await this.query(
            `SELECT COUNT(*) FROM follow_business WHERE business_id = ${businessId}`,
        );
    }
}

export const FollowBusinessRepository = AppDataSource.getRepository(
    FollowBusiness,
).extend(FollowBusinessRepositoryClass.prototype);
