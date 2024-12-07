import { businessRepo } from '../Repository/businessRepo';
import { Business } from '../entity/Business';
import { CreateBusinessDto } from '../dtos/businessDto';

export const createBusiness = async (
    business: CreateBusinessDto,
): Promise<Business> => {
    return await businessRepo.save(business);
};
