import { Repository } from 'typeorm';
import { ResumeTemplateExperience } from '../../entity/ResumeTemplate/ResumeTemplateExperience';
import { AppDataSource } from '../../data-source';

class ResumeExperienceRepositoryClass extends Repository<ResumeTemplateExperience> {}
export const ResumeExperienceRepository = AppDataSource.getRepository(
    ResumeTemplateExperience,
).extend(ResumeExperienceRepositoryClass.prototype);
