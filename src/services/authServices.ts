import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import fs from 'fs/promises';
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
    cryptoEncryption,
    generateAndEmailCode,
    generateAndEmailPassResetCode,
    generateAnotherActivationCode,
    generateAnotherPassResetCode,
    resetCodeVerified,
    resettingUserCodeFields,
} from '../utils/codeUtils';
import { hashingPassword, isCorrectPassword } from '../utils/password';
import {
    createAccessToken,
    createRefreshToken,
    verifyTokenAsync,
} from '../utils/jwt';
import { UserType } from '../types/documentTypes';
import { uploadProfilePicAndResume } from '../middlewares/upload.middleWare';
import sharp from 'sharp';
import { expressFiles } from '../types/types';
import { AccountRepository } from '../Repository/accountRepository';
import AccountTempData from '../models/accountModel';
import { Account } from '../entity/Account';
import { EducationRepository } from '../Repository/educationRepository';
import { Education } from '../entity/Education';
import { Skill } from '../entity/Skill';
import { SkillRepository } from '../Repository/skillRepository';
import { Experience } from '../entity/Experience';
import { ExperienceRepository } from '../Repository/experineceRepository';
import {
    returningEducation,
    returningExperiences,
    returningLanguage,
    returningPhone,
} from '../utils/returningFieldAsInMongoDb';
import { Language } from '../entity/Language';
import { LanguageRepository } from '../Repository/languageRepository';
import { Logger } from '../utils/logger';
import { Resume } from '../entity/Resume';
import { ResumeRepository } from '../Repository/resumeRepository';
import { AccessMode } from '../enums/accessMode';

export const createUserForSignUp = async (reqBody: signUpBody) => {
    const { firstName, lastName, email, password } = reqBody;
    // hashing password before saving it in data base
    const hashedPassword = await hashingPassword(password);
    //1- create user
    const newUser = new Account();
    newUser.first_name = firstName;
    newUser.last_name = lastName;
    newUser.email = email;
    newUser.password = hashedPassword;
    await AccountRepository.save(newUser);
    return newUser;
};
export const signUpService = async (userData: signUpBody) => {
    try {
        const newUser = await createUserForSignUp(userData);
        const userTempData = await AccountTempData.create({
            accountId: newUser.id,
        });
        //2-sending email containing activation code for user mail
        const activationToken = await generateAndEmailCode(
            userTempData,
            newUser.email,
        );
        return activationToken;
    } catch (err) {
        if (err.code === 11000) {
            await AccountRepository.deleteOneAccount(err.keyValue.accountId);
            throw new AppError(
                `accountTempData is already exists , please delete accountTempData for accountId ${err.keyValue.accountId}`,
                400,
            );
        }
        console.error(err);
        throw err;
    }
};

export const updateUserForSignUpStepTwo = async (
    req: Request<{}, {}, signUpBodyStepTwoDTO>,
) => {
    const userId = Number(req.user.id);
    const user = await AccountRepository.findOneBy({
        id: userId,
    });
    if (!user) {
        throw new AppError('user not found', 404);
    }
    const userJson = await updateUserAfterSignUpFirstStep(user, req);
    return userJson;
};
export const uploadUserPICAndResume = uploadProfilePicAndResume([
    { name: 'profile_picture', maxCount: 1 },
    { name: 'resumes', maxCount: 10 },
]);
export const uploadProfilePic = uploadProfilePicAndResume([
    {
        name: 'profile_picture',
        maxCount: 1,
    },
]);

