import { AppDataSource } from '../data-source';
import { Speciality } from '../entity/Specialitie';
import { Repository } from 'typeorm';

export const specialityRepo: Repository<Speciality> =
    AppDataSource.getRepository(Speciality);
