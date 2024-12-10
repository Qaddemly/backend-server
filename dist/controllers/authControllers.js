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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeMyPassword = exports.getMe = exports.updateMe = exports.googleRedirection = exports.googleAuth = exports.logOut = exports.logIn = exports.resetPassword = exports.verifyPasswordResetCode = exports.resendPasswordResetCodeAgain = exports.forgetPassword = exports.resendActivationCode = exports.activateEmail = exports.SignUpStepTwo = exports.signUp = void 0;
var passport_1 = __importDefault(require("passport"));
var express_async_handler_1 = __importDefault(require("express-async-handler"));
var authServices_1 = require("../services/authServices");
var codeUtils_1 = require("../utils/codeUtils");
var userModel_1 = __importDefault(require("../models/userModel"));
exports.signUp = (0, express_async_handler_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userData, newUser, activationToken, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                userData = req.body;
                return [4 /*yield*/, (0, authServices_1.createUserForSignUp)(userData)];
            case 1:
                newUser = _a.sent();
                return [4 /*yield*/, (0, codeUtils_1.generateAndEmailCode)(newUser)];
            case 2:
                activationToken = _a.sent();
                res.status(201).json({
                    success: true,
                    message: 'User created successfully. Check your email for activation.',
                    activationToken: activationToken,
                });
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                return [2 /*return*/, next(err_1)];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.SignUpStepTwo = (0, express_async_handler_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, err_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, authServices_1.updateUserForSignUpStepTwo)((_a = req.user) === null || _a === void 0 ? void 0 : _a.id, req)];
            case 1:
                user = _b.sent();
                res.status(201).json({
                    success: true,
                    message: 'congrats you have complete your registration successfully',
                    user: user,
                });
                return [3 /*break*/, 3];
            case 2:
                err_2 = _b.sent();
                return [2 /*return*/, next(err_2)];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.activateEmail = (0, express_async_handler_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, authServices_1.verifyActivationCode)(req.body.code, req.params.activationToken)];
            case 1:
                _a.sent();
                res.status(200).json({
                    success: true,
                    message: 'email has been activated successfully, please login',
                });
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                return [2 /*return*/, next(err_3)];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.resendActivationCode = (0, express_async_handler_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, authServices_1.createAnotherCodeAndResend)(req.params.activationToken)];
            case 1:
                _a.sent();
                res.status(200).json({
                    success: true,
                    message: 'code sent, please check your mail box',
                });
                return [3 /*break*/, 3];
            case 2:
                err_4 = _a.sent();
                return [2 /*return*/, next(err_4)];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.forgetPassword = (0, express_async_handler_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var resetVerificationToken, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, authServices_1.generateForgetPasswordCodeAndEmail)(req.body.email)];
            case 1:
                resetVerificationToken = _a.sent();
                res.status(200).json({
                    success: true,
                    resetVerificationToken: resetVerificationToken,
                });
                return [3 /*break*/, 3];
            case 2:
                err_5 = _a.sent();
                return [2 /*return*/, next(err_5)];
            case 3: return [2 /*return*/];
        }
    });
}); });
var resendPasswordResetCodeAgain = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, authServices_1.createAnotherResetPasswordCodeAndResend)(req.params.resetActivationToken)];
            case 1:
                _a.sent();
                res.status(200).json({
                    success: true,
                    message: 'reset code sent, please check your mail box',
                });
                return [3 /*break*/, 3];
            case 2:
                err_6 = _a.sent();
                return [2 /*return*/, next(err_6)];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.resendPasswordResetCodeAgain = resendPasswordResetCodeAgain;
exports.verifyPasswordResetCode = (0, express_async_handler_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var passwordResetToken, err_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, authServices_1.PasswordResetCodeVerification)(req.body.code, req.params.resetActivationToken)];
            case 1:
                passwordResetToken = _a.sent();
                res.status(200).json({
                    success: true,
                    message: 'code verified',
                    passwordResetToken: passwordResetToken,
                });
                return [3 /*break*/, 3];
            case 2:
                err_7 = _a.sent();
                return [2 /*return*/, next(err_7)];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.resetPassword = (0, express_async_handler_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var err_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, authServices_1.createNewPassword)(req.params.passwordResetToken, req.body.newPassword)];
            case 1:
                _a.sent();
                res.status(200).json({
                    success: true,
                    message: 'password reset successfully,please login',
                });
                return [3 /*break*/, 3];
            case 2:
                err_8 = _a.sent();
                return [2 /*return*/, next(err_8)];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.logIn = (0, express_async_handler_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, isActivated, token, refreshToken, user, err_9;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, authServices_1.logInService)(req, res, req.body.email, req.body.password)];
            case 1:
                _a = _b.sent(), isActivated = _a[0], token = _a[1], refreshToken = _a[2], user = _a[3];
                if (isActivated) {
                    res.status(200).json({
                        success: true,
                        user: user,
                        accessToken: token,
                        refreshToken: refreshToken,
                    });
                }
                else {
                    res.status(200).json({
                        success: true,
                        message: 'activation code sent, please check your mail box',
                        activationToken: token,
                    });
                }
                return [3 /*break*/, 3];
            case 2:
                err_9 = _b.sent();
                return [2 /*return*/, next(err_9)];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.logOut = (0, express_async_handler_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var refreshToken, user;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                refreshToken = req.cookies.refreshToken;
                return [4 /*yield*/, userModel_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
            case 1:
                user = _b.sent();
                if (!user) return [3 /*break*/, 3];
                user.refreshTokens = user.refreshTokens.filter(function (rt) { return rt !== refreshToken; });
                return [4 /*yield*/, user.save()];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3:
                (0, authServices_1.clearCookies)(res);
                res.status(200).json({
                    success: true,
                    message: 'logged out successfully',
                });
                return [2 /*return*/];
        }
    });
}); });
exports.googleAuth = passport_1.default.authenticate('google', {
    scope: ['profile', 'email'],
});
//exchange code with profile info
exports.googleRedirection = [
    passport_1.default.authenticate('google'),
    function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, accessToken, refreshToken, user, frontRedirectionUrl;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, authServices_1.signInGoogleRedirection)(req, res)];
                case 1:
                    _a = _b.sent(), accessToken = _a[0], refreshToken = _a[1], user = _a[2];
                    frontRedirectionUrl = "".concat(process.env.FRONTEND_URL, "?googleAuthSuccess=true");
                    res.redirect(frontRedirectionUrl); //redirect to home page of frontend
                    return [2 /*return*/];
            }
        });
    }); },
];
exports.updateMe = (0, express_async_handler_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, err_10;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, authServices_1.updateMyInfo)(req, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
            case 1:
                user = _b.sent();
                res.status(200).json({
                    success: true,
                    user: user,
                });
                return [3 /*break*/, 3];
            case 2:
                err_10 = _b.sent();
                return [2 /*return*/, next(err_10)];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.getMe = (0, express_async_handler_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            res.status(200).json({
                success: true,
                user: req.user,
            });
        }
        catch (err) {
            return [2 /*return*/, next(err)];
        }
        return [2 /*return*/];
    });
}); });
exports.changeMyPassword = (0, express_async_handler_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var err_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, authServices_1.changeCurrentPassword)(req, res)];
            case 1:
                _a.sent();
                res.status(200).json({
                    success: true,
                    message: 'Your password has been changed , please login again',
                });
                return [3 /*break*/, 3];
            case 2:
                err_11 = _a.sent();
                return [2 /*return*/, next(err_11)];
            case 3: return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=authControllers.js.map