export const uploadResume = uploadProfilePicAndResume([
    {
        name: 'resumes',
        maxCount: 1,
    },
]);
//export const uploadUserImage = uploadSingleImage('profilePicture');
export const resizeUserImage = catchAsync(
    async (
        req: Request<{}, {}, signUpBodyStepTwoDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        //console.log((req.files! as expressFiles).resume);
        if (req.files) {
            if ((req.files! as expressFiles).profile_picture) {
                // console.log("req.files", req.files.imageCover[0]);
                const userImageName = `user-${Math.round(
                    Math.random() * 1e9,
                )}-${Date.now()}.jpeg`;
                const imageDbUrl = `${process.env.BASE_URL}/uploads/users/${userImageName}`;
                await sharp(
                    (req.files! as expressFiles).profile_picture[0].buffer,
                )
                    .resize(800, 600)
                    .toFormat('jpeg')
                    .jpeg({ quality: 90 })
                    .toFile(`src/uploads/users/${userImageName}`);
                req.body.profile_picture = imageDbUrl;
            }
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
        try {
            if (req.files) {
                if ((req.files! as expressFiles).resumes) {
                    const resumesUrlArrays: string[] = [];
                    const resumes = (req.files as expressFiles).resumes.map(
                        async (resume) => {
                            const originalFileName = resume.originalname;
                            const resumeExtension = originalFileName.substring(
                                originalFileName.lastIndexOf('.') + 1,
                            );
                            const resumeName = `resume-${Math.round(
                                Math.random() * 1e9,
                            )}-${Date.now()}.${resumeExtension}`;
                            const resumeDbUrl = `${process.env.BASE_URL}/uploads/resumes/${resumeName}`;
                            // Save the PDF to disk
                            resumesUrlArrays.push(resumeDbUrl);
                            const filePath = `src/uploads/resumes/${resumeName}`;

                            await fs.writeFile(filePath, resume.buffer);
                            return {
                                url: resumeDbUrl,
                                name: resume.originalname,
                                size: resume.size,
                            };
                        },
                    );
                    const resumesUrl = await Promise.all(resumes);
                    console.log(resumesUrl);
                    req.body.resumes = resumesUrl;
                }
            }
            next();
        } catch (err) {
            const customError = new AppError('error while saving file');
            customError.stack = err.stack;
            return next(customError);
        }
    },
);

export const verifyActivationCode = async (
    code: string,
    activationToken: string,
) => {
    const hashActivationCode = cryptoEncryption(code);
    const userTempData = await AccountTempData.findOne({
        activationToken: activationToken,
    });
    if (!userTempData) {
        throw new AppError('user not found or token expired', 404);
    }

    if (
        userTempData.activationCode != hashActivationCode ||
        userTempData.activationCodeExpiresIn!.getTime() < Date.now()
    ) {
        throw new AppError('code is incorrect or expired', 400);
    }
    const user = await AccountRepository.update(
        {
            id: userTempData.accountId,
        },
        { is_activated: true },
    );
    await resettingUserCodeFields(userTempData);
};

export const createAnotherCodeAndResend = async (activationToken: string) => {
    // const user = await User.findOne({ activationToken: activationToken });
    const userTempData = await AccountTempData.findOne({
        activationToken: activationToken,
    });
    const foundUser = await AccountRepository.findOneBy({
        id: userTempData.accountId,
    });
    if (!userTempData) {
        throw new AppError('user belong to that token does not exist', 400);
    }
    const code = await generateAnotherActivationCode(userTempData);
    const subject = 'email activation';
    const message = `your activation code is ${code}`;
    await sendingCodeToEmail(foundUser.email, subject, message);
};

export const generateForgetPasswordCodeAndEmail = async (email: string) => {
    const user = await AccountRepository.findOneBy({ email: email });
    if (!user) {
        throw new AppError('no user found with this email', 404);
    }
    const userTempData = await AccountTempData.findOne({ accountId: user.id });
    const resetVerificationToken = await generateAndEmailPassResetCode(
        userTempData,
        user.email,
    );

    return resetVerificationToken;
};

export const createAnotherResetPasswordCodeAndResend = async (
    resetActivationToken: string,
) => {
    const userTempData = await AccountTempData.findOne({
        passwordResetVerificationToken: resetActivationToken,
    });
    if (!userTempData) {
        throw new AppError(
            'userTempData belong to that token does not exist',
            400,
        );
    }
    const userFound = await AccountRepository.findOneBy({
        id: userTempData.accountId,
    });
    const code = await generateAnotherPassResetCode(userTempData);
    const subject = 'password reset code';
    const message = `your password reset code is valid for (10 min) \n
      ${code}\n`;
    await sendingCodeToEmail(userFound.email, subject, message);
};

export const PasswordResetCodeVerification = async (
    code: string,
    resetActivationToken: string,
) => {
    const userTempData = await AccountTempData.findOne({
        passwordResetVerificationToken: resetActivationToken,
    });
    if (!userTempData) {
        throw new AppError('no user founded with reset token', 404);
    }
    const hashedCode = cryptoEncryption(code);
    if (
        userTempData.passwordResetCode != hashedCode ||
        userTempData.passwordResetCodeExpires!.getTime() < Date.now()
    ) {
        throw new AppError('invalid or expired code', 400);
    }
    const userFound = await AccountRepository.findOneBy({
        id: userTempData.accountId,
    });
    const passwordResetToken = await resetCodeVerified(userTempData, userFound);
    return passwordResetToken;
};

export const createNewPassword = async (
    passwordResetToken: string,
    newPassword: string,
) => {
    const userTempData = await AccountTempData.findOne({
        passwordResetToken,
    });
    if (!userTempData) {
        throw new AppError('no userTempData founded with that token', 404);
    }

    const hashedPassword = await hashingPassword(newPassword);
    const userFound = await AccountRepository.update(
        {
            id: userTempData.accountId,
        },
        { password: hashedPassword, password_changed_at: new Date(Date.now()) },
    );

    await resettingUserCodeFields(userTempData);
};

export const logInService = async (
    req: Request<{}, {}, logInBody>,
    res: Response,
    email: string,
    password: string,
) => {
    //console.log(typeof req.query.limit, typeof req.query.page);
    //1- find user by email
    //const user = await User.findOne({ email });
    const account = await AccountRepository.findOneBy({ email: email });
    if (!account) {
        throw new AppError('email or password is incorrect', 400);
    }
    // when account not set password after login with google
    if (!account.password) {
        throw new AppError('email or password is incorrect', 400);
    }
    //2- checking password correction
    const isPassCorrect = await isCorrectPassword(password, account.password);
    if (!isPassCorrect) {
        throw new AppError('email or password is incorrect', 400);
    }
    // checking is email active
    if (!account.is_activated) {
        const userTempData = await AccountTempData.findOne({
            accountId: account.id,
        });
        const activationToken = await generateAndEmailCode(
            userTempData as UserType,
            account.email,
        );
        return [false, activationToken, null, null];
    } else {
        //login success

        const [accessToken, refreshToken, updatedUser] =
            await createTokensForLoggedInUser(account, req, res);

        return [true, accessToken, refreshToken, updatedUser];
    }
};
export const protectRoutes = (accessMode: AccessMode) =>
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        let user: any; // user from postgres
        let userTempData: any; // user temp data from mongo like (refresh token ,password reset token, ...)

        try {
            const [refreshTokenDecodedEmail, foundedUser, foundUserTempData] =
                await refreshTokenHandler(req, res);
            userTempData = foundUserTempData;
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
            user = await AccountRepository.findOneBy({ id: decoded!.userId });
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
            if (user.password_changed_at) {
                const passChangedAtTimeStamp = parseInt(
                    `${user.password_changed_at.getTime() / 1000}`,
                    10,
                );

                if (passChangedAtTimeStamp > decoded!.iat!) {
                    throw new AppError(
                        'password is changed please login again',
                        401,
                    );
                }
            }
            req.user = user; // for letting user to use protected routes
            req.user.googleId = userTempData.googleId;

            // if (user.passwordResetVerificationToken || user.activationToken) {
            //     await resettingUserCodeFields(user);
            // }

            next();
        } catch (err) {
            if ((err as Error).message === 'jwt expired') {
                // from access expiration
                const accessToken = createAccessToken(user?.id);
                const refreshToken = createRefreshToken(user?.email);
                const newRefreshTokens = userTempData.refreshTokens;
                const refreshTokenList: any[] = [];
                for (const rt of newRefreshTokens) {
                    if (rt !== req.cookies.refreshToken)
                        refreshTokenList.push(rt);
                }
                userTempData.refreshTokens = [
                    ...refreshTokenList,
                    refreshToken as string,
                ];
                await userTempData.save();

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
                req.user.googleId = userTempData.googleId;

                next();
            } else {
                if (accessMode === AccessMode.Optional) {
                    return next();
                }
                let customError = new AppError( //any error is caught except 'jwt expired' it will display the same message in order to prevent attacker from knowing any thing about the error
                    'you are not logged in please login to access this route',
                    401,
                );
                customError.stack = (err as Error).stack; //to know from where the error is occurred
                return next(customError);
            }
        }
    });
