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
    updateUserForSignUpStepTwo,
    changeCurrentPassword,
    signInGoogleRedirection,
    clearCookies,
    signUpService,
    getMeService,
} from '../services/authServices';
import { generateAndEmailCode } from '../utils/codeUtils';
import User from '../models/userModel';
import { userDocument } from '../types/documentTypes';
import { AccountRepository } from '../Repository/accountRepository';
import AccountTempData from '../models/accountModel';

export const signUp = catchAsync(
    async (
        req: Request<{}, {}, signUpBody, {}>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const activationToken = await signUpService(req.body);

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
            const user = await updateUserForSignUpStepTwo(req.user?.id, req);

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
            const [isActivated, token, refreshToken, user] = await logInService(
                req,
                res,
                req.body.email,
                req.body.password,
            );
            if (isActivated) {
                res.status(200).json({
                    success: true,
                    user,
                    accessToken: token,
                    refreshToken,
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
        const refreshToken = req.cookies.refreshToken;
        const currentUser = await AccountRepository.findOneBy({
            id: req.user?.id,
        });
        const userTempData = await AccountTempData.findOne({
            accountId: currentUser.id,
        });
        if (currentUser) {
            userTempData.refreshTokens = userTempData.refreshTokens.filter(
                (rt) => rt !== refreshToken,
            );
            await userTempData.save();
        }

        clearCookies(res);
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
    async (req: Request, res: Response) => {
        const [accessToken, refreshToken, user] = await signInGoogleRedirection(
            req,
            res,
        );
        const frontRedirectionUrl = `${process.env.FRONTEND_URL}?googleAuthSuccess=true`;
        res.redirect(frontRedirectionUrl); //redirect to home page of frontend
        // res.status(200).json({
        //     success: true,
        //     user,
        //     accessToken,
        //     refreshToken,
        // });
    },
];

// export const updateMe = catchAsync(
//     async (
//         req: Request<{}, {}, updateMeBody>,
//         res: Response,
//         next: NextFunction,
//     ) => {
//         try {
//             const user = await updateMyInfo(req, req.user?.id);
//             res.status(200).json({
//                 success: true,
//                 user,
//             });
//         } catch (err) {
//             return next(err);
//         }
//     },
// );

export const getMe = catchAsync(
    async (req: Request<{}, {}, {}>, res: Response, next: NextFunction) => {
        try {
            const user = await getMeService(req);
            res.status(200).json({
                success: true,
                user,
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
            await changeCurrentPassword(req, res);
            res.status(200).json({
                success: true,
                message: 'Your password has been changed , please login again',
            });
        } catch (err) {
            return next(err);
        }
    },
);
