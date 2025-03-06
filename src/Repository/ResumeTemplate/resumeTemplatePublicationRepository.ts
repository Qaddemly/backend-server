import { Repository } from 'typeorm';
import { AppDataSource } from '../../data-source';
import { ResumeTemplatePublication } from '../../entity/ResumeTemplate/ResumeTemplatePublication';

class ResumeTemplatePublicationRepositoryClass extends Repository<ResumeTemplatePublication> {}

export const ResumeTemplatePublicationRepository = AppDataSource.getRepository(
    ResumeTemplatePublication,
).extend(ResumeTemplatePublicationRepositoryClass.prototype);
