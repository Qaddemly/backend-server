import express from 'express';
import * as businessController from '../controllers/businessController';

export const businessRoute = express.Router();

businessRoute.post('/', businessController.createBusiness);
