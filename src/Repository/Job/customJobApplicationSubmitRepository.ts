import { Repository } from 'typeorm';
import { CustomJobApplicationSubmit } from '../../entity/Job/customJobApplication/CustomJobApplicationSubmit';
import { AppDataSource } from '../../data-source';

class CustomJobApplicationSubmitRepositoryClass extends Repository<CustomJobApplicationSubmit> {}
export const CustomJobApplicationSubmitRepository = AppDataSource.getRepository(
    CustomJobApplicationSubmit,
).extend(CustomJobApplicationSubmitRepositoryClass.prototype);
