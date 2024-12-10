"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var authRoutes_1 = __importDefault(require("./authRoutes"));
var mountRoutes = function (app) {
    var prefixUrl = '/api/v1';
    app.use(prefixUrl + '/auth', authRoutes_1.default);
};
exports.default = mountRoutes;
//# sourceMappingURL=index.js.map