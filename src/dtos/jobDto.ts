import { Address } from '../entity/Address';
import { EmploymentType } from '../enums/employmentType';
import { LocationType } from '../enums/locationType';
import { Country } from '../enums/country';

export interface CreateJobBodyBTO {
    title: string;
    description: string;
    country: Country;
    city: string;
    location_type: LocationType;
    skills: string[];
    salary: number;
    employee_type: EmploymentType;
    keywords: string[];
    experience: number;
    business_id: number;
}

export interface UpdateJobBodyBTO extends CreateJobBodyBTO {}
export interface updateJobQueryData
    extends Pick<
        CreateJobBodyBTO,
        | 'description'
        | 'employee_type'
        | 'keywords'
        | 'country'
        | 'city'
        | 'salary'
        | 'location_type'
        | 'title'
        | 'experience'
        | 'skills'
    > {}
