import { Request, Response } from 'express';
import catchAsync from 'express-async-handler';

import * as accountServices from '../services/accountServices';

export const followBusiness = catchAsync(
    async (req: Request, res: Response) => {
        const accountId = req.user.id;
        const businessId = parseInt(req.params.businessId);
        const followBusiness = await accountServices.followBusiness(
            accountId,
            businessId,
        );
        res.status(201).json({
            status: 'success',
            message: 'Business followed successfully',
        });
    },
);
