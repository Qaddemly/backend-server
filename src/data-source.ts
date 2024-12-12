import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5433,
    username: 'postgres',
    password: 'ESl33665599',
    database: 'typeorm learning',
    synchronize: true,
    logging: false,
    entities: [__dirname + '/entity/*{.js,.ts}'],
    migrations: [],
    subscribers: [],
});
