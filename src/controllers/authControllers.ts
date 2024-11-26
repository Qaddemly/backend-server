import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';
import {
    activateEmailBody,
    activateEmailParams,
    forgetPasswordBody,
    logInBody,
    resetPasswordBody,
    resetPasswordParams,
    signUpBody,
    verifyResetCodeBody,
    verifyResetCodeParams,
} from '../dtos/authDto';
import catchAsync from 'express-async-handler';
import { createUserForSignUp } from '../services/authServices';
import { generateAndEmailCode } from '../utils/codeUtils';

export const signUp = catchAsync(
    async (
        req: Request<{}, {}, signUpBody, {}>,
        res: Response,
        next: NextFunction,
    ) => {
        const userData = req.body;
        //1-create a new user
        const newUser = await createUserForSignUp(userData);
        //2-sending email containing activation code for user mail
        const activationToken = await generateAndEmailCode(newUser, next);
        res.status(201).json({
            success: true,
            message:
                'User created successfully. Check your email for activation.',
            activationToken,
        });
    },
);
