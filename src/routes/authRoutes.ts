import express from 'express';
import {
    activateEmail,
    changeMyPassword,
    forgetPassword,
    getMe,
    googleAuth,
    googleRedirection,
    logIn,
    logOut,
    resendActivationCode,
    resendPasswordResetCodeAgain,
    resetPassword,
    signUp,
    SignUpStepTwo,
    updateMe,
    verifyPasswordResetCode,
} from '../controllers/authControllers';
import {
    protect,
    resizeUserImage,
    savingResumeInDisk,
    uploadUserPICAndResume,
} from '../services/authServices';
import {
    resetPasswordValidator,
    loginValidator,
    userCreationValidatorStepOne,
    userCreationValidatorStepTwo,
    userUpdateValidator,
    changePasswordValidator,
    forgetPasswordValidator,
} from '../middlewares/validators/authValidator';
import validateRequestMiddleware from '../middlewares/validator';
import { loginRateLimiter } from '../middlewares/rateLimitMiddleWares';
const authRouter = express.Router();

authRouter.post(
    '/signup',
    validateRequestMiddleware(userCreationValidatorStepOne),
    signUp,
);
authRouter.put(
    '/completeRegistration',
    protect,
    //uploadUserImage,
    // uploadUserResume,
    uploadUserPICAndResume,
    validateRequestMiddleware(userCreationValidatorStepTwo),
    resizeUserImage,
    savingResumeInDisk,
    SignUpStepTwo,
);
authRouter.put('/activateEmail/:activationToken', activateEmail);
authRouter.put('/resendActivateCode/:activationToken', resendActivationCode);
authRouter.post(
    '/forgetMyPassword',
    validateRequestMiddleware(forgetPasswordValidator),
    forgetPassword,
);
authRouter.put(
    '/resendForgetPassCode/:resetActivationToken',
    resendPasswordResetCodeAgain,
);
authRouter.put(
    '/verifyForgetPassCode/:resetActivationToken',
    verifyPasswordResetCode,
);
authRouter.post(
    '/resetMyPassword/:passwordResetToken',
    validateRequestMiddleware(resetPasswordValidator),
    resetPassword,
);
authRouter.post(
    '/logIn',
    loginRateLimiter,
    validateRequestMiddleware(loginValidator),
    logIn,
);
authRouter.post('/logout', protect, logOut);
// render consent page
authRouter.get('/googleAuth', googleAuth);
authRouter.get('/google/redirect', googleRedirection);
// authRouter.patch(
//     '/updateMe',
//     protect,
//     uploadUserPICAndResume,
//     validateRequestMiddleware(userUpdateValidator),
//     resizeUserImage,
//     savingResumeInDisk,
//     updateMe,
// );

authRouter.get('/getMe', protect, getMe);
authRouter.put(
    '/changeMyPassword',
    protect,
    validateRequestMiddleware(changePasswordValidator),
    changeMyPassword,
);

export default authRouter;
