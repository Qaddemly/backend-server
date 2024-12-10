import { Request, Response } from 'express';
import catchAsync from 'express-async-handler';
import { CreateBusinessDto } from '../dtos/businessDto';

import * as businessServices from './../services/businessServices';

export const createBusiness = catchAsync(
    async (req: Request<{}, {}, CreateBusinessDto>, res: Response) => {
        const business = await businessServices.createBusiness(req.body, 0);
        res.status(201).json({
            status: 'success',
            message: 'Business created successfully',
            business,
        });
    },
);
