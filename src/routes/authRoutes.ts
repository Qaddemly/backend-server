import express from 'express';
import {
    activateEmail,
    forgetPassword,
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
    uploadUserImage,
} from '../services/authServices';
import {
    resetPasswordValidator,
    loginValidator,
    userCreationValidatorStepOne,
    userCreationValidatorStepTwo,
    userUpdateValidator,
} from '../middlewares/validators/userValidator';
import validateRequestMiddleware from '../middlewares/validator';
const authRouter = express.Router();

authRouter.post(
    '/signup',
    validateRequestMiddleware(userCreationValidatorStepOne),
    signUp,
);
authRouter.put(
    '/completeRegistration',
    protect,
    uploadUserImage,
    validateRequestMiddleware(userCreationValidatorStepTwo),
    resizeUserImage,
    SignUpStepTwo,
);
authRouter.put('/activateEmail/:activationToken', activateEmail);
authRouter.put('/resendActivateCode/:activationToken', resendActivationCode);
authRouter.post('/forgetMyPassword', forgetPassword);
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
authRouter.post('/logIn', validateRequestMiddleware(loginValidator), logIn);
authRouter.post('/logout', protect, logOut);
// render consent page
authRouter.get('/googleAuth', googleAuth);
authRouter.get('/google/redirect', googleRedirection);
authRouter.patch(
    '/updateMe',
    protect,
    uploadUserImage,
    validateRequestMiddleware(userUpdateValidator),
    resizeUserImage,
    updateMe,
);

export default authRouter;
