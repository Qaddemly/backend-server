import { Repository } from 'typeorm';
import { AppDataSource } from '../../data-source';
import { AccountResume } from '../../entity/Account/AccountResume';
import { insertValuesInToOneToManyRelationsWithAccount } from '../General/commons';
import { ResumeType } from '../../types/types';

class ResumeRepositoryClass extends Repository<AccountResume> {
    async createResumes(account_id: number, resumes: ResumeType[]) {
        return await insertValuesInToOneToManyRelationsWithAccount(
            account_id,
            AccountResume,
            resumes,
        );
    }
}

export const ResumeRepository = AppDataSource.getRepository(
    AccountResume,
).extend(ResumeRepositoryClass.prototype);
