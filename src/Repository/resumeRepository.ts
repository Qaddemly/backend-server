import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Resume } from '../entity/Resume';
import { insertValuesInToOneToManyRelationsWithAccount } from './commons';
import { ResumeType } from '../types/types';

class ResumeRepositoryClass extends Repository<Resume> {
    async createResumes(account_id: number, resumes: ResumeType[]) {
        return await insertValuesInToOneToManyRelationsWithAccount(
            account_id,
            Resume,
            resumes,
        );
    }
}

export const ResumeRepository = AppDataSource.getRepository(Resume).extend(
    ResumeRepositoryClass.prototype,
);