export const protect = protectRoutes(AccessMode.Required);
/**
 * @description this function used as middleware for endpoints which allow logged in users or not logged users to access this route.
 * @example when user get one job , this route is general accessable but when logged in user get that route we can display to it if he saved that job or not
 */
export const protectOptional = protectRoutes(AccessMode.Optional);

// /**
//  * @description this function used as middleware for endpoints which allow logged in users or not logged users to access this route.
//  * @example when user get one job , this route is general accessable but when logged in user get that route we can display to it if he saved that job or not
//  */
// export const optionalProtect = catchAsync(
//     async (req: Request, res: Response, next: NextFunction) => {
//         let user: any; // user from postgres
//         let userTempData: any; // user temp data from mongo like (refresh token ,password reset token, ...)
//         try {
//             if (req.cookies.accessToken || req.cookies.refreshToken) {
//                 [user, userTempData] = await checkingTokens(
//                     req,
//                     res,
//                     user,
//                     userTempData,
//                 );
//             }
//             next();
//         } catch (err) {
//             if (req.cookies) {
//                 clearCookies(res);
//             }
//             next();
//         }
//     },
// );
// const checkingTokens = async (
//     req: Request,
//     res: Response,
//     user: any,
//     userTempData: any,
// ) => {
//     const [refreshTokenDecodedEmail, foundedUser, foundUserTempData] =
//         await refreshTokenHandler(req, res);
//     userTempData = foundUserTempData;
//     let token: string;
//     if (
//         req.headers.authorization &&
//         req.headers.authorization.startsWith('Bearer')
//     ) {
//         token = req.headers.authorization.split(' ')[0];
//     } else {
//         token = req.cookies.accessToken;
//     }
//     if (!token) {
//         throw new AppError('there is no access token', 401);
//     }
//     user = foundedUser; // this line because when access token expired it will not got to the line after decoded
//     const decoded = (await verifyTokenAsync(token, 'access')) as JwtPayload;
//     user = await AccountRepository.findOneBy({ id: decoded!.userId });
//     if (!user) {
//         throw new AppError('user belong to that token does not exist', 401);
//     }
//     if (user.email !== refreshTokenDecodedEmail) {
//         throw new AppError(
//             'malicious, refresh token does not match with access token',
//             403,
//         );
//     }
//     if (user.password_changed_at) {
//         const passChangedAtTimeStamp = parseInt(
//             `${user.password_changed_at.getTime() / 1000}`,
//             10,
//         );

