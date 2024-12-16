import { Document, Query, Types, Model, SchemaType } from 'mongoose';
import { userDoc } from '../models/userModel';
import { EmploymentType } from '../enums/employmentType';
import { LocationType } from '../enums/locationType';
export type mongoId = Types.ObjectId;

export type userDocument = userDoc & Document;
export type UserType = { [key: string]: any };
export type mongooseQuery = Query<Document[], Document>;
export type mongooseModel = Model<Document>;
export interface IMongoInterface {
    [index: string]: any;
}
export type mongoDocument = IMongoInterface & Document;

export interface updateExperienceData {
    job_title: string;
    employment_type: EmploymentType;
    company_name: string;
    location: string;
    location_type: LocationType;
    still_working: boolean;
    start_date: Date;
    end_date: Date;
}
