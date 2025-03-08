import { Request, Response, NextFunction } from 'express';

import catchAsync from 'express-async-handler';

import {
    createCertificateContentService,
    deleteOneCertificateContentService,
    getAllCertificatesContentService,
    getOneCertificateContentService,
    updateOneCertificateContentService,
} from '../../services/resumeTemplateServices/resumeTemplateCertificateServices';

export const createCertificateContent = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = req.user.id;
            const resumeTemplateId = Number(req.params.resumeTemplateId);
            const data = req.body;
            const certificateContent = await createCertificateContentService(
                resumeTemplateId,
                accountId,
                data,
            );
            res.status(201).json({
                success: true,
                message: 'certificateContent created successfully',
                certificateContent,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const getOneCertificateContent = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = req.user.id;
            const resumeTemplateId = Number(req.params.resumeTemplateId);
            const certificateContentId = Number(
                req.params.certificateContentId,
            );
            const certificateContent = await getOneCertificateContentService(
                resumeTemplateId,
                accountId,
                certificateContentId,
            );
            res.status(200).json({
                success: true,
                certificateContent,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const getAllCertificatesContent = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = req.user.id;
            const resumeTemplateId = Number(req.params.resumeTemplateId);
            const certificatesContent = await getAllCertificatesContentService(
                resumeTemplateId,
                accountId,
            );
            res.status(200).json({
                success: true,
                certificatesContent,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const updateOneCertificateContent = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = req.user.id;
            const resumeTemplateId = Number(req.params.resumeTemplateId);
            const certificateContentId = Number(
                req.params.certificateContentId,
            );
            const data = req.body;
            const certificateContent = await updateOneCertificateContentService(
                resumeTemplateId,
                accountId,
                certificateContentId,
                data,
            );
            res.status(200).json({
                success: true,
                message: 'certificateContent updated successfully',
                certificateContent,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const deleteOneCertificateContent = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = req.user.id;
            const resumeTemplateId = Number(req.params.resumeTemplateId);
            const certificateContentId = Number(
                req.params.certificateContentId,
            );
            await deleteOneCertificateContentService(
                resumeTemplateId,
                accountId,
                certificateContentId,
            );
            res.status(204).json({});
        } catch (err) {
            return next(err);
        }
    },
);
