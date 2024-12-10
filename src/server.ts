import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import databaseConnect from './config/database.connection';
import { AppDataSource } from './data-source';
import { Account } from './entity/Account';
import { hashingPassword } from './utils/password';
import { AccountRepo } from './Repository/accountRepo';

// database connection

const port = process.env.PORT || 3000;

databaseConnect();

AppDataSource.initialize()
    .then(async () => {
        console.log('Postgres Database connected successfully');
        // const password = await hashingPassword('12345678');
        // const account = new Account();
        // account.firstName = 'abdo';
        // account.lastName = 'khattab';
        // account.email = 'abdo@mailsac.com';
        // account.password = password;
        // await AccountRepo.save(account);
    })
    .catch((error) =>
        console.log('Postgres Database connection failed', error),
    );

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
