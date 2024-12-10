import { CountryCode } from '../enums/countryCode';
import { Country } from '../enums/country';
import { EmploymentType } from '../enums/employmentType';
import { LocationType } from '../enums/locationType';

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
    employmentType: EmploymentType;
    companyName: string;
    location: string;
    locationType: LocationType;
    stillWorking: boolean;
    startDate: Date;
    endDate?: Date;
}

export type expressFiles = {
    [index: string]: Express.Multer.File[];
};

export interface getBusinessQueryParams {
    prefix: string;
}
