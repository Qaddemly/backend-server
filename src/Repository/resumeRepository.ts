import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Resume } from '../entity/Resume';

class ResumeRepositoryClass extends Repository<Resume> {}

export const ResumeRepository = AppDataSource.getRepository(Resume).extend(
    ResumeRepositoryClass.prototype,
);
