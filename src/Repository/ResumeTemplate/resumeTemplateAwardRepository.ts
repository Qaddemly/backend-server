import { Repository } from 'typeorm';
import { AppDataSource } from '../../data-source';
import { ResumeTemplateAward } from '../../entity/ResumeTemplate/ResumeTemplateAward';

class ResumeTemplateAwardRepositoryClass extends Repository<ResumeTemplateAward> {}

export const ResumeTemplateAwardRepository = AppDataSource.getRepository(
    ResumeTemplateAward,
).extend(ResumeTemplateAwardRepositoryClass.prototype);
