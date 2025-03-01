import { Repository } from 'typeorm';
import { ResumeTemplate } from '../../entity/ResumeTemplate/ResumeTemplate';
import { AppDataSource } from '../../data-source';

class ResumeTemplateRepositoryClass extends Repository<ResumeTemplate> {}

export const ResumeTemplateRepository = AppDataSource.getRepository(
    ResumeTemplate,
).extend(ResumeTemplateRepositoryClass.prototype);
