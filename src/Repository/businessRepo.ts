import { Repository } from 'typeorm';
import { Business } from '../entity/Business';
import { AppDataSource } from '../data-source';

export const businessRepo: Repository<Business> =
    AppDataSource.getRepository(Business);
