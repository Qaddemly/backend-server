"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const error_middleWare_1 = require("./middlewares/error.middleWare");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(error_middleWare_1.globalErrorHandler);
exports.default = app;
