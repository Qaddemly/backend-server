import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Certificate } from '../entity/Certificate';

class CertificateRepositoryClass extends Repository<Certificate> {}

export const CertificateRepository = AppDataSource.getRepository(
    Certificate,
).extend(CertificateRepositoryClass.prototype);
