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
exports.getMe = exports.updateMe = exports.googleRedirection = exports.googleAuth = exports.logOut = exports.logIn = exports.resetPassword = exports.verifyPasswordResetCode = exports.resendPasswordResetCodeAgain = exports.forgetPassword = exports.resendActivationCode = exports.activateEmail = exports.SignUpStepTwo = exports.signUp = void 0;
const passport_1 = __importDefault(require("passport"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const authServices_1 = require("../services/authServices");
const codeUtils_1 = require("../utils/codeUtils");
exports.signUp = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = req.body;
        //1-create a new user
        const newUser = yield (0, authServices_1.createUserForSignUp)(userData);
        //2-sending email containing activation code for user mail
        const activationToken = yield (0, codeUtils_1.generateAndEmailCode)(newUser);
        res.status(201).json({
            success: true,
            message: 'User created successfully. Check your email for activation.',
            activationToken,
        });
    }
    catch (err) {
        return next(err);
    }
}));
exports.SignUpStepTwo = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield (0, authServices_1.updateUserForSignUpStepTwo)((_a = req.user) === null || _a === void 0 ? void 0 : _a.id, req.body);
        res.status(201).json({
            success: true,
            message: 'congrats you have complete your registration successfully',
            user,
        });
    }
    catch (err) {
        return next(err);
    }
}));
exports.activateEmail = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, authServices_1.verifyActivationCode)(req.body.code, req.params.activationToken);
        res.status(200).json({
            success: true,
            message: 'email has been activated successfully, please login',
        });
    }
    catch (err) {
        return next(err);
    }
}));
exports.resendActivationCode = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, authServices_1.createAnotherCodeAndResend)(req.params.activationToken);
        res.status(200).json({
            success: true,
            message: 'code sent, please check your mail box',
        });
    }
    catch (err) {
        return next(err);
    }
}));
exports.forgetPassword = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resetVerificationToken = yield (0, authServices_1.generateForgetPasswordCodeAndEmail)(req.body.email);
        res.status(200).json({
            success: true,
            resetVerificationToken,
        });
    }
    catch (err) {
        return next(err);
    }
}));
const resendPasswordResetCodeAgain = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, authServices_1.createAnotherResetPasswordCodeAndResend)(req.params.resetActivationToken);
        res.status(200).json({
            success: true,
            message: 'reset code sent, please check your mail box',
        });
    }
    catch (err) {
        return next(err);
    }
});
exports.resendPasswordResetCodeAgain = resendPasswordResetCodeAgain;
exports.verifyPasswordResetCode = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const passwordResetToken = yield (0, authServices_1.PasswordResetCodeVerification)(req.body.code, req.params.resetActivationToken);
        res.status(200).json({
            success: true,
            message: 'code verified',
            passwordResetToken: passwordResetToken,
        });
    }
    catch (err) {
        return next(err);
    }
}));
exports.resetPassword = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, authServices_1.createNewPassword)(req.params.passwordResetToken, req.body.newPassword);
        res.status(200).json({
            success: true,
            message: 'password reset successfully,please login',
        });
    }
    catch (err) {
        return next(err);
    }
}));
exports.logIn = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [isActivated, token, user] = yield (0, authServices_1.logInService)(req.body.email, req.body.password);
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
        }
        else {
            res.status(200).json({
                success: true,
                message: 'activation code sent, please check your mail box',
                activationToken: token,
            });
        }
    }
    catch (err) {
        return next(err);
    }
}));
exports.logOut = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie('accessToken');
    res.status(200).json({
        success: true,
        message: 'logged out successfully',
    });
}));
exports.googleAuth = passport_1.default.authenticate('google', {
    scope: ['profile', 'email'],
});
//exchange code with profile info
exports.googleRedirection = [
    passport_1.default.authenticate('google'),
    (req, res) => {
        var _a;
        const accessToken = (0, authServices_1.createAccessTokenForGoogleAuth)((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
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
exports.updateMe = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield (0, authServices_1.updateMyInfo)(req.body, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        res.status(200).json({
            success: true,
            user,
        });
    }
    catch (err) {
        return next(err);
    }
}));
exports.getMe = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json({
            success: true,
            user: req.user,
        });
    }
    catch (err) {
        return next(err);
    }
}));
