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
    verifyPasswordResetCode,
} from '../controllers/authControllers';
import { protect } from '../services/authServices';
const authRouter = express.Router();

authRouter.post('/signup', signUp);
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
authRouter.post('/resetMyPassword/:passwordResetToken', resetPassword);
authRouter.post('/logIn', logIn);
authRouter.post('/logout', protect, logOut);
// render consent page
authRouter.get('/googleAuth', googleAuth);
authRouter.get('/google/redirect', googleRedirection);
export default authRouter;
