import { Request, Response } from 'express';
import catchAsync from 'express-async-handler';
import { CreateBusinessDto } from '../dtos/businessDto';

import * as businessServices from './../services/businessServices';
import exp from 'constants';
import { getBusinessQueryParams } from '../types/types';

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

export const getBusinesses = catchAsync(
    async (
        req: Request<{}, {}, {}, getBusinessQueryParams>,
        res: Response,
    ) => {},
);

export const getBusinessById = catchAsync(
    async (req: Request, res: Response) => {},
);
export const updateBusiness = catchAsync(
    async (req: Request, res: Response) => {},
);
export const deleteBusiness = catchAsync(
    async (req: Request, res: Response) => {},
);