//         if (passChangedAtTimeStamp > decoded!.iat!) {
//             throw new AppError('password is changed please login again', 401);
//         }
//     }
//     req.user = user; // for letting user to use protected routes
//     req.user.googleId = userTempData.googleId;
//     return [user, userTempData];
// };

const refreshTokenHandler = async (req: Request, res: Response) => {
    try {
        let refreshToken: string;
        if (req.cookies.refreshToken) {
            refreshToken = req.cookies.refreshToken;
        } else {
            throw new AppError('there is no refresh token', 403);
        }
        const userTempData = await AccountTempData.findOne({
            refreshTokens: refreshToken,
        });

        // detect reuse of refreshToken
        if (!userTempData) {
            const decoded = await verifyTokenAsync(refreshToken, 'refresh');
            const hackedUser = await AccountRepository.findOneBy({
                email: (decoded as JwtPayload).email,
            });
            if (hackedUser) {
                const hackedUserTempData = await AccountTempData.findOne({
                    accountId: hackedUser.id,
                });

                //signout all users
                hackedUserTempData.refreshTokens = [];
                await hackedUserTempData.save();
            }
            clearCookies(res);
            throw new AppError(
                'detect reuse of refresh token, illegitimate user',
                403,
            );
        }

        const decoded = await verifyTokenAsync(refreshToken, 'refresh');
        const foundUser = await AccountRepository.findOneBy({
            email: (decoded as JwtPayload).email,
        });
        return [(decoded as JwtPayload).email, foundUser, userTempData];
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
    user: UserType,
    req: Request,
    res: Response,
) => {
    const userTempData = await AccountTempData.findOne({ accountId: user.id });
    const accessToken = createAccessToken(user.id);
    const refreshToken = createRefreshToken(user.email);
    //try to login and he already logged in
    const cookies = req.cookies;
    let newRefreshTokens = !cookies?.refreshToken
        ? userTempData.refreshTokens
        : userTempData.refreshTokens.filter(
              (rt) => rt !== cookies.refreshToken,
          );

    userTempData.refreshTokens = [...newRefreshTokens, refreshToken as string];
    await userTempData.save();
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
    return [
        accessToken,
        refreshToken,
        { ...user, googleId: userTempData.googleId },
    ];
};

export const signInGoogleRedirection = async (req: Request, res: Response) => {
    const user = await AccountRepository.findOneBy({ id: req.user.id });
    const [accessToken, refreshToken, updatedUser] =
        await createTokensForLoggedInUser(user!, req, res);

    return [accessToken, refreshToken, updatedUser];
};

// export const updateMyInfo = async (
//     req: Request<{}, {}, updateMeBody>,
//     userId: number,
// ) => {
//     const {
//         address,
//         phone,
//         education,
//         experience,
//         skills,
//         dateOfBirth,
//         languages,
//         profilePicture,
//         firstName,
//         lastName,
//         email,
//         resume,
//     } = req.body;

//     const user = await AccountRepository.findAllAccountData(userId);
//     if (!user) {
//         throw new AppError('user not found', 404);
//     }

//     const userJson = await updateAllAccountData(user, req);
//     return userJson;
// };

export const changeCurrentPassword = async (
    req: Request<{}, {}, changeMyPasswordBody>,
    res: Response,
) => {
    const { currentPassword, newPassword } = req.body;
    const refreshToken = req.cookies.refreshToken;
    const currentUser = await AccountRepository.findOneBy({ id: req.user?.id });
    if ((req.user! as UserType).password) {
        const userPass = (req.user! as UserType).password;
        const isCorrectCurrentPassword = isCorrectPassword(
            currentPassword,
            userPass,
        );
        if (!isCorrectCurrentPassword) {
            throw new AppError('password is incorrect', 400);
        }
        const hashedNewPassword = await hashingPassword(newPassword);

        currentUser!.password = hashedNewPassword;
        currentUser!.password_changed_at = new Date(Date.now());
    } else {
        const hashedNewPassword = await hashingPassword(newPassword);

        currentUser!.password = hashedNewPassword;
        currentUser!.password_changed_at = new Date(Date.now());
    }
    const userTempData = await AccountTempData.findOne({
        accountId: currentUser.id,
    });
    userTempData!.refreshTokens = userTempData!.refreshTokens.filter(
        (rt) => rt !== refreshToken,
    );
    await userTempData!.save();
    await AccountRepository.save(currentUser);
    clearCookies(res);
};

export const clearCookies = (res: Response) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
};

