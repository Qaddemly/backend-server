import { Document, Query, Types, Model, SchemaType } from 'mongoose';
import { userDoc } from '../models/userModel';
export type mongoId = Types.ObjectId;

export type userDocument = userDoc & Document;

export type mongooseQuery = Query<Document[], Document>;
export type mongooseModel = Model<Document>;
export interface IMongoInterface {
    [index: string]: any;
}
export type mongoDocument = IMongoInterface & Document;
