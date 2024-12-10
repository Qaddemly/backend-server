import mongoose from 'mongoose';
import AccountTempData from '../models/accountModel';

function databaseConnect() {
    const dbConnectionString = process.env.DATABASE_URL!.replace(
        '<db_password>',
        process.env.DATABASE_PASSWORD!,
    );
    mongoose
        .connect(dbConnectionString)
        .then(() => {
            console.log(`MongoDB Database connected successfully`);
        })
        .catch((e) => {
            console.log(`MongoDB Database connection failed`);
        });
}

export default databaseConnect;
