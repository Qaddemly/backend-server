import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { Request } from 'express';
import AppError from '../utils/appError';
const storage = multer.memoryStorage();
const imageMulterOption = () => {
    const fileFilter = (
        req: Request,
        file: Express.Multer.File,
        cb: FileFilterCallback,
    ) => {
        console.log(file);
        if (file.mimetype.split('/')[0] === 'image') {
            cb(null, true);
        } else cb(new AppError('only images is allowed'));
    };
    const upload = multer({ storage: storage, fileFilter: fileFilter });
    return upload;
};

const resumeMulterOption = () => {
    const fileFilter = (
        req: Request,
        file: Express.Multer.File,
        cb: FileFilterCallback,
    ) => {
        console.log(file.mimetype);
        cb(null, true);

        // if (file.mimetype.split('/')[0] === 'image') {
        // } else cb(new AppError('only images is allowed'));
    };
    const upload = multer({ storage: storage, fileFilter: fileFilter });
    return upload;
};

export const uploadSingleImage = (fieldName: string) => {
    return imageMulterOption().single(fieldName);
};

export const uploadSingleResume = (fieldName: string) => {
    return resumeMulterOption().single(fieldName);
};

// File filter for photos
const photoFileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new AppError('Error: Only images are allowed for the photo!'));
    }
};

// File filter for resumes
const resumeFileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
) => {
    const filetypes = /pdf|doc|docx/;
    const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(
            new AppError(
                'Error: Only PDF, DOC, and DOCX files are allowed for the resume!',
            ),
        );
    }
};

// Initialize upload
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.fieldname === 'profilePicture') {
            photoFileFilter(req, file, cb);
        } else if (file.fieldname === 'resume') {
            resumeFileFilter(req, file, cb);
        } else {
            cb(new AppError('Error: Unknown field!'));
        }
    },
    limits: { fieldSize: 5000000 }, //5MB limit
});

export const uploadProfilePicAndResume = (fields?: multer.Field[]) =>
    upload.fields(fields!);
