import { Repository } from 'typeorm';
import { CoverLetter } from '../../entity/CoverLetter/CoverLetter';
import { AppDataSource } from '../../data-source';

class CoverLetterRepositoryClass extends Repository<CoverLetter> {}

export const CoverLetterRepository = AppDataSource.getRepository(
    CoverLetter,
).extend(CoverLetterRepositoryClass.prototype);
