"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var authControllers_1 = require("../controllers/authControllers");
var authServices_1 = require("../services/authServices");
var userValidator_1 = require("../middlewares/validators/userValidator");
var validator_1 = __importDefault(require("../middlewares/validator"));
var rateLimitMiddleWares_1 = require("../middlewares/rateLimitMiddleWares");
var authRouter = express_1.default.Router();
authRouter.post('/signup', (0, validator_1.default)(userValidator_1.userCreationValidatorStepOne), authControllers_1.signUp);
authRouter.put('/completeRegistration', authServices_1.protect, 
//uploadUserImage,
// uploadUserResume,
authServices_1.uploadUserPICAndResume, (0, validator_1.default)(userValidator_1.userCreationValidatorStepTwo), authServices_1.resizeUserImage, authServices_1.savingResumeInDisk, authControllers_1.SignUpStepTwo);
authRouter.put('/activateEmail/:activationToken', authControllers_1.activateEmail);
authRouter.put('/resendActivateCode/:activationToken', authControllers_1.resendActivationCode);
authRouter.post('/forgetMyPassword', (0, validator_1.default)(userValidator_1.forgetPasswordValidator), authControllers_1.forgetPassword);
authRouter.put('/resendForgetPassCode/:resetActivationToken', authControllers_1.resendPasswordResetCodeAgain);
authRouter.put('/verifyForgetPassCode/:resetActivationToken', authControllers_1.verifyPasswordResetCode);
authRouter.post('/resetMyPassword/:passwordResetToken', (0, validator_1.default)(userValidator_1.resetPasswordValidator), authControllers_1.resetPassword);
authRouter.post('/logIn', rateLimitMiddleWares_1.loginRateLimiter, (0, validator_1.default)(userValidator_1.loginValidator), authControllers_1.logIn);
authRouter.post('/logout', authServices_1.protect, authControllers_1.logOut);
// render consent page
authRouter.get('/googleAuth', authControllers_1.googleAuth);
authRouter.get('/google/redirect', authControllers_1.googleRedirection);
authRouter.patch('/updateMe', authServices_1.protect, authServices_1.uploadUserPICAndResume, (0, validator_1.default)(userValidator_1.userUpdateValidator), authServices_1.resizeUserImage, authServices_1.savingResumeInDisk, authControllers_1.updateMe);
authRouter.get('/getMe', authServices_1.protect, authControllers_1.getMe);
authRouter.put('/changeMyPassword', authServices_1.protect, (0, validator_1.default)(userValidator_1.changePasswordValidator), authControllers_1.changeMyPassword);
exports.default = authRouter;
//# sourceMappingURL=authRoutes.js.map