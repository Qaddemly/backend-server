import express from 'express';
import * as coverLetterController from '../controllers/coverLetterController';
import * as coverLetterValidator from '../middlewares/validators/coverLetterValidator';
import * as coverLetterService from '../services/coverLetterServices';
import { protect } from '../services/authServices';
import validateRequestMiddleware from '../middlewares/validator';
const coverLetterRouter = express.Router();
coverLetterRouter.post(
    '/',
    protect,
    validateRequestMiddleware(coverLetterValidator.CreateCoverLetterValidator),
    coverLetterController.createCoverLetter,
);
coverLetterRouter.get(
    '/:coverLetterId',
    protect,
    validateRequestMiddleware(coverLetterValidator.coverLetterIdValidator),
    coverLetterController.getOneCoverLetterById,
);
coverLetterRouter.get(
    '/',
    protect,
    coverLetterController.getAllCoverLettersOfUser,
);
coverLetterRouter.delete(
    '/:coverLetterId',
    protect,
    validateRequestMiddleware(coverLetterValidator.coverLetterIdValidator),
    coverLetterController.deleteCoverLetter,
);
coverLetterRouter.put(
    '/:coverLetterId',
    protect,
    validateRequestMiddleware(coverLetterValidator.UpdateCoverLetterValidator),
    coverLetterController.updateCoverLetterInfo,
);
coverLetterRouter.post(
    '/:coverLetterId/personalDetails',
    protect,
    coverLetterService.uploadPersonalDetailsImage,
    validateRequestMiddleware(
        coverLetterValidator.CreatePersonalDetailsValidator,
    ),
    coverLetterService.resizePersonalDetailsImage,
    coverLetterController.createCoverLetterPersonalDetails,
);
coverLetterRouter.get(
    '/:coverLetterId/personalDetails',
    protect,
    validateRequestMiddleware(coverLetterValidator.coverLetterIdValidator),
    coverLetterController.getCoverLetterPersonalDetails,
);

coverLetterRouter.put(
    '/:coverLetterId/personalDetails',
    protect,
    coverLetterService.uploadPersonalDetailsImage,
    validateRequestMiddleware(
        coverLetterValidator.UpdatePersonalDetailsValidator,
    ),
    coverLetterService.resizePersonalDetailsImage,
    coverLetterController.updateCoverLetterPersonalDetails,
);

coverLetterRouter.delete(
    '/:coverLetterId/personalDetails',
    protect,
    validateRequestMiddleware(coverLetterValidator.coverLetterIdValidator),
    coverLetterController.deleteCoverLetterPersonalDetails,
);

export default coverLetterRouter;
