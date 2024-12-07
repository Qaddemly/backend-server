import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import databaseConnect from './config/database.connection';
import { AppDataSource } from './data-source';

// database connection

const port = process.env.PORT || 3000;

databaseConnect();

AppDataSource.initialize()
    .then(async () => {
        console.log('Postgres Database connected successfully');
    })
    .catch((error) =>
        console.log('Postgres Database connection failed', error),
    );

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
