import mongoose from 'mongoose';
import { Logger } from '../utils/logger';

function databaseConnect() {
    const dbConnectionString = process.env.DATABASE_URL!.replace(
        '<db_password>',
        process.env.DATABASE_PASSWORD!,
    );
    mongoose
        .connect(dbConnectionString)
        .then(() => {
            // AccountTempData.create({
            //     accountId: 2,
            // }).then(() => {});
            Logger.info(`MongoDB Database connected successfully`);
        })
        .catch((e) => {
            Logger.info(`MongoDB Database connection failed`, e);
        });
}

export default databaseConnect;
