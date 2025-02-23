import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import databaseConnect from './config/database.connection';
import { AppDataSource } from './data-source';
import { Logger } from './utils/logger';
import { redisClient } from './config/redis';

const port = process.env.PORT || 3000;

redisClient
    .connect()
    .then(() => {
        Logger.info('Redis connected successfully');
    })
    .catch((error) => {
        Logger.error('Redis connection failed', error);
    });

databaseConnect();

AppDataSource.initialize()
    .then(async () => {
        Logger.info('Postgres Database connected successfully');
    })
    .catch((error) => {
        Logger.error('Postgres Database connection failed', error);
    });

app.listen(port, () => {
    Logger.info(`Server is running on port ${port}`);
});
