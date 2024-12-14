import dotenv from 'dotenv';
dotenv.config({ path: './abdo.env' });

import app from './app';
import databaseConnect from './config/database.connection';
import { AppDataSource } from './data-source';
import { Logger } from './utils/logger';

const port = process.env.PORT || 3000;

databaseConnect();

AppDataSource.initialize()
    .then(async () => {
        Logger.info('Postgres Database connected successfully');
        // const password = await hashingPassword('12345678');
        // const account = new Account();
        // account.first_name = 'abdo';
        // account.last_name = 'khattab';
        // account.email = 'abdo@mailsac.com';
        // account.password = password;
        // account.date_of_birth = new Date('1997-09-09');
        // account.profile_picture = 'https://www.google.com';
        //
        // const address = new Address();
        // address.country = Country.Algeria;
        // address.city = 'Cairo';
        //
        // account.address = address;

        // account.resume = 'https://www.google.com';
        // await AccountRepo.save(account);
    })
    .catch((error) => {
        Logger.error('Postgres Database connection failed', error);
    });

app.listen(port, () => {
    Logger.info(`Server is running on port ${port}`);
});
