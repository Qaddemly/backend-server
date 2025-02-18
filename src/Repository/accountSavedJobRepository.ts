import { AccountSavedJobs } from '../entity/AccountSavedJobs';
import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';

class AccountSavedJobsRepositoryClass extends Repository<AccountSavedJobs> {
    async createSavedJob(accountId: number, jobId: number) {
        const result = await this.query(
            `insert into account_saved_jobs (account_id,job_id) values (${accountId},${jobId})`,
        );
        return result[0];
    }
    async deleteSavedJob(accountId: number, jobId: number) {
        const result = await this.query(
            `delete from account_saved_jobs where account_id=${accountId} and job_id=${jobId}`,
        );
    }
}

export const AccountSavedJobsRepository = AppDataSource.getRepository(
    AccountSavedJobs,
).extend(AccountSavedJobsRepositoryClass.prototype);
