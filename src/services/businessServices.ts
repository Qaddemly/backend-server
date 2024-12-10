import { Business } from '../entity/Business';
import { CreateBusinessDto } from '../dtos/businessDto';
import { businessRepo } from '../Repository/businessRepo';

/**
 * TODO: mark the Account that created the business as the owner.
 * TODO: make it possible for user to add hr_employees with their roles at Creation.
 * */

export const createBusiness = async (
    createBusinessDto: CreateBusinessDto,
    userId: number,
): Promise<Business> => {
    const business = new Business();
    business.company_name = createBusinessDto.company_name;
    business.location = createBusinessDto.location;
    business.location_type = createBusinessDto.location_type;
    business.description = createBusinessDto.description;
    business.company_size = createBusinessDto.company_size;
    business.industry = createBusinessDto.industry;
    business.website = createBusinessDto.website;
    business.headquarter = createBusinessDto.headquarter;
    business.email = createBusinessDto.email;
    business.phone = createBusinessDto.phone;
    business.specialities = createBusinessDto.specialities;
    // We Have To Save Business first before adding specialities

    // business.hr_employees = createBusinessDto.hr_employees;

    return await businessRepo.save(business);
};
