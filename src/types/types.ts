import { CountryCode } from '../enums/countryCode';
import { Country } from '../enums/country';
import { EmploymentType } from '../enums/employmentType';
import { LocationType } from '../enums/locationType';
import { messageDTO } from '../dtos/messageDto';

export interface Phone {
    countryCode: CountryCode;
    number: string;
}

export interface Address {
    country: Country;
    city: string;
}

export interface Education {
    university: string;
    fieldOfStudy: string;
    gpa: number;
    startDate: Date;
    endDate: Date;
}

export interface Experience {
    jobTitle: string;
    description: string;
    employmentType: EmploymentType;
    companyName: string;
    location: string;
    locationType: LocationType;
    stillWorking: boolean;
    startDate: Date;
    endDate?: Date;
}

export interface SkillType {
    name: string;
}

export interface ResumeType {
    name: string;
    url: string;
    size: number;
}
export interface languageType {
    name: string;
}

export type expressFiles = {
    [index: string]: Express.Multer.File[];
};

export interface getBusinessQueryParams {
    prefix: string;
}
export interface hrDashboardUserInfo {
    toBeProcessedUserId?: number;
    role?: string;
}

export interface PublicObject {
    [index: string]: any;
}

export interface NotificationMessageType {
    userId: number;
    businessId: number;
    content: string;
    chat: any;
}
