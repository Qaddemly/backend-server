import { Request, Response } from 'express';
import catchAsync from 'express-async-handler';
import { CreateBusinessDto } from '../dtos/businessDto';

import * as businessServices from './../services/businessServices';
import { getBusinessQueryParams } from '../types/types';

/**
 *
 * Creation of a business page
 *
 * This function creates a business profile and mark the user as the owner of the business,
 * and returns the business profile created.
 *
 * TODO: Add image upload for the business profile
 *
 * */
export const createBusiness = catchAsync(
    async (req: Request<{}, {}, CreateBusinessDto>, res: Response) => {
        const business = await businessServices.createBusiness(
            req.body,
            req.user.id,
        );
        res.status(201).json({
            status: 'success',
            message: 'Business created successfully',
            business,
        });
    },
);

/**
 *
 * Search on business profiles by prefix of the business name,
 * and returns 20 business profiles that match the search.
 *
 *
 * TODO: talk with frontend about what they need to display in the search results
 * Each business profile contains : companyName, logo, id
 *
 * */
export const searchBusinessByName = catchAsync(
    async (
        req: Request<{}, {}, {}, getBusinessQueryParams>,
        res: Response,
    ) => {},
);

/**
 * Get a detailed business profile by the business name
 * TODO: talk with frontend about what they need to display in the business profile
 * */
export const getBusinessById = catchAsync(
    async (req: Request, res: Response) => {},
);
export const updateBusiness = catchAsync(
    async (req: Request, res: Response) => {},
);
export const deleteBusiness = catchAsync(
    async (req: Request, res: Response) => {},
);
