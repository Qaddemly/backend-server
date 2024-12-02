import { Request, Response, NextFunction } from 'express';
import User from '../models/userModel';
import { JwtPayload } from 'jsonwebtoken';
import fs from 'fs';
import AppError from '../utils/appError';
import {
    changeMyPasswordBody,
    logInBody,
    signUpBody,
    signUpBodyStepTwoDTO,
    updateMeBody,
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
    generateAndEmailCode,
} from '../utils/codeUtils';
import { hashingPassword, isCorrectPassword } from '../utils/password';
import {
    createAccessToken,
    createRefreshToken,
    verifyTokenAsync,
} from '../utils/jwt';
import { mongoId, userDocument } from '../types/documentTypes';
import {
    uploadProfilePicAndResume,
    uploadSingleImage,
    uploadSingleResume,
} from '../middlewares/upload.middleWare';
import sharp from 'sharp';
import { expressFiles } from '../types/types';

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

export const updateUserForSignUpStepTwo = async (
    userId: mongoId,
    req: Request<{}, {}, signUpBodyStepTwoDTO>,
) => {
    const {
        address,
        phone,
        education,
        experience,
        skills,
        dateOfBirth,
        languages,
        profilePicture,
        resume,
    } = req.body;

    const user = await User.findByIdAndUpdate(
        userId,
        {
            address: address,
            phone: phone,
            education: education,
            experience: experience,
            skills: skills,
            dateOfBirth: dateOfBirth,
            languages: languages,
            profilePicture,
            resume: resume,
        },
        { new: true },
    );
    if (!user) {
        throw new AppError('user not found', 404);
    }
    return user;
};
export const uploadUserPICAndResume = uploadProfilePicAndResume([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'resume', maxCount: 1 },
]);
//export const uploadUserImage = uploadSingleImage('profilePicture');
export const resizeUserImage = catchAsync(
    async (
        req: Request<{}, {}, signUpBodyStepTwoDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        //console.log((req.files! as expressFiles).resume);
        if ((req.files! as expressFiles).profilePicture) {
            // console.log("req.files", req.files.imageCover[0]);
            const userImageName = `user-${Math.round(
                Math.random() * 1e9,
            )}-${Date.now()}.jpeg`;
            const imageDbUrl = `${process.env.BASE_URL}/uploads/users/${userImageName}`;
            await sharp((req.files! as expressFiles).profilePicture[0].buffer)
                .resize(800, 600)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(`src/uploads/users/${userImageName}`);
            req.body.profilePicture = imageDbUrl;
        }
        next();
    },
);

//export const uploadUserResume = uploadSingleResume('resume');
export const savingResumeInDisk = catchAsync(
    async (
        req: Request<{}, {}, signUpBodyStepTwoDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        if ((req.files! as expressFiles).resume) {
            const originalFileName = (req.files! as expressFiles).resume[0]
                .originalname;
            const resumeExtension = originalFileName.substring(
                originalFileName.lastIndexOf('.') + 1,
            );
            const resumeName = `resume-${Math.round(
                Math.random() * 1e9,
            )}-${Date.now()}.${resumeExtension}`;
            const resumeDbUrl = `${process.env.BASE_URL}/uploads/resumes/${resumeName}`;
            // Save the PDF to disk
            const filePath = `src/uploads/resumes/${resumeName}`;

            fs.writeFile(
                filePath,
                (req.files! as expressFiles).resume[0].buffer,
                (err) => {
                    if (err) {
                        return next(new AppError('Error saving file to disk.'));
                    }
                },
            );
            req.body.resume = resumeDbUrl;
        }
        next();
    },
);

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
        throw new AppError('code is incorrect or expired', 400);
    }
    user.isActivated = true;
    await resettingUserCodeFields(user);
};

export const createAnotherCodeAndResend = async (activationToken: string) => {
    const user = await User.findOne({ activationToken: activationToken });
    if (!user) {
        throw new AppError('user belong to that token does not exist', 400);
    }
    const code = await generateAnotherActivationCode(user);
    const subject = 'email activation';
    const message = `your activation code is ${code}`;
    await sendingCodeToEmail(user, subject, message);
};

export const generateForgetPasswordCodeAndEmail = async (email: string) => {
    const user = await User.findOne({ email: email });
    if (!user) {
        throw new AppError('no user found with this email', 404);
    }
    const resetVerificationToken = await generateAndEmailPassResetCode(user);

    return resetVerificationToken;
};

export const createAnotherResetPasswordCodeAndResend = async (
    resetActivationToken: string,
) => {
    const user = await User.findOne({
        passwordResetVerificationToken: resetActivationToken,
    });
    if (!user) {
        throw new AppError('user belong to that token does not exist', 400);
    }
    const code = await generateAnotherPassResetCode(user);
    const subject = 'password reset code';
    const message = `your password reset code is valid for (10 min) \n
      ${code}\n`;
    await sendingCodeToEmail(user, subject, message);
};

