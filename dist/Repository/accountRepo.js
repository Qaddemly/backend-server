"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountRepo = void 0;
var Account_1 = require("../entity/Account");
var data_source_1 = require("../data-source");
exports.AccountRepo = data_source_1.AppDataSource.getRepository(Account_1.Account);
//# sourceMappingURL=accountRepo.js.map