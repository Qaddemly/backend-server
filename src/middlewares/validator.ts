import { ContextRunner } from 'express-validator';
import express from 'express';
import AppError from '../utils/appError';
/*
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
*/

import { Request, Response, NextFunction, RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import catchAsync from 'express-async-handler';

export const validatorMiddleWare: RequestHandler = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new AppError('validationErrors', 501, errors.array()));
        }
        next();
    },
);
//export default validateRequestMiddleware;
