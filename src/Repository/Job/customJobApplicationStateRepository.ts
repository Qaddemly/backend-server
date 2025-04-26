import { Repository } from 'typeorm';
import { CustomJobApplicationState } from '../../entity/Job/customJobApplication/CustomJobApplicationStates';
import { AppDataSource } from '../../data-source';

class CustomJobApplicationStatesRepositoryClass extends Repository<CustomJobApplicationState> {}
export const CustomJobApplicationStatesRepository = AppDataSource.getRepository(
    CustomJobApplicationState,
).extend(CustomJobApplicationStatesRepositoryClass.prototype);
