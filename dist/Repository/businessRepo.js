"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.businessRepo = void 0;
var Business_1 = require("../entity/Business");
var data_source_1 = require("../data-source");
exports.businessRepo = data_source_1.AppDataSource.getRepository(Business_1.Business);
//# sourceMappingURL=businessRepo.js.map