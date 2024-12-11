import { Repository } from 'typeorm';
import { HrEmployee } from '../entity/HrEmployee';
import { AppDataSource } from '../data-source';

export const HrEmployeeRepo: Repository<HrEmployee> =
    AppDataSource.getRepository(HrEmployee);
