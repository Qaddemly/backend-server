import { Address } from '../entity/General/Address';
import { EmploymentType } from '../enums/employmentType';
import { LocationType } from '../enums/locationType';
import { Country } from '../enums/country';
import { CreateJobApplicationFormQuestionDto } from './JobApplicationDto';

export interface CreateJobBodyBTO {
    title: string;
    description: string;

    location: { country: Country; city: string };

    location_type: LocationType;
    skills: string[];
    salary: number;
    employee_type: EmploymentType;
    keywords: string[];
    experience: number;
    business_id: number;
    questions: CreateJobApplicationFormQuestionDto;
    has_extra_link_application: boolean;
    extra_application_link: string;
}

export interface UpdateJobBodyBTO {
    title?: string;
    description?: string;

    location?: { country: Country; city: string };

    location_type?: LocationType;
    skills?: string[];
    salary?: number;
    employee_type?: EmploymentType;
    keywords?: string[];
    experience?: number;
    has_extra_link_application?: boolean;
    extra_application_link?: string;
}
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
        | 'has_extra_link_application'
        | 'extra_application_link'
    > {}
