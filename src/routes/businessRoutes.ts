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
businessRoute.get('/', businessController.searchBusinessByName);
businessRoute.get('/:id', businessController.getBusinessById);
businessRoute.put('/:id', businessController.updateBusiness);
businessRoute.delete('/:id', businessController.deleteBusiness);
