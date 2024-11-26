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
import {
    createUserForSignUp,
    verifyActivationCode,
} from '../services/authServices';
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

export const activateEmail = catchAsync(
    async (
        req: Request<activateEmailParams, {}, activateEmailBody>,
        res: Response,
        next: NextFunction,
    ) => {
        const isSuccess =
            (await verifyActivationCode(
                req.body.code,
                req.params.activationToken,
                next,
            )) || null;
        if (isSuccess) {
            res.status(200).json({
                success: true,
                message: 'email has been activated successfully, please login',
            });
        }
    },
);

export const resendActivationCode = catchAsync(
    async (
        req: Request<activateEmailParams>,
        res: Response,
        next: NextFunction,
    ) => {
        res.status(200).json({
            success: true,
            message: 'code sent, please check your mail box',
        });
    },
);
