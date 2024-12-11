import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import databaseConnect from './config/database.connection';
import { AppDataSource } from './data-source';
import { Account } from './entity/Account';
import { hashingPassword } from './utils/password';
import { AccountRepo } from './Repository/accountRepo';
import { Country } from './enums/country';
import { Address } from './entity/Address';

// database connection

const port = process.env.PORT || 3000;

databaseConnect();

AppDataSource.initialize()
    .then(async () => {
        console.log('Postgres Database connected successfully');
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
    .catch((error) =>
        console.log('Postgres Database connection failed', error),
    );

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
