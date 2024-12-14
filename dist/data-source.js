"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
var typeorm_1 = require("typeorm");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5433,
    username: 'postgres',
    password: 'ESl33665599',
    database: 'graduation_project',
    synchronize: true,
    logging: false,
    entities: [__dirname + '/entity/*{.js,.ts}'],
    migrations: [],
    subscribers: [],
});
//# sourceMappingURL=data-source.js.map