export const updateUserAfterSignUpFirstStep = async (
    user: Account,
    req: Request,
) => {
    const {
        address,
        phone,
        education,
        experience,
        skills,
        date_of_birth,
        languages,
        profile_picture,
        resumes,
    } = req.body;
    //const userTempData = await AccountTempData.findOne({ accountId: userId });
    // console.log(user);
    const userId = user.id;
    if (
        user.address.city ||
        user.address.country ||
        user.phone.country_code ||
        user.phone.number ||
        user.profile_picture ||
        user.date_of_birth
    ) {
        throw new AppError('you already complete your data', 400);
    }
    const foundedEducation = await EducationRepository.findOneBy({
        account: { id: userId },
    });
    if (foundedEducation) {
        throw new AppError('you already complete your data', 400);
    }
    const foundedResume = await ResumeRepository.findOne({
        where: { account: { id: userId } },
    });
    console.log(foundedResume);
    if (foundedResume) {
        throw new AppError('you already complete your data', 400);
    }
    const foundedExperience = await ExperienceRepository.findOne({
        where: { account: { id: userId } },
    });
    if (foundedExperience) {
        throw new AppError('you already complete your data', 400);
    }
    const foundedLanguages = await LanguageRepository.findOne({
        where: { account: { id: userId } },
    });
    if (foundedLanguages) {
        throw new AppError('you already complete your data', 400);
    }
    const foundedSkills = await SkillRepository.findOne({
        where: { account: { id: userId } },
    });
    if (foundedSkills) {
        throw new AppError('you already complete your data', 400);
    }

    user.address.city = address.city;
    user.address.country = address.country;
    user.phone.country_code = phone.countryCode;
    user.phone.number = phone.number;
    user.profile_picture = profile_picture;
    user.date_of_birth = date_of_birth;
    const userJson: { [key: string]: any } = { ...user };

    if (education) {
        const newEducations = await EducationRepository.createEductions(
            user.id,
            education,
        );
        userJson.educations = newEducations;
    }
    if (skills) {
        const newSkills = await SkillRepository.createSkills(user.id, skills);
        userJson.skills = newSkills;
    }
    if (experience) {
        const newExperiences = await ExperienceRepository.createExperiences(
            user.id,
            experience,
        );

        userJson.experiences = newExperiences;
    }

    if (languages) {
        const newLanguages = await LanguageRepository.createLanguages(
            user.id,
            languages,
        );
        userJson.languages = newLanguages;
    }
    if (resumes) {
        const newResumes = await ResumeRepository.createResumes(
            user.id,
            resumes,
        );
        userJson.resumes = newResumes;
    }
    await AccountRepository.save(user);
    return userJson;
};

