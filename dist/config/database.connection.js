"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
function databaseConnect() {
    var dbConnectionString = process.env.DATABASE_URL.replace('<db_password>', process.env.DATABASE_PASSWORD);
    mongoose_1.default
        .connect(dbConnectionString)
        .then(function () {
        console.log("Database connected successfully");
        // AccountTempData.create({ accountId: 4 }).then(() => {
        //     console.log('done');
        // });
    })
        .catch(function (e) {
        console.log("Database connection failed");
    });
}
exports.default = databaseConnect;
//# sourceMappingURL=database.connection.js.map