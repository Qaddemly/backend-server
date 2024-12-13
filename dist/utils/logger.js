"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.morganMiddleware = exports.Logger = void 0;
var winston_1 = __importDefault(require("winston"));
var levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};
var level = function () {
    var env = process.env.NODE_ENV || 'development';
    var isDevelopment = env === 'development';
    return isDevelopment ? 'debug' : 'warn';
};
var colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
};
winston_1.default.addColors(colors);
var format = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }), winston_1.default.format.colorize({ all: true }), winston_1.default.format.printf(function (info) { return "".concat(info.timestamp, " ").concat(info.level, ": ").concat(info.message); }));
var transports = [
    new winston_1.default.transports.Console(),
    new winston_1.default.transports.File({
        filename: 'logs/error.log',
        level: 'error',
    }),
    new winston_1.default.transports.File({ filename: 'logs/all.log' }),
];
exports.Logger = winston_1.default.createLogger({
    level: level(),
    levels: levels,
    format: format,
    transports: transports,
});
var morgan_1 = __importDefault(require("morgan"));
var stream = {
    // Use the http severity
    write: function (message) { return exports.Logger.http(message); },
};
var skip = function () {
    var env = process.env.NODE_ENV || 'development';
    return env !== 'development';
};
// Build the morgan middleware
exports.morganMiddleware = (0, morgan_1.default)(':method :url :status :res[content-length] - :response-time ms', 
// Options: in this case, I overwrote the stream and the skip logic.
// See the methods above.
{ stream: stream, skip: skip });
//# sourceMappingURL=logger.js.map