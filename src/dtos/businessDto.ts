import { LocationType } from '../enums/locationType';
import { Account } from '../entity/Account';

export interface CreateBusinessDto {
    name: string;
    logo: string;
    location: string;
    location_type: LocationType;
    description: string;
    company_size: number;
    industry: string;
    website: string;
    headquarter: string;
    specialities: string[];
    email: string;
    phone: string;
    hr_employees?: Account[];
}
