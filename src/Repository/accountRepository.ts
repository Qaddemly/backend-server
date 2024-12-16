import { Repository } from 'typeorm';
import { Account } from '../entity/Account';
import { AppDataSource } from '../data-source';

class AccountRepositoryClass extends Repository<Account> {
    async findAllAccountData(accountId: number) {
        const account = await this.createQueryBuilder('account')
            // Join related entities
            .leftJoinAndSelect('account.experiences', 'experience') // Join experiences
            //.leftJoinAndSelect('account.education', 'education') // Join education
            .leftJoinAndSelect('account.skills', 'skill') // Join skills
            .leftJoinAndSelect('account.languages', 'language') // Join languages
            .leftJoinAndSelect('account.follow_businesses', 'follow_business') // Join follow_businesses
            .leftJoinAndSelect('account.reviews', 'review') // Join reviews
            .leftJoinAndSelect('account.business_roles', 'business_role') // Join business roles
            .leftJoinAndSelect('account.job_applications', 'job_application') // Join job applications
            .leftJoinAndSelect(
                'account.job_applicationssaved_jobs',
                'saved_job',
            ) // Join saved jobs
            .where('account.id = :id', { id: accountId }) // Filter by accountId
            .getOne();

        if (!account) {
            throw new Error('Account not found');
        }

        // Return the account with all its relations
        return account;
    }
    async getAccountWithSavedJobs(userId: number) {
        const account = await this.findOne({
            where: { id: userId },
            relations: ['saved_jobs'],
            // Load current saved jobs
        });
        return account;
    }

    async getAccountWithJobApplications(userId: number) {
        const account = await this.findOne({
            where: { id: userId },
            relations: [
                'job_applications',
                'job_applications.job',
                'job_applications.resume',
            ],
        });
        return account;
    }
}

export const AccountRepository = AppDataSource.getRepository(Account).extend(
    AccountRepositoryClass.prototype,
);
