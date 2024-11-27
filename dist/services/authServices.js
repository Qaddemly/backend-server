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
exports.updateMyInfo = exports.createAccessTokenForGoogleAuth = exports.protect = exports.logInService = exports.createNewPassword = exports.PasswordResetCodeVerification = exports.createAnotherResetPasswordCodeAndResend = exports.generateForgetPasswordCodeAndEmail = exports.createAnotherCodeAndResend = exports.verifyActivationCode = exports.resizeUserImage = exports.uploadUserImage = exports.updateUserForSignUpStepTwo = exports.createUserForSignUp = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const appError_1 = __importDefault(require("../utils/appError"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const email_1 = require("../utils/email");
const codeUtils_1 = require("../utils/codeUtils");
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
const uploadImage_middleWare_1 = require("../middlewares/uploadImage.middleWare");
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
const updateUserForSignUpStepTwo = (userId, reqBody) => __awaiter(void 0, void 0, void 0, function* () {
    const { address, phone, education, experience, skills, dateOfBirth, languages, profilePicture, } = reqBody;
    const user = yield userModel_1.default.findByIdAndUpdate(userId, {
        address: address,
        phone: phone,
        education: education,
        experience: experience,
        skills: skills,
        dateOfBirth: dateOfBirth,
        languages: languages,
        profilePicture,
    }, { new: true });
    if (!user) {
        throw new appError_1.default('user not found', 404);
    }
    return user;
});
exports.updateUserForSignUpStepTwo = updateUserForSignUpStepTwo;
exports.uploadUserImage = (0, uploadImage_middleWare_1.uploadSingleImage)('profilePicture');
exports.resizeUserImage = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if ((_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer) {
        // console.log("req.files", req.files.imageCover[0]);
        const userImageName = `user-${Math.round(Math.random() * 1e9)}-${Date.now()}.jpeg`;
        const imageDbUrl = `${process.env.BASE_URL}/uploads/users/${userImageName}`;
        yield (0, sharp_1.default)(req.file.buffer)
            .resize(800, 600)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`src/uploads/users/${userImageName}`);
        req.body.profilePicture = imageDbUrl;
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
const logInService = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log(typeof req.query.limit, typeof req.query.page);
    //1- find user by email
    const user = yield userModel_1.default.findOne({ email });
    if (!user) {
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
        return [false, activationToken, null];
    }
    else {
        //3- create access token
        const accessToken = (0, jwt_1.createAccessToken)(user.id);
        return [true, accessToken, user];
    }
});
exports.logInService = logInService;
exports.protect = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[0];
    }
    else {
        token = req.cookies.accessToken;
    }
    if (!token) {
        return next(new appError_1.default('you are not logged in please login to access this route', 401));
    }
    let decoded;
    decoded = (0, jwt_1.verifyToken)(token);
    const user = yield userModel_1.default.findById(decoded.userId);
    if (!user) {
        return next(new appError_1.default('user belong to that token does not exist', 401));
    }
    if (user.passwordChangedAt) {
        const passChangedAtTimeStamp = parseInt(`${user.passwordChangedAt.getTime() / 1000}`, 10);
        if (passChangedAtTimeStamp > decoded.iat) {
            return next(new appError_1.default('password is changed please login again', 401));
        }
    }
    req.user = user; // for letting user to use protected routes
    next();
}));
const createAccessTokenForGoogleAuth = (userId) => {
    const accessToken = (0, jwt_1.createAccessToken)(userId);
    return accessToken;
};
exports.createAccessTokenForGoogleAuth = createAccessTokenForGoogleAuth;
const updateMyInfo = (reqBody, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { address, phone, education, experience, skills, dateOfBirth, languages, profilePicture, firstName, lastName, email, } = reqBody;
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
    }, {
        new: true,
    });
    if (!user) {
        throw new appError_1.default('user not found', 404);
    }
    return user;
});
exports.updateMyInfo = updateMyInfo;
