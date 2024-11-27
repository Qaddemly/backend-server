import { Request, Response, NextFunction } from 'express';
import User from '../models/userModel';
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
import { sendingCodeToEmail } from '../utils/email';
import {
    resettingUserCodeFields,
    cryptoEncryption,
    generateAnotherActivationCode,
    generateAndEmailPassResetCode,
    generateAnotherPassResetCode,
    resetCodeVerified,
} from '../utils/codeUtils';
import { hashingPassword, isCorrectPassword } from '../utils/password';
import { createAccessToken, verifyToken } from '../utils/jwt';
import { JwtPayload } from 'jsonwebtoken';
import { userDocument } from '../types/documentTypes';

export const createUserForSignUp = async (
    reqBody: signUpBody,
): Promise<userDocument> => {
    const { firstName, lastName, email, password } = reqBody;
    // hashing password before saving it in data base
    const hashedPassword = await hashingPassword(password);
    //1- create user
    const newUser = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
    });
    return newUser;
};

export const verifyActivationCode = async (
    code: string,
    activationToken: string,
) => {
    const hashActivationCode = cryptoEncryption(code);
    const user = await User.findOne({
        activationToken: activationToken,
    });
    if (!user) {
        throw new AppError('user not found or token expired', 404);
    }

    if (
        user.activationCode != hashActivationCode ||
        user.activationCodeExpiresIn!.getTime() < Date.now()
    ) {
        new AppError('code is incorrect or expired', 400);
    }
    user.isActivated = true;
    resettingUserCodeFields(user);
};

export const resendActivationCode = catchAsync(
    async (
        req: Request<activateEmailParams>,
        res: Response,
        next: NextFunction,
    ) => {
        const { activationToken } = req.params;
        const user = await User.findOne({ activationToken: activationToken });
        if (!user) {
            return next(
                new AppError('user belong to that token does not exist', 400),
            );
        }
        const code = await generateAnotherActivationCode(user);
        const subject = 'email activation';
        const message = `your activation code is ${code}`;
        await sendingCodeToEmail(user, subject, message, next);
        res.status(200).json({
            success: true,
            message: 'code sent, please check your mail box',
        });
    },
);
