import { Repository } from 'typeorm';
import { CustomJobApplicationEducation } from '../../entity/Job/customJobApplication/CustomJobApplicationEducation';
import { AppDataSource } from '../../data-source';

class CustomJobApplicationEducationRepositoryClass extends Repository<CustomJobApplicationEducation> {}
export const CustomJobApplicationEducationRepository =
    AppDataSource.getRepository(CustomJobApplicationEducation).extend(
        CustomJobApplicationEducationRepositoryClass.prototype,
    );