export const PasswordResetCodeVerification = async (
    code: string,
    resetActivationToken: string,
) => {
    const user = await User.findOne({
        passwordResetVerificationToken: resetActivationToken,
    });
    if (!user) {
        throw new AppError('no user founded with reset token', 404);
    }
    const hashedCode = cryptoEncryption(code);
    if (
        user.passwordResetCode != hashedCode ||
        user.passwordResetCodeExpires!.getTime() < Date.now()
    ) {
        throw new AppError('invalid or expired code', 400);
    }
    const passwordResetToken = await resetCodeVerified(user);
    return passwordResetToken;
};

export const createNewPassword = async (
    passwordResetToken: string,
    newPassword: string,
) => {
    const user = await User.findOne({
        passwordResetToken,
    });
    if (!user) {
        throw new AppError('no user founded with that token', 404);
    }
    const hashedPassword = await hashingPassword(newPassword);
    user.password = hashedPassword;
    user.passwordChangedAt = new Date(Date.now());
    await resettingUserCodeFields(user);
};

export const logInService = async (
    req: Request<{}, {}, logInBody>,
    res: Response,
    email: string,
    password: string,
) => {
    //console.log(typeof req.query.limit, typeof req.query.page);
    //1- find user by email
    const user = await User.findOne({ email });
    if (!user) {
        throw new AppError('email or password is incorrect', 400);
    }
    // when user not set password after login with google
    if (!user.password) {
        throw new AppError('email or password is incorrect', 400);
    }
    //2- checking password correction
    const isPassCorrect = await isCorrectPassword(password, user.password);
    if (!isPassCorrect) {
        throw new AppError('email or password is incorrect', 400);
    }
    // checking is email active
    if (!user.isActivated) {
        const activationToken = await generateAndEmailCode(user);
        return [false, activationToken, null, null];
    } else {
        //login success
        const [accessToken, refreshToken, updatedUser] =
            await createTokensForLoggedInUser(user, req, res);

        return [true, accessToken, refreshToken, updatedUser];
    }
};

export const protect = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        let user: any;
        try {
            const [refreshTokenDecodedEmail, foundedUser] =
                await refreshTokenHandler(req, res);
            let token: string;
            if (
                req.headers.authorization &&
                req.headers.authorization.startsWith('Bearer')
            ) {
                token = req.headers.authorization.split(' ')[0];
            } else {
                token = req.cookies.accessToken;
            }
            if (!token) {
                throw new AppError('there is no access token', 401);
            }
            user = foundedUser; // this line because when access token expired it will not got to the line after decoded
            const decoded = (await verifyTokenAsync(
                token,
                'access',
            )) as JwtPayload;
            user = await User.findById(decoded!.userId);
            if (!user) {
                throw new AppError(
                    'user belong to that token does not exist',
                    401,
                );
            }
            if (user.email !== refreshTokenDecodedEmail) {
                throw new AppError(
                    'malicious, refresh token does not match with access token',
                    403,
                );
            }
            if (user.passwordChangedAt) {
                const passChangedAtTimeStamp = parseInt(
                    `${user.passwordChangedAt.getTime() / 1000}`,
                    10,
                );

                if (passChangedAtTimeStamp > decoded!.iat!) {
                    throw new AppError(
                        'password is changed please login again',
                        401,
                    );
                }
            }

            if (user.passwordResetVerificationToken || user.activationToken) {
                await resettingUserCodeFields(user);
            }
            req.user = user; // for letting user to use protected routes
            next();
        } catch (err) {
            if ((err as Error).message === 'jwt expired') {
                // from access expiration
                const accessToken = createAccessToken(user?.id);
                const refreshToken = createRefreshToken(user?.email);
                const newRefreshTokens = user.refreshTokens;
                const refreshTokenList: any[] = [];
                for (const rt of newRefreshTokens) {
                    if (rt !== req.cookies.refreshToken)
                        refreshTokenList.push(rt);
                }
                user.refreshTokens = [
                    ...refreshTokenList,
                    refreshToken as string,
                ];
                await user.save();

                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: true,
                    maxAge: 10 * 24 * 60 * 60 * 1000,
                });
                res.cookie('accessToken', accessToken, {
                    httpOnly: true,
                    secure: true,
                    maxAge: 10 * 24 * 60 * 60 * 1000,
                });
                req.user = user;
                next();
            } else {
                let customError = new AppError( //any error is caught except 'jwt expired' it will display the same message in order to prevent attacker from knowing any thing about the error
                    'you are not logged in please login to access this route',
                    401,
                );
                customError.stack = (err as Error).stack; //to know from where the error is occurred
                return next(customError);
            }
        }
    },
);
const refreshTokenHandler = async (req: Request, res: Response) => {
    try {
        let refreshToken: string;
        if (req.cookies.refreshToken) {
            refreshToken = req.cookies.refreshToken;
        } else {
            throw new AppError('there is no refresh token', 403);
        }
        const foundUser = await User.findOne({ refreshTokens: refreshToken });

        // detect reuse of refreshToken
        if (!foundUser) {
            const decoded = await verifyTokenAsync(refreshToken, 'refresh');
            const hackedUser = await User.findOne({
                email: (decoded as JwtPayload).email,
            });
            if (hackedUser) {
                //signout all users
                hackedUser.refreshTokens = [];
                await hackedUser.save();
            }
            clearCookies(res);
            throw new AppError(
                'detect reuse of refresh token, illegitimate user',
                403,
            );
        }

        const decoded = await verifyTokenAsync(refreshToken, 'refresh');
        return [(decoded as JwtPayload).email, foundUser];
    } catch (err) {
        if ((err as Error).message === 'jwt expired') {
            clearCookies(res);
            throw new AppError('Expired refresh token', 403);
        } else if ((err as Error).message === 'invalid signature') {
            throw new AppError('Invalid refresh token', 403);
        } else throw err;
    }
};

