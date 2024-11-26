"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const database_connection_1 = __importDefault(require("./config/database.connection"));
dotenv_1.default.config({ path: './../.env' });
// database connection
const port = process.env.PORT || 3000;
(0, database_connection_1.default)();
console.log(`Hello`);
app_1.default.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
