import { Request, Response, NextFunction } from 'express';

import passport from 'passport';

import {
    activateEmailBody,
    activateEmailParams,
    changeMyPasswordBody,
    forgetPasswordBody,
    logInBody,
    resetPasswordBody,
    resetPasswordParams,
    signUpBody,
    signUpBodyStepTwoDTO,
    updateMeBody,
    verifyResetCodeBody,
    verifyResetCodeParams,
} from '../dtos/authDto';
import catchAsync from 'express-async-handler';
import {
    createUserForSignUp,
    createAnotherCodeAndResend,
    verifyActivationCode,
    generateForgetPasswordCodeAndEmail,
    createAnotherResetPasswordCodeAndResend,
    PasswordResetCodeVerification,
    createNewPassword,
    logInService,
    createAccessTokenForGoogleAuth,
    updateUserForSignUpStepTwo,
    updateMyInfo,
    changeCurrentPassword,
} from '../services/authServices';
import { generateAndEmailCode } from '../utils/codeUtils';

export const signUp = catchAsync(
    async (
        req: Request<{}, {}, signUpBody, {}>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const userData = req.body;
            //1-create a new user
            const newUser = await createUserForSignUp(userData);
            //2-sending email containing activation code for user mail
            const activationToken = await generateAndEmailCode(newUser);

            res.status(201).json({
                success: true,
                message:
                    'User created successfully. Check your email for activation.',
                activationToken,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const SignUpStepTwo = catchAsync(
    async (
        req: Request<{}, {}, signUpBodyStepTwoDTO, {}>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const user = await updateUserForSignUpStepTwo(
                req.user?.id,
                req.body,
            );

            res.status(201).json({
                success: true,
                message:
                    'congrats you have complete your registration successfully',
                user,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const activateEmail = catchAsync(
    async (
        req: Request<activateEmailParams, {}, activateEmailBody>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await verifyActivationCode(
                req.body.code,
                req.params.activationToken,
            );

            res.status(200).json({
                success: true,
                message: 'email has been activated successfully, please login',
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const resendActivationCode = catchAsync(
    async (
        req: Request<activateEmailParams>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await createAnotherCodeAndResend(req.params.activationToken);
            res.status(200).json({
                success: true,
                message: 'code sent, please check your mail box',
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const forgetPassword = catchAsync(
    async (
        req: Request<{}, {}, forgetPasswordBody>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const resetVerificationToken =
                await generateForgetPasswordCodeAndEmail(req.body.email);
            res.status(200).json({
                success: true,
                resetVerificationToken,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const resendPasswordResetCodeAgain = async (
    req: Request<verifyResetCodeParams>,
    res: Response,
    next: NextFunction,
) => {
    try {
        await createAnotherResetPasswordCodeAndResend(
            req.params.resetActivationToken,
        );
        res.status(200).json({
            success: true,
            message: 'reset code sent, please check your mail box',
        });
    } catch (err) {
        return next(err);
    }
};

export const verifyPasswordResetCode = catchAsync(
    async (
        req: Request<verifyResetCodeParams, {}, verifyResetCodeBody>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const passwordResetToken = await PasswordResetCodeVerification(
                req.body.code,
                req.params.resetActivationToken,
            );
            res.status(200).json({
                success: true,
                message: 'code verified',
                passwordResetToken: passwordResetToken,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const resetPassword = catchAsync(
    async (
        req: Request<resetPasswordParams, {}, resetPasswordBody>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await createNewPassword(
                req.params.passwordResetToken,
                req.body.newPassword,
            );
            res.status(200).json({
                success: true,
                message: 'password reset successfully,please login',
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const logIn = catchAsync(
    async (
        req: Request<{}, {}, logInBody>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const [isActivated, token, user] = await logInService(
                req.body.email,
                req.body.password,
            );
            if (isActivated) {
                res.cookie('accessToken', token, {
                    httpOnly: true,
                    maxAge: 30 * 24 * 60 * 60 * 1000, //30 day
                });
                res.status(200).json({
                    success: true,
                    user,
                    accessToken: token,
                });
            } else {
                res.status(200).json({
                    success: true,
                    message: 'activation code sent, please check your mail box',
                    activationToken: token,
                });
            }
        } catch (err) {
            return next(err);
        }
    },
);

export const logOut = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        res.clearCookie('accessToken');
        res.status(200).json({
            success: true,
            message: 'logged out successfully',
        });
    },
);

export const googleAuth = passport.authenticate('google', {
    scope: ['profile', 'email'],
});

//exchange code with profile info
export const googleRedirection = [
    passport.authenticate('google'),
    (req: Request, res: Response) => {
        const accessToken = createAccessTokenForGoogleAuth(req.user?.id);
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000, //30 day
        });
        res.status(200).json({
            success: true,
            user: req.user,
            accessToken,
        });
    },
];

export const updateMe = catchAsync(
    async (
        req: Request<{}, {}, updateMeBody>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const user = await updateMyInfo(req.body, req.user?.id);
            res.status(200).json({
                success: true,
                user,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const getMe = catchAsync(
    async (req: Request<{}, {}, {}>, res: Response, next: NextFunction) => {
        try {
            res.status(200).json({
                success: true,
                user: req.user,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const changeMyPassword = catchAsync(
    async (
        req: Request<{}, {}, changeMyPasswordBody>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await changeCurrentPassword(req);
            res.status(200).json({
                success: true,
                message: 'Your password has been changed , please login again',
            });
        } catch (err) {
            return next(err);
        }
    },
);
