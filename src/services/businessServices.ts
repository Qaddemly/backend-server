import { businessRepo } from '../Repository/businessRepo';
import { Business } from '../entity/Business';

export const createBusiness = async (business: Business): Promise<Business> => {
    return await businessRepo.save(business);
};
