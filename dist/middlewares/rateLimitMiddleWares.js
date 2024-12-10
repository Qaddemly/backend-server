"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginRateLimiter = void 0;
var express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.loginRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000, // 15-minute window
    max: 5, // Limit each IP to 5 requests per `windowMs`
    message: {
        success: false,
        message: 'Too many login attempts. Please try again after 10 minutes.',
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
});
//# sourceMappingURL=rateLimitMiddleWares.js.map