const createTokensForLoggedInUser = async (
    user: userDocument,
    req: Request,
    res: Response,
) => {
    const accessToken = createAccessToken(user.id);
    const refreshToken = createRefreshToken(user.email);
    //try to login and he already logged in
    const cookies = req.cookies;
    let newRefreshTokens = !cookies?.refreshToken
        ? user.refreshTokens
        : user.refreshTokens.filter((rt) => rt !== cookies.refreshToken);

    user.refreshTokens = [...newRefreshTokens, refreshToken as string];
    if (user.password) {
        await user.save();
    } else {
        await user.save({ validateBeforeSave: false }); // for login with google
    }
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 10 * 24 * 60 * 60 * 1000,
    });
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 10 * 24 * 60 * 60 * 1000,
    });
    user.refreshTokens = [];
    return [accessToken, refreshToken, user];
};

export const signInGoogleRedirection = async (req: Request, res: Response) => {
    const user = await User.findById(req.user?.id);
    const [accessToken, refreshToken, updatedUser] =
        await createTokensForLoggedInUser(user!, req, res);

    return [accessToken, refreshToken, updatedUser];
};

export const updateMyInfo = async (
    req: Request<{}, {}, updateMeBody>,
    userId: mongoId,
) => {
    const {
        address,
        phone,
        education,
        experience,
        skills,
        dateOfBirth,
        languages,
        profilePicture,
        firstName,
        lastName,
        email,
        resume,
    } = req.body;
    const user = await User.findOneAndUpdate(
        { _id: userId },
        {
            address,
            phone,
            education,
            experience,
            skills,
            dateOfBirth,
            languages,
            profilePicture,
            firstName,
            lastName,
            email,
            resume,
        },
        {
            new: true,
        },
    );
    if (!user) {
        throw new AppError('user not found', 404);
    }
    req.user = user;
    return user;
};

export const changeCurrentPassword = async (
    req: Request<{}, {}, changeMyPasswordBody>,
    res: Response,
) => {
    const { currentPassword, newPassword } = req.body;
    const refreshToken = req.cookies.refreshToken;
    const currentUser = await User.findById(req.user?.id);
    if ((req.user! as userDocument).password) {
        const userPass = (req.user! as userDocument).password;
        const isCorrectCurrentPassword = isCorrectPassword(
            currentPassword,
            userPass,
        );
        if (!isCorrectCurrentPassword) {
            throw new AppError('password is incorrect', 400);
        }
        const hashedNewPassword = await hashingPassword(newPassword);
        // const currentUser = await User.findByIdAndUpdate(req.user?.id, {
        //     password: hashedNewPassword,
        //     passwordChangedAt: new Date(Date.now()),
        // });
        currentUser!.password = hashedNewPassword;
        currentUser!.passwordChangedAt = new Date(Date.now());
    } else {
        const hashedNewPassword = await hashingPassword(newPassword);
        // const currentUser = await User.findByIdAndUpdate(req.user?.id, {
        //     password: hashedNewPassword,
        //     passwordChangedAt: new Date(Date.now()),
        // });
        currentUser!.password = hashedNewPassword;
        currentUser!.passwordChangedAt = new Date(Date.now());
    }
    currentUser!.refreshTokens = currentUser!.refreshTokens.filter(
        (rt) => rt !== refreshToken,
    );
    await currentUser!.save();
    clearCookies(res);
};

export const clearCookies = (res: Response) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
};
