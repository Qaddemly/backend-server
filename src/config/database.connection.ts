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
            console.log(`Database connected successfully`);
            // AccountTempData.create({ accountId: 4 }).then(() => {
            //     console.log('done');
            // });
        })
        .catch((e) => {
            console.log(`Database connection failed`);
        });
}

export default databaseConnect;
