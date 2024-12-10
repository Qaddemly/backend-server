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
exports.resetCodeVerified = exports.generateAnotherPassResetCode = exports.generateAndEmailPassResetCode = exports.generateAndEmailCode = exports.generateAnotherActivationCode = exports.resettingUserCodeFields = exports.cryptoEncryption = void 0;
var crypto_1 = __importDefault(require("crypto"));
var email_1 = require("./email");
// create general code for activation or resetting password
var createCode = function () {
    var code = Math.floor(100000 + Math.random() * 900000).toString();
    return code;
};
// use crypto lib to encrypt password token any thing else
var cryptoEncryption = function (objective) {
    return crypto_1.default.createHash('sha256').update(objective).digest('hex');
};
exports.cryptoEncryption = cryptoEncryption;
//used for generating activation code and adn activationToken
var generateActivationTokenAndCode = function (user) { return __awaiter(void 0, void 0, void 0, function () {
    var code, hashedCode, activationToken, hashedActivationToken;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                code = createCode();
                hashedCode = (0, exports.cryptoEncryption)(code);
                activationToken = "".concat(user.email + code);
                hashedActivationToken = (0, exports.cryptoEncryption)(activationToken);
                //5 save token and code to user
                user.activationCode = hashedCode;
                user.activationCodeExpiresIn = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
                user.activationToken = hashedActivationToken;
                return [4 /*yield*/, user.save()];
            case 1:
                _a.sent();
                return [2 /*return*/, [hashedActivationToken, code]];
        }
    });
}); };
var resettingUserCodeFields = function (user) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user.activationCode = undefined;
                user.activationCodeExpiresIn = undefined;
                user.activationToken = undefined;
                user.passwordResetCode = undefined;
                user.passwordResetCodeExpires = undefined;
                user.passwordResetVerificationToken = undefined;
                user.passwordResetToken = undefined;
                user.activationCode = undefined;
                return [4 /*yield*/, user.save()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.resettingUserCodeFields = resettingUserCodeFields;
var generateAnotherActivationCode = function (user) { return __awaiter(void 0, void 0, void 0, function () {
    var code, hashedCode;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                code = createCode();
                hashedCode = (0, exports.cryptoEncryption)(code);
                user.activationCode = hashedCode;
                user.activationCodeExpiresIn = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
                return [4 /*yield*/, user.save()];
            case 1:
                _a.sent();
                return [2 /*return*/, code];
        }
    });
}); };
exports.generateAnotherActivationCode = generateAnotherActivationCode;
var generateAndEmailCode = function (user) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, activationToken, code, subject, message;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, generateActivationTokenAndCode(user)];
            case 1:
                _a = _b.sent(), activationToken = _a[0], code = _a[1];
                subject = 'email activation';
                message = "your activation code is ".concat(code);
                return [4 /*yield*/, (0, email_1.sendingCodeToEmail)(user, subject, message)];
            case 2:
                _b.sent();
                return [2 /*return*/, activationToken];
        }
    });
}); };
exports.generateAndEmailCode = generateAndEmailCode;
//used for generating activation code and adn activationToken
var generatePassResetTokenAndCode = function (user) { return __awaiter(void 0, void 0, void 0, function () {
    var code, hashedCode, activationToken, hashedActivationToken;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                code = createCode();
                hashedCode = (0, exports.cryptoEncryption)(code);
                activationToken = "".concat(user.email + code);
                hashedActivationToken = (0, exports.cryptoEncryption)(activationToken);
                //5 save token and code to user
                user.passwordResetCode = hashedCode;
                user.passwordResetCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
                user.passwordResetVerificationToken = hashedActivationToken;
                return [4 /*yield*/, user.save()];
            case 1:
                _a.sent();
                return [2 /*return*/, [hashedActivationToken, code]];
        }
    });
}); };
var generateAndEmailPassResetCode = function (user) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, hashedActivationToken, code, subject, message;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, generatePassResetTokenAndCode(user)];
            case 1:
                _a = _b.sent(), hashedActivationToken = _a[0], code = _a[1];
                subject = 'password reset code';
                message = "your password reset code is valid for (10 min) \n\n  ".concat(code, "\n");
                return [4 /*yield*/, (0, email_1.sendingCodeToEmail)(user, subject, message)];
            case 2:
                _b.sent();
                return [2 /*return*/, hashedActivationToken];
        }
    });
}); };
exports.generateAndEmailPassResetCode = generateAndEmailPassResetCode;
var generateAnotherPassResetCode = function (user) { return __awaiter(void 0, void 0, void 0, function () {
    var code, hashedCode;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                code = createCode();
                hashedCode = (0, exports.cryptoEncryption)(code);
                user.passwordResetCode = hashedCode;
                user.passwordResetCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
                return [4 /*yield*/, user.save()];
            case 1:
                _a.sent();
                return [2 /*return*/, code];
        }
    });
}); };
exports.generateAnotherPassResetCode = generateAnotherPassResetCode;
var resetCodeVerified = function (user) { return __awaiter(void 0, void 0, void 0, function () {
    var resetToken, passwordResetToken;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!user.isActivated) {
                    user.isActivated = true;
                    user.activationCode = undefined;
                    user.activationCodeExpiresIn = undefined;
                    user.activationToken = undefined;
                }
                resetToken = "".concat(user.email, "+").concat(user.passwordResetVerificationToken);
                passwordResetToken = (0, exports.cryptoEncryption)(resetToken);
                user.passwordResetToken = passwordResetToken;
                user.passwordResetCode = undefined;
                user.passwordResetCodeExpires = undefined;
                user.passwordResetVerificationToken = undefined;
                return [4 /*yield*/, user.save()];
            case 1:
                _a.sent();
                return [2 /*return*/, passwordResetToken];
        }
    });
}); };
exports.resetCodeVerified = resetCodeVerified;
//# sourceMappingURL=codeUtils.js.map