"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeCurrentPassword = exports.updateMyInfo = exports.createAccessTokenForGoogleAuth = exports.protect = exports.logInService = exports.createNewPassword = exports.PasswordResetCodeVerification = exports.createAnotherResetPasswordCodeAndResend = exports.generateForgetPasswordCodeAndEmail = exports.createAnotherCodeAndResend = exports.verifyActivationCode = exports.savingResumeInDisk = exports.resizeUserImage = exports.uploadUserPICAndResume = exports.updateUserForSignUpStepTwo = exports.createUserForSignUp = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const fs_1 = __importDefault(require("fs"));
const appError_1 = __importDefault(require("../utils/appError"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const email_1 = require("../utils/email");
const codeUtils_1 = require("../utils/codeUtils");
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
const upload_middleWare_1 = require("../middlewares/upload.middleWare");
const sharp_1 = __importDefault(require("sharp"));
const createUserForSignUp = (reqBody) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password } = reqBody;
    // hashing password before saving it in data base
    const hashedPassword = yield (0, password_1.hashingPassword)(password);
    //1- create user
    const newUser = yield userModel_1.default.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
    });
    return newUser;
});
exports.createUserForSignUp = createUserForSignUp;
const updateUserForSignUpStepTwo = (userId, req) => __awaiter(void 0, void 0, void 0, function* () {
    const { address, phone, education, experience, skills, dateOfBirth, languages, profilePicture, resume, } = req.body;
    const user = yield userModel_1.default.findByIdAndUpdate(userId, {
        address: address,
        phone: phone,
        education: education,
        experience: experience,
        skills: skills,
        dateOfBirth: dateOfBirth,
        languages: languages,
        profilePicture,
        resume: resume,
    }, { new: true });
    if (!user) {
        throw new appError_1.default('user not found', 404);
    }
    return user;
});
exports.updateUserForSignUpStepTwo = updateUserForSignUpStepTwo;
exports.uploadUserPICAndResume = (0, upload_middleWare_1.uploadProfilePicAndResume)([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'resume', maxCount: 1 },
]);
//export const uploadUserImage = uploadSingleImage('profilePicture');
exports.resizeUserImage = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log((req.files! as expressFiles).resume);
    if (req.files.profilePicture) {
        // console.log("req.files", req.files.imageCover[0]);
        const userImageName = `user-${Math.round(Math.random() * 1e9)}-${Date.now()}.jpeg`;
        const imageDbUrl = `${process.env.BASE_URL}/uploads/users/${userImageName}`;
        yield (0, sharp_1.default)(req.files.profilePicture[0].buffer)
            .resize(800, 600)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`src/uploads/users/${userImageName}`);
        req.body.profilePicture = imageDbUrl;
    }
    next();
}));
//export const uploadUserResume = uploadSingleResume('resume');
exports.savingResumeInDisk = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.files.resume) {
        const originalFileName = req.files.resume[0]
            .originalname;
        const resumeExtension = originalFileName.substring(originalFileName.lastIndexOf('.') + 1);
        const resumeName = `resume-${Math.round(Math.random() * 1e9)}-${Date.now()}.${resumeExtension}`;
        const resumeDbUrl = `${process.env.BASE_URL}/uploads/resumes/${resumeName}`;
        // Save the PDF to disk
        const filePath = `src/uploads/resumes/${resumeName}`;
        fs_1.default.writeFile(filePath, req.files.resume[0].buffer, (err) => {
            if (err) {
                return next(new appError_1.default('Error saving file to disk.'));
            }
        });
        req.body.resume = resumeDbUrl;
    }
    next();
}));
const verifyActivationCode = (code, activationToken) => __awaiter(void 0, void 0, void 0, function* () {
    const hashActivationCode = (0, codeUtils_1.cryptoEncryption)(code);
    const user = yield userModel_1.default.findOne({
        activationToken: activationToken,
    });
    if (!user) {
        throw new appError_1.default('user not found or token expired', 404);
    }
    if (user.activationCode != hashActivationCode ||
        user.activationCodeExpiresIn.getTime() < Date.now()) {
        throw new appError_1.default('code is incorrect or expired', 400);
    }
    user.isActivated = true;
    yield (0, codeUtils_1.resettingUserCodeFields)(user);
});
exports.verifyActivationCode = verifyActivationCode;
const createAnotherCodeAndResend = (activationToken) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findOne({ activationToken: activationToken });
    if (!user) {
        throw new appError_1.default('user belong to that token does not exist', 400);
    }
    const code = yield (0, codeUtils_1.generateAnotherActivationCode)(user);
    const subject = 'email activation';
    const message = `your activation code is ${code}`;
    yield (0, email_1.sendingCodeToEmail)(user, subject, message);
});
exports.createAnotherCodeAndResend = createAnotherCodeAndResend;
const generateForgetPasswordCodeAndEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findOne({ email: email });
    if (!user) {
        throw new appError_1.default('no user found with this email', 404);
    }
    const resetVerificationToken = yield (0, codeUtils_1.generateAndEmailPassResetCode)(user);
    return resetVerificationToken;
});
exports.generateForgetPasswordCodeAndEmail = generateForgetPasswordCodeAndEmail;
const createAnotherResetPasswordCodeAndResend = (resetActivationToken) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findOne({
        passwordResetVerificationToken: resetActivationToken,
    });
    if (!user) {
        throw new appError_1.default('user belong to that token does not exist', 400);
    }
    const code = yield (0, codeUtils_1.generateAnotherPassResetCode)(user);
    const subject = 'password reset code';
    const message = `your password reset code is valid for (10 min) \n
      ${code}\n`;
    yield (0, email_1.sendingCodeToEmail)(user, subject, message);
});
exports.createAnotherResetPasswordCodeAndResend = createAnotherResetPasswordCodeAndResend;
const PasswordResetCodeVerification = (code, resetActivationToken) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findOne({
        passwordResetVerificationToken: resetActivationToken,
    });
    if (!user) {
        throw new appError_1.default('no user founded with reset token', 404);
    }
    const hashedCode = (0, codeUtils_1.cryptoEncryption)(code);
    if (user.passwordResetCode != hashedCode ||
        user.passwordResetCodeExpires.getTime() < Date.now()) {
        throw new appError_1.default('invalid or expired code', 400);
    }
    const passwordResetToken = yield (0, codeUtils_1.resetCodeVerified)(user);
    return passwordResetToken;
});
exports.PasswordResetCodeVerification = PasswordResetCodeVerification;
const createNewPassword = (passwordResetToken, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findOne({
        passwordResetToken,
    });
    if (!user) {
        throw new appError_1.default('no user founded with that token', 404);
    }
    const hashedPassword = yield (0, password_1.hashingPassword)(newPassword);
    user.password = hashedPassword;
    user.passwordChangedAt = new Date(Date.now());
    yield (0, codeUtils_1.resettingUserCodeFields)(user);
});
exports.createNewPassword = createNewPassword;
const logInService = (req, res, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log(typeof req.query.limit, typeof req.query.page);
    //1- find user by email
    const user = yield userModel_1.default.findOne({ email });
    if (!user) {
        throw new appError_1.default('email or password is incorrect', 400);
    }
    if (!user.password) {
        throw new appError_1.default('email or password is incorrect', 400);
    }
    //2- checking password correction
    const isPassCorrect = yield (0, password_1.isCorrectPassword)(password, user.password);
    if (!isPassCorrect) {
        throw new appError_1.default('email or password is incorrect', 400);
    }
    // checking is email active
    if (!user.isActivated) {
        const activationToken = yield (0, codeUtils_1.generateAndEmailCode)(user);
        return [false, activationToken, null, null];
    }
    else {
        //login success
        const accessToken = (0, jwt_1.createAccessToken)(user.id);
        const refreshToken = (0, jwt_1.createRefreshToken)(user.email);
        //try to login and he already logged in
        const cookies = req.cookies;
        let newRefreshTokens = !(cookies === null || cookies === void 0 ? void 0 : cookies.refreshToken)
            ? user.refreshTokens
            : user.refreshTokens.filter((rt) => rt !== cookies.refreshToken);
        user.refreshTokens = [...newRefreshTokens, refreshToken];
        yield user.save();
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
        return [true, accessToken, refreshToken, user];
    }
});
exports.logInService = logInService;
exports.protect = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user;
    try {
        const [refreshTokenDecodedEmail, foundedUser] = yield refreshTokenHandler(req);
        let token;
        if (req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[0];
        }
        else {
            token = req.cookies.accessToken;
        }
        if (!token) {
            throw new appError_1.default('you are not logged in please login to access this route', 401);
        }
        user = foundedUser;
        const decoded = (yield (0, jwt_1.verifyTokenAsync)(token, 'access'));
        user = yield userModel_1.default.findById(decoded.userId);
        if (!user) {
            throw new appError_1.default('user belong to that token does not exist', 401);
        }
        if (user.email !== refreshTokenDecodedEmail) {
            throw new appError_1.default('malicious,not authorized to access this route', 403);
        }
        if (user.passwordChangedAt) {
            const passChangedAtTimeStamp = parseInt(`${user.passwordChangedAt.getTime() / 1000}`, 10);
            if (passChangedAtTimeStamp > decoded.iat) {
                throw new appError_1.default('password is changed please login again', 401);
            }
        }
        if (user.passwordResetVerificationToken || user.activationToken) {
            yield (0, codeUtils_1.resettingUserCodeFields)(user);
        }
        req.user = user; // for letting user to use protected routes
        next();
    }
    catch (err) {
        if (err.message === 'jwt expired') {
            // from access expiration
            const accessToken = (0, jwt_1.createAccessToken)(user === null || user === void 0 ? void 0 : user.id);
            const refreshToken = (0, jwt_1.createRefreshToken)(user === null || user === void 0 ? void 0 : user.email);
            const newRefreshTokens = user.refreshTokens;
            const refreshTokenList = [];
            for (const rt of newRefreshTokens) {
                if (rt !== req.cookies.refreshToken)
                    refreshTokenList.push(rt);
            }
            user.refreshTokens = [
                ...refreshTokenList,
                refreshToken,
            ];
            yield user.save();
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
        }
        else {
            let customError = new appError_1.default(//any error is caught except 'jwt expired' it will display the same message in order to prevent attacker from knowing any thing about the error
            'you are not logged in please login to access this route', 401);
            customError.stack = err.stack; //to know from where the error is occurred
            return next(customError);
        }
    }
}));
const refreshTokenHandler = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let refreshToken;
        if (req.cookies.refreshToken) {
            refreshToken = req.cookies.refreshToken;
        }
        else {
            throw new appError_1.default('not authorized to access this route', 403);
        }
        const foundUser = yield userModel_1.default.findOne({ refreshTokens: refreshToken });
        // detect reuse of refreshToken
        if (!foundUser) {
            const decoded = yield (0, jwt_1.verifyTokenAsync)(refreshToken, 'refresh');
            const hackedUser = yield userModel_1.default.findOne({
                email: decoded.email,
            });
            if (hackedUser) {
                //signout all users
                hackedUser.refreshTokens = [];
                yield hackedUser.save();
            }
            throw new appError_1.default('not authorized to access this route,login again', 403);
        }
        const decoded = yield (0, jwt_1.verifyTokenAsync)(refreshToken, 'refresh');
        return [decoded.email, foundUser];
    }
    catch (err) {
        if (err.message === 'jwt expired') {
            throw new appError_1.default('Expired refresh token', 403);
        }
        else if (err.message === 'invalid signature') {
            throw new appError_1.default('Invalid refresh token', 403);
        }
        else
            throw err;
    }
});
const createAccessTokenForGoogleAuth = (userId) => {
    const accessToken = (0, jwt_1.createAccessToken)(userId);
    return accessToken;
};
exports.createAccessTokenForGoogleAuth = createAccessTokenForGoogleAuth;
const updateMyInfo = (req, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { address, phone, education, experience, skills, dateOfBirth, languages, profilePicture, firstName, lastName, email, resume, } = req.body;
    const user = yield userModel_1.default.findOneAndUpdate({ _id: userId }, {
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
    }, {
        new: true,
    });
    if (!user) {
        throw new appError_1.default('user not found', 404);
    }
    req.user = user;
    return user;
});
exports.updateMyInfo = updateMyInfo;
const changeCurrentPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { currentPassword, newPassword } = req.body;
    const refreshToken = req.cookies.refreshToken;
    const currentUser = yield userModel_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
    if (req.user.password) {
        const userPass = req.user.password;
        const isCorrectCurrentPassword = (0, password_1.isCorrectPassword)(currentPassword, userPass);
        if (!isCorrectCurrentPassword) {
            throw new appError_1.default('password is incorrect', 400);
        }
        const hashedNewPassword = yield (0, password_1.hashingPassword)(newPassword);
        // const currentUser = await User.findByIdAndUpdate(req.user?.id, {
        //     password: hashedNewPassword,
        //     passwordChangedAt: new Date(Date.now()),
        // });
        currentUser.password = hashedNewPassword;
        currentUser.passwordChangedAt = new Date(Date.now());
    }
    else {
        const hashedNewPassword = yield (0, password_1.hashingPassword)(newPassword);
        // const currentUser = await User.findByIdAndUpdate(req.user?.id, {
        //     password: hashedNewPassword,
        //     passwordChangedAt: new Date(Date.now()),
        // });
        currentUser.password = hashedNewPassword;
        currentUser.passwordChangedAt = new Date(Date.now());
    }
    currentUser.refreshTokens = currentUser.refreshTokens.filter((rt) => rt !== refreshToken);
    yield currentUser.save();
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
});
exports.changeCurrentPassword = changeCurrentPassword;