// export const updateUserAfterSignUpFirstStep = async (
//     user: Account,
//     req: Request,
// ) => {
//     const {
//         address,
//         phone,
//         education,
//         experience,
//         skills,
//         date_of_birth,
//         languages,
//         profile_picture,
//         resumes,
//     } = req.body;
//     const userId = Number(req.user.id);
//     //const userTempData = await AccountTempData.findOne({ accountId: userId });
//     console.log(user);
//     if (
//         user.address.city ||
//         user.address.country ||
//         user.phone.country_code ||
//         user.phone.number ||
//         user.profile_picture ||
//         user.date_of_birth
//     ) {
//         throw new AppError('you already complete your data', 400);
//     }
//     const foundedEducation = await EducationRepository.findOneBy({
//         account: { id: userId },
//     });
//     if (foundedEducation) {
//         throw new AppError('you already complete your data', 400);
//     }
//     const foundedResume = await ResumeRepository.findOne({
//         where: { account: { id: userId } },
//     });
//     console.log(foundedResume);
//     if (foundedResume) {
//         throw new AppError('you already complete your data', 400);
//     }
//     const foundedExperience = await ExperienceRepository.findOne({
//         where: { account: { id: userId } },
//     });
//     if (foundedExperience) {
//         throw new AppError('you already complete your data', 400);
//     }
//     const foundedLanguages = await LanguageRepository.findOne({
//         where: { account: { id: userId } },
//     });
//     if (foundedLanguages) {
//         throw new AppError('you already complete your data', 400);
//     }
//     const foundedSkills = await SkillRepository.findOne({
//         where: { account: { id: userId } },
//     });
//     if (foundedSkills) {
//         throw new AppError('you already complete your data', 400);
//     }

//     user.address.city = address.city;
//     user.address.country = address.country;
//     user.phone.country_code = phone.countryCode;
//     user.phone.number = phone.number;
//     user.profile_picture = profile_picture;
//     user.date_of_birth = date_of_birth;
//     const userJson: { [key: string]: any } = { ...user };

//     if (education) {
//         const education_ = new Education();
//         education_.account = user; // Associate with the user's ID
//         education_.university = education.university;
//         education_.field_of_study = education.fieldOfStudy;
//         education_.gpa = education.gpa;
//         education_.start_date = education.startDate;
//         education_.end_date = education.endDate;
//         // Save the education to the database
//         const savedEducation = await EducationRepository.save(education_);

//         userJson.education = education_;
//     }
//     if (skills) {
//         const newSkills = skills.map((skillData) => {
//             const skill = new Skill();
//             skill.name = skillData;
//             skill.account = user; // Link the skill to the account
//             return skill;
//         });

//         const savedSkills = await SkillRepository.save(newSkills);
//         savedSkills.map((skill) => {
//             delete skill.account;
//         });
//         userJson.skills = savedSkills;
//     }
//     if (experience) {
//         const newExperience = experience.map((experience) => {
//             const experience_ = new Experience();
//             //experience_.account = user;
//             experience_.job_title = experience.jobTitle;
//             experience_.employment_type = experience.employmentType;
//             experience_.company_name = experience.companyName;
//             experience_.location = experience.location;
//             experience_.location_type = experience.locationType;
//             experience_.still_working = experience.stillWorking;
//             experience_.start_date = experience.startDate;
//             experience_.end_date = experience.endDate;
//             experience_.account = user; // Link the experience_ to the account
//             return experience_;
//         });

//         // Save the experience
//         const savedExperience = await ExperienceRepository.save(newExperience);
//         savedExperience.map((resumeData) => {
//             delete resumeData.account;
//         });
//         userJson.experience = savedExperience;
//     }

