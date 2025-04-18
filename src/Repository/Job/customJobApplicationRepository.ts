import { Repository } from 'typeorm';
import { CustomJobApplication } from '../../entity/Job/customJobApplication';
import { AppDataSource } from '../../data-source';

class CustomJobApplicationRepositoryClass extends Repository<CustomJobApplication> {}
export const CustomJobApplicationRepository = AppDataSource.getRepository(
    CustomJobApplication,
).extend(CustomJobApplicationRepositoryClass.prototype);
