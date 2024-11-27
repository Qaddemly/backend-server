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
    signUpBodyStepTwoDTO,
    updateMeBody,
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
    generateAndEmailCode,
} from '../utils/codeUtils';
import { hashingPassword, isCorrectPassword } from '../utils/password';
import { createAccessToken, verifyToken } from '../utils/jwt';
import { JwtPayload } from 'jsonwebtoken';
import { mongoId, userDocument } from '../types/documentTypes';
import { uploadSingleImage } from '../middlewares/uploadImage.middleWare';
import sharp from 'sharp';

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
    reqBody: signUpBodyStepTwoDTO,
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
    } = reqBody;

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
        },
        { new: true },
    );
    if (!user) {
        throw new AppError('user not found', 404);
    }
    return user;
};
export const uploadUserImage = uploadSingleImage('profilePicture');
export const resizeUserImage = catchAsync(
    async (
        req: Request<{}, {}, signUpBodyStepTwoDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        if (req.file?.buffer) {
            // console.log("req.files", req.files.imageCover[0]);
            const userImageName = `user-${Math.round(
                Math.random() * 1e9,
            )}-${Date.now()}.jpeg`;
            const imageDbUrl = `${process.env.BASE_URL}/uploads/users/${userImageName}`;
            await sharp(req.file.buffer)
                .resize(800, 600)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(`src/uploads/users/${userImageName}`);
            req.body.profilePicture = imageDbUrl;
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

export const logInService = async (email: string, password: string) => {
    //console.log(typeof req.query.limit, typeof req.query.page);
    //1- find user by email
    const user = await User.findOne({ email });
    if (!user) {
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
        return [false, activationToken, null];
    } else {
        //3- create access token
        const accessToken = createAccessToken(user.id);
        return [true, accessToken, user];
    }
};

export const protect = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
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
            return next(
                new AppError(
                    'you are not logged in please login to access this route',
                    401,
                ),
            );
        }
        let decoded: JwtPayload;
        decoded = verifyToken(token);
        const user = await User.findById(decoded!.userId);
        if (!user) {
            return next(
                new AppError('user belong to that token does not exist', 401),
            );
        }

        if (user.passwordChangedAt) {
            const passChangedAtTimeStamp = parseInt(
                `${user.passwordChangedAt.getTime() / 1000}`,
                10,
            );

            if (passChangedAtTimeStamp > decoded!.iat!) {
                return next(
                    new AppError('password is changed please login again', 401),
                );
            }
        }
        req.user = user; // for letting user to use protected routes
        next();
    },
);

export const createAccessTokenForGoogleAuth = (userId: mongoId) => {
    const accessToken = createAccessToken(userId);
    return accessToken;
};

export const updateMyInfo = async (reqBody: updateMeBody, userId: mongoId) => {
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
    } = reqBody;
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
        },
        {
            new: true,
        },
    );
    if (!user) {
        throw new AppError('user not found', 404);
    }
    return user;
};