//     if (languages) {
//         const newLanguage = languages.map((lang) => {
//             const language_ = new Language();
//             language_.account = user;
//             language_.name = lang;

//             language_.account = user; // Link the language_ to the account
//             return language_;
//         });

//         // Save the Language
//         const savedLanguage = await LanguageRepository.save(newLanguage);
//         savedLanguage.map((resumeData) => {
//             delete resumeData.account;
//         });
//         userJson.languages = savedLanguage;
//     }
//     if (resumes) {
//         const arrayResumes: any = [];
//         const newResumes = resumes.map((resumeData) => {
//             const resume_ = new Resume();
//             resume_.url = resumeData;
//             resume_.account = user;
//             arrayResumes.push(resume_);
//             return resume_;
//         });
//         // Save the resume
//         const savedResumes = await ResumeRepository.save(newResumes);
//         arrayResumes.map((resumeData) => {
//             delete resumeData.account;
//         });
//         userJson.resumes = arrayResumes;
//     }
//     await AccountRepository.save(user);
//     return userJson;
// };

// export const updateAllAccountData = async (user: Account, req: Request) => {
//     const {
//         address,
//         phone,
//         education,
//         experience,
//         skills,
//         dateOfBirth,
//         languages,
//         profilePicture,
//         resume,
//     } = req.body;
//     const userId = req.user.id;
//     const address_ = address ? address : user.address;
//     user.address = address_;
//     const phone_ = phone ? phone : user.phone;
//     user.phone.country_code = phone_.countryCode;
//     user.phone.number = Number(phone_.number);
//     const resume_ = resume ? resume : user.resume;
//     user.resume = resume_;
//     const profilePicture_ = profilePicture
//         ? profilePicture
//         : user.profile_picture;
//     user.profile_picture = profilePicture_;
//     const dateOfBirth_ = dateOfBirth ? dateOfBirth : user.date_of_birth;
//     user.date_of_birth = dateOfBirth_;
//     const userJson: { [key: string]: any } = { ...user };
//     delete userJson.first_name;
//     delete userJson.last_name;
//     delete userJson.date_of_birth;

//     userJson.firstName = user.first_name;
//     userJson.lastName = user.last_name;
//     userJson.dateOfBirth = user.date_of_birth;
//     userJson.phone = returningPhone(user.phone);
//     if (education) {
//         const foundedEducation = await EducationRepository.findOneBy({
//             account_id: user.id,
//         });
//         if (!foundedEducation) {
//             const education_ = new Education();
//             education_.account_id = userId; // Associate with the user's ID
//             education_.university = education.university;
//             education_.field_of_study = education.fieldOfStudy;
//             education_.gpa = education.gpa;
//             education_.start_date = education.startDate;
//             education_.end_date = education.endDate;
//             // Save the education to the database
//             const savedEducation = await EducationRepository.save(education_);
//             const returnedEducation = returningEducation(savedEducation);

//             userJson.education = returnedEducation;
//         } else {
//             const eduObj: { [key: string]: any } = {};
//             eduObj.university = education.university;
//             eduObj.field_of_study = education.fieldOfStudy;
//             eduObj.gpa = education.gpa;
//             eduObj.start_date = education.startDate;
//             eduObj.end_date = education.endDate;
//             // Save the education to the database
//             const savedEducation = await EducationRepository.updateEducation(
//                 eduObj,
//                 userId,
//             );
//             const returnedEducation = returningEducation(savedEducation);

//             userJson.education = returnedEducation;
//         }
//     } else {
//         const foundedEducation = await EducationRepository.findOneBy({
//             account_id: user.id,
//         });

//         // Save the education to the database
//         const returnedEducation = returningEducation(foundedEducation);

//         userJson.education = returnedEducation;
//     }

//     if (skills) {
//         // Create and link new skills
//         await SkillRepository.deleteAllSkills(user.id);

//         const arraySkills: any = [];
//         const newSkills = skills.map((skillData) => {
//             const skill = new Skill();
//             skill.name = skillData;
//             arraySkills.push(skill.name);
//             skill.account = user; // Link the skill to the account
//             return skill;
//         });

//         // Save the skills
//         const savedSkills = await SkillRepository.save(newSkills);
//         userJson.skills = arraySkills;
//     } else {
//         userJson.skills = [];
//         user.skills.map((skill) => {
//             userJson.skills.push(skill.name);
//         });
//     }
//     if (experience) {
//         const arrayExperience: any = [];
//         await ExperienceRepository.deleteAllExperience(user.id);

