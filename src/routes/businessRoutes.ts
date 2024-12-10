import express from 'express';
import * as businessController from '../controllers/businessController';

export const businessRoute = express.Router();

businessRoute.post('/', businessController.createBusiness);
businessRoute.get('/', businessController.getBusinesses);
businessRoute.get('/:id', businessController.getBusinessById);
businessRoute.put('/:id', businessController.updateBusiness);
businessRoute.delete('/:id', businessController.deleteBusiness);
