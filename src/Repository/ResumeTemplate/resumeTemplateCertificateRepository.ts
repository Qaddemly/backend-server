import { Repository } from 'typeorm';
import { AppDataSource } from '../../data-source';
import { ResumeTemplateCertificate } from '../../entity/ResumeTemplate/ResumeTemplateCertificate';

class ResumeTemplateCertificateRepositoryClass extends Repository<ResumeTemplateCertificate> {}

export const ResumeTemplateCertificateRepository = AppDataSource.getRepository(
    ResumeTemplateCertificate,
).extend(ResumeTemplateCertificateRepositoryClass.prototype);