//         const newExperience = experience.map((experience) => {
//             const experience_ = new Experience();
//             //experience_.account = user;
//             experience_.job_title = experience.jobTitle;
//             experience_.employment_type = experience.employmentType;
//             experience_.company_name = experience.companyName;
//             experience_.location = experience.location;
//             experience_.location_type = experience.locationType;
//             experience_.still_working = experience.stillWorking;
//             experience_.start_date = experience.startDate;
//             experience_.end_date = experience.endDate;
//             arrayExperience.push(returningExperiences(experience_));
//             experience_.account = user; // Link the experience_ to the account
//             return experience_;
//         });

//         // Save the experience
//         const savedExperience = await ExperienceRepository.save(newExperience);
//         userJson.experience = arrayExperience;
//     } else {
//         userJson.experiences = [];
//         user.experiences.map((exp) => {
//             userJson.experiences.push(returningExperiences(exp));
//         });
//     }

//     if (languages) {
//         const arrayLanguage: any = [];
//         await LanguageRepository.deleteAllLanguages(user.id);

//         const newLanguage = languages.map((lang) => {
//             const language_ = new Language();
//             language_.account = user;
//             language_.name = lang;

//             arrayLanguage.push(returningLanguage(language_));
//             language_.account = user; // Link the language_ to the account
//             return language_;
//         });

//         // Save the Language
//         const savedLanguage = await LanguageRepository.save(newLanguage);
//         userJson.languages = arrayLanguage;
//     } else {
//         userJson.languages = [];
//         user.languages.map((language) => {
//             userJson.languages.push(language.name);
//         });
//     }
//     delete userJson.first_name;
//     delete userJson.last_name;
//     delete userJson.date_of_birth;

//     userJson.firstName = user.first_name;
//     userJson.lastName = user.last_name;
//     userJson.dateOfBirth = user.date_of_birth;
//     userJson.phone = returningPhone(user.phone);
//     await AccountRepository.save(user);
//     return userJson;
// };

// export const returnUserInFormOfMongoDBObject = async (user: Account) => {
//     const userJson: { [key: string]: any } = { ...user };
//     delete userJson.first_name;
//     delete userJson.last_name;
//     delete userJson.date_of_birth;
//     userJson.firstName = user.first_name;
//     userJson.lastName = user.last_name;
//     userJson.dateOfBirth = user.date_of_birth;
//     userJson.phone = returningPhone(user.phone);

//     const education = await EducationRepository.findOneBy({
//         account_id: user.id,
//     });
//     if (education) userJson.education = returningEducation(education);
//     const skills = await SkillRepository.find({
//         where: { account: { id: user.id } },
//         relations: ['account'],
//     });
//     if (skills) userJson.skills = skills.map((skill) => skill.name);
//     const experiences = await ExperienceRepository.find({
//         where: { account: { id: user.id } },
//         relations: ['account'],
//     });
//     if (experiences)
//         userJson.experiences = experiences.map((experience) =>
//             returningExperiences(experience),
//         );
//     const languages = await LanguageRepository.find({
//         where: { account: { id: user.id } },
//         relations: ['account'],
//     });
//     if (languages)
//         userJson.languages = languages.map((language) => language.name);
//     return userJson;
// };

export const getMeService = async (req: Request) => {
    const userId = Number(req.user.id);
    const account = await AccountRepository.findAllAccountData(req.user.id);
    return account;
};

// export const updateUserOneExperience = catchAsync(
//     async (req: Request, res: Response, next: NextFunction) => {
//         const userId = req.user.id;
//         const experienceId = req.params.id;
//         const {
//             jobTitle,
//             employmentType,
//             companyName,
//             location,
//             locationType,
//             stillWorking,
//             startDate,
//             endDate,
//         } = req.body;
//         const experience = await ExperienceRepository.update(
//             { account: { id: userId } },
//             {
//                 job_title: jobTitle,
//                 employment_type: employmentType,
//                 company_name: companyName,
//                 location: location,
//                 location_type: locationType,
//                 still_working: stillWorking,
//                 start_date: startDate,
//                 end_date: endDate,
//             },
//         );
//         res.status(200).json({ experience });
//     },
// );
