import { LocationType } from '../enums/locationType';
import { Speciality } from '../entity/Specialitie';
import { Account } from '../entity/Account';

export interface CreateBusinessDto {
    company_name: string;
    location: string;
    location_type: LocationType;
    description: string;
    company_size: number;
    industry: string;
    website: string;
    headquarter: string;
    specialities: Speciality[];
    email: string;
    phone: string;
    hr_employees?: Account[];
}
