import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '171721',
    database: 'graduation_project',
    synchronize: true,
    logging: false,
    entities: [__dirname + '/entity/*{.js,.ts}'],
    migrations: [],
    subscribers: [],
});
