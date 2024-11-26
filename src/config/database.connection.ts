import mongoose from 'mongoose';

function databaseConnect() {
    const dbConnectionString = process.env.DATABASE_URL!.replace(
        '<db_password>',
        process.env.DATABASE_PASSWORD!,
    );
    mongoose
        .connect(dbConnectionString)
        .then(() => {
            console.log(`Database connected successfully`);
        })
        .catch((e) => {
            console.log(`Database connection failed`);
        });
}

export default databaseConnect;
