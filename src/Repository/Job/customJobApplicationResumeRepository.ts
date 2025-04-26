import { Repository } from 'typeorm';
import { CustomJobApplicationResume } from '../../entity/Job/customJobApplication/CustomJobApplicationResume';
import { AppDataSource } from '../../data-source';

class CustomJobApplicationResumeRepositoryClass extends Repository<CustomJobApplicationResume> {}
export const CustomJobApplicationResumeRepository = AppDataSource.getRepository(
    CustomJobApplicationResume,
).extend(CustomJobApplicationResumeRepositoryClass.prototype);
