"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var logger_1 = require("../utils/logger");
function databaseConnect() {
    var dbConnectionString = process.env.DATABASE_URL.replace('<db_password>', process.env.DATABASE_PASSWORD);
    mongoose_1.default
        .connect(dbConnectionString)
        .then(function () {
        // AccountTempData.create({
        //     accountId: 2,
        // }).then(() => {});
        logger_1.Logger.info("MongoDB Database connected successfully");
    })
        .catch(function (e) {
        logger_1.Logger.info("MongoDB Database connection failed", e);
    });
}
exports.default = databaseConnect;
//# sourceMappingURL=database.connection.js.map