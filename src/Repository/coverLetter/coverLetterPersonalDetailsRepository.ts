import { Repository } from 'typeorm';
import { PersonalDetails } from '../../entity/CoverLetter/PersonalDetails';
import { AppDataSource } from '../../data-source';

class PersonalDetailsRepositoryClass extends Repository<PersonalDetails> {}

export const PersonalDetailsRepository = AppDataSource.getRepository(
    PersonalDetails,
).extend(PersonalDetailsRepositoryClass.prototype);
