import { Address } from '../entity/Address';
import { EmploymentType } from '../enums/employmentType';
import { LocationType } from '../enums/locationType';

export interface CreateJobBodyBTO {
    title: string;
    description: string;
    location: Address;
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
        | 'location'
        | 'salary'
        | 'location_type'
        | 'title'
        | 'experience'
        | 'skills'
    > {}
