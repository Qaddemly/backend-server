import mongoose from 'mongoose';
import AccountTempData from '../models/accountModel';
import { container, Logging } from '../utils/logger';

const logger = container.get(Logging);

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
            logger.logInfo(`MongoDB Database connected successfully`);
        })
        .catch((e) => {
            logger.logError(`MongoDB Database connection failed`, e);
        });
}

export default databaseConnect;
