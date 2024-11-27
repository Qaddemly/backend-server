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
const authRouter = express.Router();

authRouter.post('/signup', userCreationValidatorStepOne, signUp);
authRouter.put(
    '/completeRegistration',
    protect,
    uploadUserImage,
    userCreationValidatorStepTwo,
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
    resetPasswordValidator,
    resetPassword,
);
authRouter.post('/logIn', loginValidator, logIn);
authRouter.post('/logout', protect, logOut);
// render consent page
authRouter.get('/googleAuth', googleAuth);
authRouter.get('/google/redirect', googleRedirection);
authRouter.patch(
    '/updateMe',
    protect,
    uploadUserImage,
    userUpdateValidator,
    resizeUserImage,
    updateMe,
);

export default authRouter;
