"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var express_1 = __importDefault(require("express"));
require("./utils/googlePassportConfig");
var express_session_1 = __importDefault(require("express-session"));
var connect_mongodb_session_1 = __importDefault(require("connect-mongodb-session"));
var mongoStore = (0, connect_mongodb_session_1.default)(express_session_1.default);
var passport_1 = __importDefault(require("passport"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var cors_1 = __importDefault(require("cors"));
var error_middleWare_1 = require("./middlewares/error.middleWare");
var routes_1 = __importDefault(require("./routes"));
var app = (0, express_1.default)();
var corsOptions = {
    origin: true,
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOptions));
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
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, 'uploads')));
(0, routes_1.default)(app);
app.all('*', function (req, res, next) {
    res.status(404).json({
        success: false,
        message: "cant find ".concat(req.url),
    });
});
app.use(error_middleWare_1.globalErrorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map