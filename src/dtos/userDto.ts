import { EmploymentType } from '../enums/employmentType';
import { LocationType } from '../enums/locationType';

export interface updateExperienceDTO {
    jobTitle: string;
    employmentType: EmploymentType;
    companyName: string;
    location: string;
    locationType: LocationType;
    stillWorking: boolean;
    startDate: Date;
    endDate: Date;
}

export interface createProjectDTO {
    name: string;
    description?: string;
    skills?: string[];
    start_date?: Date;
    end_date?: Date;
    still_working?: boolean;
    link?: string;
}

export interface updateProjectDTO {
    name?: string;
    description?: string;
    skills?: string[];
    start_date?: Date;
    end_date?: Date;
    still_working?: boolean;
    link?: string;
}

export interface createVolunteeringDTO {
    organization: string;
    role: string;
    description?: string;
    start_date?: Date;
    end_date?: Date;
}
export interface updateVolunteeringDTO {
    organization?: string;
    role?: string;
    description?: string;
    start_date?: Date;
    end_date?: Date;
}
