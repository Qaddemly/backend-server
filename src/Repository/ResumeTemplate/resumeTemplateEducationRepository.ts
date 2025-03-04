import { Repository } from 'typeorm';
import { AppDataSource } from '../../data-source';
import { ResumeTemplateEducation } from '../../entity/ResumeTemplate/ResumeTemplateEducation';

class ResumeTemplateEducationRepositoryClass extends Repository<ResumeTemplateEducation> {}

export const ResumeTemplateEducationRepository = AppDataSource.getRepository(
    ResumeTemplateEducation,
).extend(ResumeTemplateEducationRepositoryClass.prototype);
