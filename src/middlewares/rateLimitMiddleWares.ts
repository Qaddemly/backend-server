import rateLimit from 'express-rate-limit';
export const loginRateLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 15-minute window
    max: 5, // Limit each IP to 5 requests per `windowMs`
    message: {
        success: false,
        message: 'Too many login attempts. Please try again after 10 minutes.',
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
});
