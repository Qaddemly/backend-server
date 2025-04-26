import { Repository } from 'typeorm';
import { CustomJobApplicationExperience } from '../../entity/Job/customJobApplication/CustomJobApplicationExperience';
import { AppDataSource } from '../../data-source';

class CustomJobApplicationExperienceRepositoryClass extends Repository<CustomJobApplicationExperience> {}
export const CustomJobApplicationExperienceRepository =
    AppDataSource.getRepository(CustomJobApplicationExperience).extend(
        CustomJobApplicationExperienceRepositoryClass.prototype,
    );
