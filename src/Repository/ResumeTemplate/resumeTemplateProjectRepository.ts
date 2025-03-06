import { Repository } from 'typeorm';
import { AppDataSource } from '../../data-source';
import { ResumeTemplateProject } from '../../entity/ResumeTemplate/ResumeTemplateProject';

class ResumeTemplateProjectRepositoryClass extends Repository<ResumeTemplateProject> {}

export const ResumeTemplateProjectRepository = AppDataSource.getRepository(
    ResumeTemplateProject,
).extend(ResumeTemplateProjectRepositoryClass.prototype);
