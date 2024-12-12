import express from 'express';
import * as businessController from '../controllers/businessController';
import {
    resizeBusinessLogo,
    uploadSingleImage,
} from '../middlewares/upload.middleWare';
import { protect } from '../services/authServices';

export const businessRoute = express.Router();

businessRoute.post(
    '/',
    protect,
    uploadSingleImage('logo'),
    resizeBusinessLogo,
    businessController.createBusiness,
);
businessRoute.get('/', protect, businessController.searchBusinessByName);
businessRoute.get('/:id', protect, businessController.getBusinessById);
businessRoute.put(
    '/:businessId',
    protect,
    uploadSingleImage('logo'),
    resizeBusinessLogo,
    businessController.updateBusiness,
);
businessRoute.delete('/:id', protect, businessController.deleteBusiness);
