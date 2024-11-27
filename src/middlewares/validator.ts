import { ContextRunner } from 'express-validator';
import express from 'express';
import AppError from '../utils/appError';

function validateRequestMiddleware(validations: ContextRunner[]) {
    return async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ): Promise<any> => {
        // sequential processing, stops running validations chain if one fails.
        for (const validation of validations) {
            const result = await validation.run(req);
            if (!result.isEmpty()) {
                return next(
                    new AppError('validationErrors', 400, result.array()),
                );
            }
        }
        next();
    };
}

export default validateRequestMiddleware;
