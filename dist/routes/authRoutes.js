"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authControllers_1 = require("../controllers/authControllers");
const authServices_1 = require("../services/authServices");
const userValidator_1 = require("../middlewares/validators/userValidator");
const validator_1 = __importDefault(require("../middlewares/validator"));
const authRouter = express_1.default.Router();
authRouter.post('/signup', (0, validator_1.default)(userValidator_1.userCreationValidatorStepOne), authControllers_1.signUp);
authRouter.put('/completeRegistration', authServices_1.protect, 
//uploadUserImage,
// uploadUserResume,
authServices_1.uploadUserPICAndResume, (0, validator_1.default)(userValidator_1.userCreationValidatorStepTwo), authServices_1.resizeUserImage, authServices_1.savingResumeInDisk, authControllers_1.SignUpStepTwo);
authRouter.put('/activateEmail/:activationToken', authControllers_1.activateEmail);
authRouter.put('/resendActivateCode/:activationToken', authControllers_1.resendActivationCode);
authRouter.post('/forgetMyPassword', authControllers_1.forgetPassword);
authRouter.put('/resendForgetPassCode/:resetActivationToken', authControllers_1.resendPasswordResetCodeAgain);
authRouter.put('/verifyForgetPassCode/:resetActivationToken', authControllers_1.verifyPasswordResetCode);
authRouter.post('/resetMyPassword/:passwordResetToken', (0, validator_1.default)(userValidator_1.resetPasswordValidator), authControllers_1.resetPassword);
authRouter.post('/logIn', (0, validator_1.default)(userValidator_1.loginValidator), authControllers_1.logIn);
authRouter.post('/logout', authServices_1.protect, authControllers_1.logOut);
// render consent page
authRouter.get('/googleAuth', authControllers_1.googleAuth);
authRouter.get('/google/redirect', authControllers_1.googleRedirection);
authRouter.patch('/updateMe', authServices_1.protect, authServices_1.uploadUserPICAndResume, (0, validator_1.default)(userValidator_1.userUpdateValidator), authServices_1.resizeUserImage, authServices_1.savingResumeInDisk, authControllers_1.updateMe);
authRouter.get('/getMe', authServices_1.protect, authControllers_1.getMe);
authRouter.put('/changeMyPassword', authServices_1.protect, (0, validator_1.default)(userValidator_1.changePasswordValidator), authControllers_1.changeMyPassword);
exports.default = authRouter;
