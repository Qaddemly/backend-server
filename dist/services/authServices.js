"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeService = exports.returnUserInFormOfMongoDBObject = exports.updateAllAccountData = exports.updateUserAfterCompleteData = exports.clearCookies = exports.changeCurrentPassword = exports.updateMyInfo = exports.signInGoogleRedirection = exports.protect = exports.logInService = exports.createNewPassword = exports.PasswordResetCodeVerification = exports.createAnotherResetPasswordCodeAndResend = exports.generateForgetPasswordCodeAndEmail = exports.createAnotherCodeAndResend = exports.verifyActivationCode = exports.savingResumeInDisk = exports.resizeUserImage = exports.uploadUserPICAndResume = exports.updateUserForSignUpStepTwo = exports.signUpService = exports.createUserForSignUp = void 0;
var fs_1 = __importDefault(require("fs"));
var appError_1 = __importDefault(require("../utils/appError"));
var express_async_handler_1 = __importDefault(require("express-async-handler"));
var email_1 = require("../utils/email");
var codeUtils_1 = require("../utils/codeUtils");
var password_1 = require("../utils/password");
var jwt_1 = require("../utils/jwt");
var upload_middleWare_1 = require("../middlewares/upload.middleWare");
var sharp_1 = __importDefault(require("sharp"));
var accountRepository_1 = require("../Repository/accountRepository");
var accountModel_1 = __importDefault(require("../models/accountModel"));
var Account_1 = require("../entity/Account");
var educationRepository_1 = require("../Repository/educationRepository");
var Education_1 = require("../entity/Education");
var Skill_1 = require("../entity/Skill");
var skillRepository_1 = require("../Repository/skillRepository");
var Experience_1 = require("../entity/Experience");
var experineceRepository_1 = require("../Repository/experineceRepository");
var returningFieldAsInMongoDb_1 = require("../utils/returningFieldAsInMongoDb");
var Language_1 = require("../entity/Language");
var languageRepository_1 = require("../Repository/languageRepository");
var createUserForSignUp = function (reqBody) { return __awaiter(void 0, void 0, void 0, function () {
    var firstName, lastName, email, password, hashedPassword, newUser;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                firstName = reqBody.firstName, lastName = reqBody.lastName, email = reqBody.email, password = reqBody.password;
                return [4 /*yield*/, (0, password_1.hashingPassword)(password)];
            case 1:
                hashedPassword = _a.sent();
                newUser = new Account_1.Account();
                newUser.first_name = firstName;
                newUser.last_name = lastName;
                newUser.email = email;
                newUser.password = hashedPassword;
                return [4 /*yield*/, accountRepository_1.AccountRepository.save(newUser)];
            case 2:
                _a.sent();
                return [2 /*return*/, newUser];
        }
    });
}); };
exports.createUserForSignUp = createUserForSignUp;
var signUpService = function (userData) { return __awaiter(void 0, void 0, void 0, function () {
    var newUser, userTempData, activationToken;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.createUserForSignUp)(userData)];
            case 1:
                newUser = _a.sent();
                return [4 /*yield*/, accountModel_1.default.create({
                        accountId: newUser.id,
                    })];
            case 2:
                userTempData = _a.sent();
                return [4 /*yield*/, (0, codeUtils_1.generateAndEmailCode)(userTempData, newUser.email)];
            case 3:
                activationToken = _a.sent();
                return [2 /*return*/, activationToken];
        }
    });
}); };
exports.signUpService = signUpService;
var updateUserForSignUpStepTwo = function (userId, req) { return __awaiter(void 0, void 0, void 0, function () {
    var user, userJson;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, accountRepository_1.AccountRepository.findOneBy({
                    id: userId,
                })];
            case 1:
                user = _a.sent();
                if (!user) {
                    throw new appError_1.default('user not found', 404);
                }
                return [4 /*yield*/, (0, exports.updateUserAfterCompleteData)(user, req)];
            case 2:
                userJson = _a.sent();
                return [2 /*return*/, userJson];
        }
    });
}); };
exports.updateUserForSignUpStepTwo = updateUserForSignUpStepTwo;
exports.uploadUserPICAndResume = (0, upload_middleWare_1.uploadProfilePicAndResume)([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'resume', maxCount: 1 },
]);
//export const uploadUserImage = uploadSingleImage('profilePicture');
exports.resizeUserImage = (0, express_async_handler_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userImageName, imageDbUrl;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.files.profilePicture) return [3 /*break*/, 2];
                userImageName = "user-".concat(Math.round(Math.random() * 1e9), "-").concat(Date.now(), ".jpeg");
                imageDbUrl = "".concat(process.env.BASE_URL, "/uploads/users/").concat(userImageName);
                return [4 /*yield*/, (0, sharp_1.default)(req.files.profilePicture[0].buffer)
                        .resize(800, 600)
                        .toFormat('jpeg')
                        .jpeg({ quality: 90 })
                        .toFile("src/uploads/users/".concat(userImageName))];
            case 1:
                _a.sent();
                req.body.profilePicture = imageDbUrl;
                _a.label = 2;
            case 2:
                next();
                return [2 /*return*/];
        }
    });
}); });
//export const uploadUserResume = uploadSingleResume('resume');
exports.savingResumeInDisk = (0, express_async_handler_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var originalFileName, resumeExtension, resumeName, resumeDbUrl, filePath;
    return __generator(this, function (_a) {
        if (req.files.resume) {
            originalFileName = req.files.resume[0]
                .originalname;
            resumeExtension = originalFileName.substring(originalFileName.lastIndexOf('.') + 1);
            resumeName = "resume-".concat(Math.round(Math.random() * 1e9), "-").concat(Date.now(), ".").concat(resumeExtension);
            resumeDbUrl = "".concat(process.env.BASE_URL, "/uploads/resumes/").concat(resumeName);
            filePath = "src/uploads/resumes/".concat(resumeName);
            fs_1.default.writeFile(filePath, req.files.resume[0].buffer, function (err) {
                if (err) {
                    return next(new appError_1.default('Error saving file to disk.'));
                }
            });
            req.body.resume = resumeDbUrl;
        }
        next();
        return [2 /*return*/];
    });
}); });
var verifyActivationCode = function (code, activationToken) { return __awaiter(void 0, void 0, void 0, function () {
    var hashActivationCode, userTempData, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                hashActivationCode = (0, codeUtils_1.cryptoEncryption)(code);
                return [4 /*yield*/, accountModel_1.default.findOne({
                        activationToken: activationToken,
                    })];
            case 1:
                userTempData = _a.sent();
                if (!userTempData) {
                    throw new appError_1.default('user not found or token expired', 404);
                }
                if (userTempData.activationCode != hashActivationCode ||
                    userTempData.activationCodeExpiresIn.getTime() < Date.now()) {
                    throw new appError_1.default('code is incorrect or expired', 400);
                }
                return [4 /*yield*/, accountRepository_1.AccountRepository.update({
                        id: userTempData.accountId,
                    }, { is_activated: true })];
            case 2:
                user = _a.sent();
                return [4 /*yield*/, (0, codeUtils_1.resettingUserCodeFields)(userTempData)];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.verifyActivationCode = verifyActivationCode;
var createAnotherCodeAndResend = function (activationToken) { return __awaiter(void 0, void 0, void 0, function () {
    var userTempData, foundUser, code, subject, message;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, accountModel_1.default.findOne({
                    activationToken: activationToken,
                })];
            case 1:
                userTempData = _a.sent();
                return [4 /*yield*/, accountRepository_1.AccountRepository.findOneBy({
                        id: userTempData.accountId,
                    })];
            case 2:
                foundUser = _a.sent();
                if (!userTempData) {
                    throw new appError_1.default('user belong to that token does not exist', 400);
                }
                return [4 /*yield*/, (0, codeUtils_1.generateAnotherActivationCode)(userTempData)];
            case 3:
                code = _a.sent();
                subject = 'email activation';
                message = "your activation code is ".concat(code);
                return [4 /*yield*/, (0, email_1.sendingCodeToEmail)(foundUser.email, subject, message)];
            case 4:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.createAnotherCodeAndResend = createAnotherCodeAndResend;
var generateForgetPasswordCodeAndEmail = function (email) { return __awaiter(void 0, void 0, void 0, function () {
    var user, userTempData, resetVerificationToken;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, accountRepository_1.AccountRepository.findOneBy({ email: email })];
            case 1:
                user = _a.sent();
                if (!user) {
                    throw new appError_1.default('no user found with this email', 404);
                }
                return [4 /*yield*/, accountModel_1.default.findOne({ accountId: user.id })];
            case 2:
                userTempData = _a.sent();
                return [4 /*yield*/, (0, codeUtils_1.generateAndEmailPassResetCode)(userTempData, user.email)];
            case 3:
                resetVerificationToken = _a.sent();
                return [2 /*return*/, resetVerificationToken];
        }
    });
}); };
exports.generateForgetPasswordCodeAndEmail = generateForgetPasswordCodeAndEmail;
var createAnotherResetPasswordCodeAndResend = function (resetActivationToken) { return __awaiter(void 0, void 0, void 0, function () {
    var userTempData, userFound, code, subject, message;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, accountModel_1.default.findOne({
                    passwordResetVerificationToken: resetActivationToken,
                })];
            case 1:
                userTempData = _a.sent();
                if (!userTempData) {
                    throw new appError_1.default('userTempData belong to that token does not exist', 400);
                }
                return [4 /*yield*/, accountRepository_1.AccountRepository.findOneBy({
                        id: userTempData.accountId,
                    })];
            case 2:
                userFound = _a.sent();
                return [4 /*yield*/, (0, codeUtils_1.generateAnotherPassResetCode)(userTempData)];
            case 3:
                code = _a.sent();
                subject = 'password reset code';
                message = "your password reset code is valid for (10 min) \n\n      ".concat(code, "\n");
                return [4 /*yield*/, (0, email_1.sendingCodeToEmail)(userFound.email, subject, message)];
            case 4:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.createAnotherResetPasswordCodeAndResend = createAnotherResetPasswordCodeAndResend;
var PasswordResetCodeVerification = function (code, resetActivationToken) { return __awaiter(void 0, void 0, void 0, function () {
    var userTempData, hashedCode, userFound, passwordResetToken;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, accountModel_1.default.findOne({
                    passwordResetVerificationToken: resetActivationToken,
                })];
            case 1:
                userTempData = _a.sent();
                if (!userTempData) {
                    throw new appError_1.default('no user founded with reset token', 404);
                }
                hashedCode = (0, codeUtils_1.cryptoEncryption)(code);
                if (userTempData.passwordResetCode != hashedCode ||
                    userTempData.passwordResetCodeExpires.getTime() < Date.now()) {
                    throw new appError_1.default('invalid or expired code', 400);
                }
                return [4 /*yield*/, accountRepository_1.AccountRepository.findOneBy({
                        id: userTempData.accountId,
                    })];
            case 2:
                userFound = _a.sent();
                return [4 /*yield*/, (0, codeUtils_1.resetCodeVerified)(userTempData, userFound)];
            case 3:
                passwordResetToken = _a.sent();
                return [2 /*return*/, passwordResetToken];
        }
    });
}); };
exports.PasswordResetCodeVerification = PasswordResetCodeVerification;
var createNewPassword = function (passwordResetToken, newPassword) { return __awaiter(void 0, void 0, void 0, function () {
    var userTempData, hashedPassword, userFound;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, accountModel_1.default.findOne({
                    passwordResetToken: passwordResetToken,
                })];
            case 1:
                userTempData = _a.sent();
                if (!userTempData) {
                    throw new appError_1.default('no userTempData founded with that token', 404);
                }
                return [4 /*yield*/, (0, password_1.hashingPassword)(newPassword)];
            case 2:
                hashedPassword = _a.sent();
                return [4 /*yield*/, accountRepository_1.AccountRepository.update({
                        id: userTempData.accountId,
                    }, { password: hashedPassword, password_changed_at: new Date(Date.now()) })];
            case 3:
                userFound = _a.sent();
                return [4 /*yield*/, (0, codeUtils_1.resettingUserCodeFields)(userTempData)];
            case 4:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.createNewPassword = createNewPassword;
var logInService = function (req, res, email, password) { return __awaiter(void 0, void 0, void 0, function () {
    var account, isPassCorrect, userTempData, activationToken, _a, accessToken, refreshToken, updatedUser, returnedUser;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, accountRepository_1.AccountRepository.findOneBy({ email: email })];
            case 1:
                account = _b.sent();
                if (!account) {
                    throw new appError_1.default('email or password is incorrect', 400);
                }
                // when account not set password after login with google
                if (!account.password) {
                    throw new appError_1.default('email or password is incorrect', 400);
                }
                return [4 /*yield*/, (0, password_1.isCorrectPassword)(password, account.password)];
            case 2:
                isPassCorrect = _b.sent();
                if (!isPassCorrect) {
                    throw new appError_1.default('email or password is incorrect', 400);
                }
                if (!!account.is_activated) return [3 /*break*/, 5];
                return [4 /*yield*/, accountModel_1.default.findOne({
                        accountId: account.id,
                    })];
            case 3:
                userTempData = _b.sent();
                return [4 /*yield*/, (0, codeUtils_1.generateAndEmailCode)(userTempData, account.email)];
            case 4:
                activationToken = _b.sent();
                return [2 /*return*/, [false, activationToken, null, null]];
            case 5: return [4 /*yield*/, createTokensForLoggedInUser(account, req, res)];
            case 6:
                _a = _b.sent(), accessToken = _a[0], refreshToken = _a[1], updatedUser = _a[2];
                return [4 /*yield*/, (0, exports.returnUserInFormOfMongoDBObject)(account)];
            case 7:
                returnedUser = _b.sent();
                return [2 /*return*/, [true, accessToken, refreshToken, returnedUser]];
        }
    });
}); };
exports.logInService = logInService;
exports.protect = (0, express_async_handler_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, userTempData, _a, refreshTokenDecodedEmail, foundedUser, foundUserTempData, token, decoded, passChangedAtTimeStamp, err_1, accessToken, refreshToken, newRefreshTokens, refreshTokenList, _i, newRefreshTokens_1, rt, customError;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 8]);
                return [4 /*yield*/, refreshTokenHandler(req, res)];
            case 1:
                _a = _b.sent(), refreshTokenDecodedEmail = _a[0], foundedUser = _a[1], foundUserTempData = _a[2];
                userTempData = foundUserTempData;
                token = void 0;
                if (req.headers.authorization &&
                    req.headers.authorization.startsWith('Bearer')) {
                    token = req.headers.authorization.split(' ')[0];
                }
                else {
                    token = req.cookies.accessToken;
                }
                if (!token) {
                    throw new appError_1.default('there is no access token', 401);
                }
                user = foundedUser; // this line because when access token expired it will not got to the line after decoded
                return [4 /*yield*/, (0, jwt_1.verifyTokenAsync)(token, 'access')];
            case 2:
                decoded = (_b.sent());
                return [4 /*yield*/, accountRepository_1.AccountRepository.findOneBy({ id: decoded.userId })];
            case 3:
                user = _b.sent();
                if (!user) {
                    throw new appError_1.default('user belong to that token does not exist', 401);
                }
                if (user.email !== refreshTokenDecodedEmail) {
                    throw new appError_1.default('malicious, refresh token does not match with access token', 403);
                }
                if (user.password_changed_at) {
                    passChangedAtTimeStamp = parseInt("".concat(user.password_changed_at.getTime() / 1000), 10);
                    console.log(passChangedAtTimeStamp > decoded.iat, decoded.iat);
                    if (passChangedAtTimeStamp > decoded.iat) {
                        throw new appError_1.default('password is changed please login again', 401);
                    }
                }
                // if (user.passwordResetVerificationToken || user.activationToken) {
                //     await resettingUserCodeFields(user);
                // }
                req.user = user; // for letting user to use protected routes
                req.user.googleId = userTempData.googleId;
                next();
                return [3 /*break*/, 8];
            case 4:
                err_1 = _b.sent();
                if (!(err_1.message === 'jwt expired')) return [3 /*break*/, 6];
                accessToken = (0, jwt_1.createAccessToken)(user === null || user === void 0 ? void 0 : user.id);
                refreshToken = (0, jwt_1.createRefreshToken)(user === null || user === void 0 ? void 0 : user.email);
                newRefreshTokens = userTempData.refreshTokens;
                refreshTokenList = [];
                for (_i = 0, newRefreshTokens_1 = newRefreshTokens; _i < newRefreshTokens_1.length; _i++) {
                    rt = newRefreshTokens_1[_i];
                    if (rt !== req.cookies.refreshToken)
                        refreshTokenList.push(rt);
                }
                userTempData.refreshTokens = __spreadArray(__spreadArray([], refreshTokenList, true), [
                    refreshToken,
                ], false);
                return [4 /*yield*/, userTempData.save()];
            case 5:
                _b.sent();
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
                return [3 /*break*/, 7];
            case 6:
                customError = new appError_1.default(//any error is caught except 'jwt expired' it will display the same message in order to prevent attacker from knowing any thing about the error
                'you are not logged in please login to access this route', 401);
                customError.stack = err_1.stack; //to know from where the error is occurred
                return [2 /*return*/, next(customError)];
            case 7: return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
