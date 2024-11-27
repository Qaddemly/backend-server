"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("./utils/googlePassportConfig");
const express_session_1 = __importDefault(require("express-session"));
const connect_mongodb_session_1 = __importDefault(require("connect-mongodb-session"));
const mongoStore = (0, connect_mongodb_session_1.default)(express_session_1.default);
const passport_1 = __importDefault(require("passport"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const error_middleWare_1 = require("./middlewares/error.middleWare");
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.options('*', (0, cors_1.default)());
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
    saveUninitialized: true,
    resave: false,
    store: new mongoStore({
        uri: process.env.DATABASE_URL,
        collection: 'sessions',
    }),
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
//mount Routes
(0, routes_1.default)(app);
app.all('*', (req, res, next) => {
    res.status(404).json({
        success: false,
        message: `cant find ${req.url}`,
    });
});
app.use(error_middleWare_1.globalErrorHandler);
exports.default = app;
