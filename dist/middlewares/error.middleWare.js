"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
var devError = function (err, res) {
    res.status(err.statusCode).json({
        status: err.status,
        name: err.name,
        message: err.message,
        details: err.stack,
    });
};
var sendValidationError = function (err, res) {
    res.status(err.statusCode).json({
        status: err.status,
        name: err.name,
        message: err.message,
        details: err.validatorErrors,
    });
};
var sendErrorProduction = function (err, res) {
    res.status(err.statusCode).json({
        status: err.status,
        name: err.name,
        message: err.message,
    });
};
var globalErrorHandler = function (err, req, res, next) {
    err.statusCode = err.statusCode || 500;
    if (err.message === 'validationErrors') {
        sendValidationError(err, res);
    }
    else if (process.env.NODE_ENV === 'development') {
        devError(err, res);
    }
    else {
        sendErrorProduction(err, res);
    }
};
exports.globalErrorHandler = globalErrorHandler;
//# sourceMappingURL=error.middleWare.js.map