var refreshTokenHandler = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var refreshToken, userTempData, decoded_1, hackedUser, hackedUserTempData, decoded, foundUser, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 10, , 11]);
                refreshToken = void 0;
                if (req.cookies.refreshToken) {
                    refreshToken = req.cookies.refreshToken;
                }
                else {
                    throw new appError_1.default('there is no refresh token', 403);
                }
                return [4 /*yield*/, accountModel_1.default.findOne({
                        refreshTokens: refreshToken,
                    })];
            case 1:
                userTempData = _a.sent();
                if (!!userTempData) return [3 /*break*/, 7];
                return [4 /*yield*/, (0, jwt_1.verifyTokenAsync)(refreshToken, 'refresh')];
            case 2:
                decoded_1 = _a.sent();
                return [4 /*yield*/, accountRepository_1.AccountRepository.findOneBy({
                        email: decoded_1.email,
                    })];
            case 3:
                hackedUser = _a.sent();
                if (!hackedUser) return [3 /*break*/, 6];
                return [4 /*yield*/, accountModel_1.default.findOne({
                        accountId: hackedUser.id,
                    })];
            case 4:
                hackedUserTempData = _a.sent();
                //signout all users
                hackedUserTempData.refreshTokens = [];
                return [4 /*yield*/, hackedUserTempData.save()];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6:
                (0, exports.clearCookies)(res);
                throw new appError_1.default('detect reuse of refresh token, illegitimate user', 403);
            case 7: return [4 /*yield*/, (0, jwt_1.verifyTokenAsync)(refreshToken, 'refresh')];
            case 8:
                decoded = _a.sent();
                return [4 /*yield*/, accountRepository_1.AccountRepository.findOneBy({
                        email: decoded.email,
                    })];
            case 9:
                foundUser = _a.sent();
                return [2 /*return*/, [decoded.email, foundUser, userTempData]];
            case 10:
                err_2 = _a.sent();
                if (err_2.message === 'jwt expired') {
                    (0, exports.clearCookies)(res);
                    throw new appError_1.default('Expired refresh token', 403);
                }
                else if (err_2.message === 'invalid signature') {
                    throw new appError_1.default('Invalid refresh token', 403);
                }
                else
                    throw err_2;
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); };
var createTokensForLoggedInUser = function (user, req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userTempData, accessToken, refreshToken, cookies, newRefreshTokens;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, accountModel_1.default.findOne({ accountId: user.id })];
            case 1:
                userTempData = _a.sent();
                accessToken = (0, jwt_1.createAccessToken)(user.id);
                refreshToken = (0, jwt_1.createRefreshToken)(user.email);
                cookies = req.cookies;
                newRefreshTokens = !(cookies === null || cookies === void 0 ? void 0 : cookies.refreshToken)
                    ? userTempData.refreshTokens
                    : userTempData.refreshTokens.filter(function (rt) { return rt !== cookies.refreshToken; });
                userTempData.refreshTokens = __spreadArray(__spreadArray([], newRefreshTokens, true), [refreshToken], false);
                return [4 /*yield*/, userTempData.save()];
            case 2:
                _a.sent();
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
                return [2 /*return*/, [
                        accessToken,
                        refreshToken,
                        __assign(__assign({}, user), { googleId: userTempData.googleId }),
                    ]];
        }
    });
}); };
var signInGoogleRedirection = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, _a, accessToken, refreshToken, updatedUser;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, accountRepository_1.AccountRepository.findOneBy({ id: req.user.id })];
            case 1:
                user = _b.sent();
                return [4 /*yield*/, createTokensForLoggedInUser(user, req, res)];
            case 2:
                _a = _b.sent(), accessToken = _a[0], refreshToken = _a[1], updatedUser = _a[2];
                return [2 /*return*/, [accessToken, refreshToken, updatedUser]];
        }
    });
}); };
exports.signInGoogleRedirection = signInGoogleRedirection;
var updateMyInfo = function (req, userId) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, address, phone, education, experience, skills, dateOfBirth, languages, profilePicture, firstName, lastName, email, resume, user, userJson;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, address = _a.address, phone = _a.phone, education = _a.education, experience = _a.experience, skills = _a.skills, dateOfBirth = _a.dateOfBirth, languages = _a.languages, profilePicture = _a.profilePicture, firstName = _a.firstName, lastName = _a.lastName, email = _a.email, resume = _a.resume;
                return [4 /*yield*/, accountRepository_1.AccountRepository.findAllAccountData(userId)];
            case 1:
                user = _b.sent();
                if (!user) {
                    throw new appError_1.default('user not found', 404);
                }
                return [4 /*yield*/, (0, exports.updateAllAccountData)(user, req)];
            case 2:
                userJson = _b.sent();
                return [2 /*return*/, userJson];
        }
    });
}); };
exports.updateMyInfo = updateMyInfo;
var changeCurrentPassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, currentPassword, newPassword, refreshToken, currentUser, userPass, isCorrectCurrentPassword, hashedNewPassword, hashedNewPassword, userTempData;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, currentPassword = _a.currentPassword, newPassword = _a.newPassword;
                refreshToken = req.cookies.refreshToken;
                return [4 /*yield*/, accountRepository_1.AccountRepository.findOneBy({ id: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id })];
            case 1:
                currentUser = _c.sent();
                if (!req.user.password) return [3 /*break*/, 3];
                userPass = req.user.password;
                isCorrectCurrentPassword = (0, password_1.isCorrectPassword)(currentPassword, userPass);
                if (!isCorrectCurrentPassword) {
                    throw new appError_1.default('password is incorrect', 400);
                }
                return [4 /*yield*/, (0, password_1.hashingPassword)(newPassword)];
            case 2:
                hashedNewPassword = _c.sent();
                currentUser.password = hashedNewPassword;
                currentUser.password_changed_at = new Date(Date.now());
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, (0, password_1.hashingPassword)(newPassword)];
            case 4:
                hashedNewPassword = _c.sent();
                currentUser.password = hashedNewPassword;
                currentUser.password_changed_at = new Date(Date.now());
                _c.label = 5;
            case 5: return [4 /*yield*/, accountModel_1.default.findOne({
                    accountId: currentUser.id,
                })];
            case 6:
                userTempData = _c.sent();
                userTempData.refreshTokens = userTempData.refreshTokens.filter(function (rt) { return rt !== refreshToken; });
                return [4 /*yield*/, userTempData.save()];
            case 7:
                _c.sent();
                return [4 /*yield*/, accountRepository_1.AccountRepository.save(currentUser)];
            case 8:
                _c.sent();
                (0, exports.clearCookies)(res);
                return [2 /*return*/];
        }
    });
}); };
exports.changeCurrentPassword = changeCurrentPassword;
var clearCookies = function (res) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
};
exports.clearCookies = clearCookies;
var updateUserAfterCompleteData = function (user, req) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, address, phone, education, experience, skills, dateOfBirth, languages, profilePicture, resume, userId, userJson, foundedEducation, eduObj, savedEducation, returnedEducation, education_, savedEducation, returnedEducation, arraySkills_1, newSkills, savedSkills, arrayExperience_1, newExperience, savedExperience, arrayLanguage_1, newLanguage, savedLanguage;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, address = _a.address, phone = _a.phone, education = _a.education, experience = _a.experience, skills = _a.skills, dateOfBirth = _a.dateOfBirth, languages = _a.languages, profilePicture = _a.profilePicture, resume = _a.resume;
                userId = req.user.id;
                user.address = address;
                user.phone.country_code = phone.countryCode;
                user.phone.number = Number(phone.number);
                user.resume = resume;
                user.profile_picture = profilePicture;
                user.date_of_birth = dateOfBirth;
                userJson = __assign({}, user);
                delete userJson.first_name;
                delete userJson.last_name;
                delete userJson.date_of_birth;
                userJson.firstName = user.first_name;
                userJson.lastName = user.last_name;
                userJson.dateOfBirth = user.date_of_birth;
                userJson.phone = (0, returningFieldAsInMongoDb_1.returningPhone)(user.phone);
                if (!education) return [3 /*break*/, 5];
                return [4 /*yield*/, educationRepository_1.EducationRepository.findOneBy({
                        account_id: user.id,
                    })];
            case 1:
                foundedEducation = _b.sent();
                console.log(foundedEducation);
                if (!foundedEducation) return [3 /*break*/, 3];
                eduObj = {};
                eduObj.university = education.university;
                eduObj.field_of_study = education.fieldOfStudy;
                eduObj.gpa = education.gpa;
                eduObj.start_date = education.startDate;
                eduObj.end_date = education.endDate;
                return [4 /*yield*/, educationRepository_1.EducationRepository.updateEducation(eduObj, userId)];
            case 2:
                savedEducation = _b.sent();
                returnedEducation = (0, returningFieldAsInMongoDb_1.returningEducation)(savedEducation);
                userJson.education = returnedEducation;
                return [3 /*break*/, 5];
            case 3:
                education_ = new Education_1.Education();
                education_.account_id = userId; // Associate with the user's ID
                education_.university = education.university;
                education_.field_of_study = education.fieldOfStudy;
                education_.gpa = education.gpa;
                education_.start_date = education.startDate;
                education_.end_date = education.endDate;
                return [4 /*yield*/, educationRepository_1.EducationRepository.save(education_)];
            case 4:
                savedEducation = _b.sent();
                returnedEducation = (0, returningFieldAsInMongoDb_1.returningEducation)(savedEducation);
                userJson.education = returnedEducation;
                _b.label = 5;
            case 5:
                if (!skills) return [3 /*break*/, 8];
                // Create and link new skills
                return [4 /*yield*/, skillRepository_1.SkillRepository.deleteAllSkills(user.id)];
            case 6:
                // Create and link new skills
                _b.sent();
                arraySkills_1 = [];
                newSkills = skills.map(function (skillData) {
                    var skill = new Skill_1.Skill();
                    skill.name = skillData;
                    arraySkills_1.push(skill.name);
                    skill.account = user; // Link the skill to the account
                    return skill;
                });
                return [4 /*yield*/, skillRepository_1.SkillRepository.save(newSkills)];
            case 7:
                savedSkills = _b.sent();
                userJson.skills = arraySkills_1;
                _b.label = 8;
            case 8:
                if (!experience) return [3 /*break*/, 11];
                arrayExperience_1 = [];
                return [4 /*yield*/, experineceRepository_1.ExperienceRepository.deleteAllExperience(user.id)];
            case 9:
                _b.sent();
                newExperience = experience.map(function (experience) {
                    var experience_ = new Experience_1.Experience();
                    //experience_.account = user;
                    experience_.job_title = experience.jobTitle;
                    experience_.employment_type = experience.employmentType;
                    experience_.company_name = experience.companyName;
                    experience_.location = experience.location;
                    experience_.location_type = experience.locationType;
                    experience_.still_working = experience.stillWorking;
                    experience_.start_date = experience.startDate;
                    experience_.end_date = experience.endDate;
                    arrayExperience_1.push((0, returningFieldAsInMongoDb_1.returningExperiences)(experience_));
                    experience_.account = user; // Link the experience_ to the account
                    return experience_;
                });
                return [4 /*yield*/, experineceRepository_1.ExperienceRepository.save(newExperience)];
            case 10:
                savedExperience = _b.sent();
                userJson.experience = arrayExperience_1;
                _b.label = 11;
            case 11:
                if (!languages) return [3 /*break*/, 14];
                arrayLanguage_1 = [];
                return [4 /*yield*/, languageRepository_1.LanguageRepository.deleteAllLanguages(user.id)];
            case 12:
                _b.sent();
                newLanguage = languages.map(function (lang) {
                    var language_ = new Language_1.Language();
                    language_.account = user;
                    language_.name = lang;
                    arrayLanguage_1.push((0, returningFieldAsInMongoDb_1.returningLanguage)(language_));
                    language_.account = user; // Link the language_ to the account
                    return language_;
                });
                return [4 /*yield*/, languageRepository_1.LanguageRepository.save(newLanguage)];
            case 13:
                savedLanguage = _b.sent();
                userJson.languages = arrayLanguage_1;
                _b.label = 14;
            case 14:
                delete userJson.first_name;
                delete userJson.last_name;
                delete userJson.date_of_birth;
                userJson.firstName = user.first_name;
                userJson.lastName = user.last_name;
                userJson.dateOfBirth = user.date_of_birth;
                userJson.phone = (0, returningFieldAsInMongoDb_1.returningPhone)(user.phone);
                return [4 /*yield*/, accountRepository_1.AccountRepository.save(user)];
            case 15:
                _b.sent();
                return [2 /*return*/, userJson];
        }
    });
}); };
exports.updateUserAfterCompleteData = updateUserAfterCompleteData;
var updateAllAccountData = function (user, req) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, address, phone, education, experience, skills, dateOfBirth, languages, profilePicture, resume, userId, address_, phone_, resume_, profilePicture_, dateOfBirth_, userJson, foundedEducation, education_, savedEducation, returnedEducation, eduObj, savedEducation, returnedEducation, foundedEducation, returnedEducation, arraySkills_2, newSkills, savedSkills, arrayExperience_2, newExperience, savedExperience, arrayLanguage_2, newLanguage, savedLanguage;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, address = _a.address, phone = _a.phone, education = _a.education, experience = _a.experience, skills = _a.skills, dateOfBirth = _a.dateOfBirth, languages = _a.languages, profilePicture = _a.profilePicture, resume = _a.resume;
                userId = req.user.id;
                address_ = address ? address : user.address;
                user.address = address_;
                phone_ = phone ? phone : user.phone;
                user.phone.country_code = phone_.countryCode;
                user.phone.number = Number(phone_.number);
                resume_ = resume ? resume : user.resume;
                user.resume = resume_;
                profilePicture_ = profilePicture
                    ? profilePicture
                    : user.profile_picture;
                user.profile_picture = profilePicture_;
                dateOfBirth_ = dateOfBirth ? dateOfBirth : user.date_of_birth;
                user.date_of_birth = dateOfBirth_;
                userJson = __assign({}, user);
                delete userJson.first_name;
                delete userJson.last_name;
                delete userJson.date_of_birth;
                userJson.firstName = user.first_name;
                userJson.lastName = user.last_name;
                userJson.dateOfBirth = user.date_of_birth;
                userJson.phone = (0, returningFieldAsInMongoDb_1.returningPhone)(user.phone);
                if (!education) return [3 /*break*/, 6];
                return [4 /*yield*/, educationRepository_1.EducationRepository.findOneBy({
                        account_id: user.id,
                    })];
            case 1:
                foundedEducation = _b.sent();
                if (!!foundedEducation) return [3 /*break*/, 3];
                education_ = new Education_1.Education();
                education_.account_id = userId; // Associate with the user's ID
                education_.university = education.university;
                education_.field_of_study = education.fieldOfStudy;
                education_.gpa = education.gpa;
                education_.start_date = education.startDate;
                education_.end_date = education.endDate;
                return [4 /*yield*/, educationRepository_1.EducationRepository.save(education_)];
            case 2:
                savedEducation = _b.sent();
                returnedEducation = (0, returningFieldAsInMongoDb_1.returningEducation)(savedEducation);
                userJson.education = returnedEducation;
                return [3 /*break*/, 5];
            case 3:
                eduObj = {};
                eduObj.university = education.university;
                eduObj.field_of_study = education.fieldOfStudy;
                eduObj.gpa = education.gpa;
                eduObj.start_date = education.startDate;
                eduObj.end_date = education.endDate;
                return [4 /*yield*/, educationRepository_1.EducationRepository.updateEducation(eduObj, userId)];
            case 4:
                savedEducation = _b.sent();
                returnedEducation = (0, returningFieldAsInMongoDb_1.returningEducation)(savedEducation);
                userJson.education = returnedEducation;
                _b.label = 5;
            case 5: return [3 /*break*/, 8];
            case 6: return [4 /*yield*/, educationRepository_1.EducationRepository.findOneBy({
                    account_id: user.id,
                })];
            case 7:
                foundedEducation = _b.sent();
                returnedEducation = (0, returningFieldAsInMongoDb_1.returningEducation)(foundedEducation);
                userJson.education = returnedEducation;
                _b.label = 8;
            case 8:
                if (!skills) return [3 /*break*/, 11];
                // Create and link new skills
                return [4 /*yield*/, skillRepository_1.SkillRepository.deleteAllSkills(user.id)];
            case 9:
                // Create and link new skills
                _b.sent();
                arraySkills_2 = [];
                newSkills = skills.map(function (skillData) {
                    var skill = new Skill_1.Skill();
                    skill.name = skillData;
                    arraySkills_2.push(skill.name);
                    skill.account = user; // Link the skill to the account
                    return skill;
                });
                return [4 /*yield*/, skillRepository_1.SkillRepository.save(newSkills)];
            case 10:
                savedSkills = _b.sent();
                userJson.skills = arraySkills_2;
                return [3 /*break*/, 12];
            case 11:
                userJson.skills = [];
                user.skills.map(function (skill) {
                    userJson.skills.push(skill.name);
                });
                _b.label = 12;
            case 12:
                if (!experience) return [3 /*break*/, 15];
                arrayExperience_2 = [];
                return [4 /*yield*/, experineceRepository_1.ExperienceRepository.deleteAllExperience(user.id)];
            case 13:
                _b.sent();
                newExperience = experience.map(function (experience) {
                    var experience_ = new Experience_1.Experience();
                    //experience_.account = user;
                    experience_.job_title = experience.jobTitle;
                    experience_.employment_type = experience.employmentType;
                    experience_.company_name = experience.companyName;
                    experience_.location = experience.location;
                    experience_.location_type = experience.locationType;
                    experience_.still_working = experience.stillWorking;
                    experience_.start_date = experience.startDate;
                    experience_.end_date = experience.endDate;
                    arrayExperience_2.push((0, returningFieldAsInMongoDb_1.returningExperiences)(experience_));
                    experience_.account = user; // Link the experience_ to the account
                    return experience_;
                });
                return [4 /*yield*/, experineceRepository_1.ExperienceRepository.save(newExperience)];
            case 14:
                savedExperience = _b.sent();
                userJson.experience = arrayExperience_2;
                return [3 /*break*/, 16];
            case 15:
                userJson.experiences = [];
                user.experiences.map(function (exp) {
                    userJson.experiences.push((0, returningFieldAsInMongoDb_1.returningExperiences)(exp));
                });
                _b.label = 16;
            case 16:
                if (!languages) return [3 /*break*/, 19];
                arrayLanguage_2 = [];
                return [4 /*yield*/, languageRepository_1.LanguageRepository.deleteAllLanguages(user.id)];
            case 17:
                _b.sent();
                newLanguage = languages.map(function (lang) {
                    var language_ = new Language_1.Language();
                    language_.account = user;
                    language_.name = lang;
                    arrayLanguage_2.push((0, returningFieldAsInMongoDb_1.returningLanguage)(language_));
                    language_.account = user; // Link the language_ to the account
                    return language_;
                });
                return [4 /*yield*/, languageRepository_1.LanguageRepository.save(newLanguage)];
            case 18:
                savedLanguage = _b.sent();
                userJson.languages = arrayLanguage_2;
                return [3 /*break*/, 20];
            case 19:
                userJson.languages = [];
                user.languages.map(function (language) {
                    userJson.languages.push(language.name);
                });
                _b.label = 20;
            case 20:
                delete userJson.first_name;
                delete userJson.last_name;
                delete userJson.date_of_birth;
                userJson.firstName = user.first_name;
                userJson.lastName = user.last_name;
                userJson.dateOfBirth = user.date_of_birth;
                userJson.phone = (0, returningFieldAsInMongoDb_1.returningPhone)(user.phone);
                return [4 /*yield*/, accountRepository_1.AccountRepository.save(user)];
            case 21:
                _b.sent();
                return [2 /*return*/, userJson];
        }
    });
}); };
exports.updateAllAccountData = updateAllAccountData;
var returnUserInFormOfMongoDBObject = function (user) { return __awaiter(void 0, void 0, void 0, function () {
    var userJson, education, skills, experiences, languages;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userJson = __assign({}, user);
                delete userJson.first_name;
                delete userJson.last_name;
                delete userJson.date_of_birth;
                userJson.firstName = user.first_name;
                userJson.lastName = user.last_name;
                userJson.dateOfBirth = user.date_of_birth;
                userJson.phone = (0, returningFieldAsInMongoDb_1.returningPhone)(user.phone);
                return [4 /*yield*/, educationRepository_1.EducationRepository.findOneBy({
                        account_id: user.id,
                    })];
            case 1:
                education = _a.sent();
                if (education)
                    userJson.education = (0, returningFieldAsInMongoDb_1.returningEducation)(education);
                return [4 /*yield*/, skillRepository_1.SkillRepository.find({
                        where: { account: { id: user.id } },
                        relations: ['account'],
                    })];
            case 2:
                skills = _a.sent();
                if (skills)
                    userJson.skills = skills.map(function (skill) { return skill.name; });
                return [4 /*yield*/, experineceRepository_1.ExperienceRepository.find({
                        where: { account: { id: user.id } },
                        relations: ['account'],
                    })];
            case 3:
                experiences = _a.sent();
                if (experiences)
                    userJson.experiences = experiences.map(function (experience) {
                        return (0, returningFieldAsInMongoDb_1.returningExperiences)(experience);
                    });
                return [4 /*yield*/, languageRepository_1.LanguageRepository.find({
                        where: { account: { id: user.id } },
                        relations: ['account'],
                    })];
            case 4:
                languages = _a.sent();
                if (languages)
                    userJson.languages = languages.map(function (language) { return language.name; });
                return [2 /*return*/, userJson];
        }
    });
}); };
exports.returnUserInFormOfMongoDBObject = returnUserInFormOfMongoDBObject;
var getMeService = function (req) {
    var user = req.user;
    return (0, exports.returnUserInFormOfMongoDBObject)(user);
};
exports.getMeService = getMeService;
//# sourceMappingURL=authServices.js.map