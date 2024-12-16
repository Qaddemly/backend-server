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
