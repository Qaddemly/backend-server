"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadProfilePicAndResume = exports.uploadSingleResume = exports.uploadSingleImage = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const appError_1 = __importDefault(require("../utils/appError"));
const storage = multer_1.default.memoryStorage();
const imageMulterOption = () => {
    const fileFilter = (req, file, cb) => {
        console.log(file);
        if (file.mimetype.split('/')[0] === 'image') {
            cb(null, true);
        }
        else
            cb(new appError_1.default('only images is allowed'));
    };
    const upload = (0, multer_1.default)({ storage: storage, fileFilter: fileFilter });
    return upload;
};
const resumeMulterOption = () => {
    const fileFilter = (req, file, cb) => {
        console.log(file.mimetype);
        cb(null, true);
        // if (file.mimetype.split('/')[0] === 'image') {
        // } else cb(new AppError('only images is allowed'));
    };
    const upload = (0, multer_1.default)({ storage: storage, fileFilter: fileFilter });
    return upload;
};
const uploadSingleImage = (fieldName) => {
    return imageMulterOption().single(fieldName);
};
exports.uploadSingleImage = uploadSingleImage;
const uploadSingleResume = (fieldName) => {
    return resumeMulterOption().single(fieldName);
};
exports.uploadSingleResume = uploadSingleResume;
// File filter for photos
const photoFileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    }
    else {
        cb(new appError_1.default('Error: Only images are allowed for the photo!'));
    }
};
// File filter for resumes
const resumeFileFilter = (req, file, cb) => {
    const filetypes = /pdf|doc|docx/;
    const extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    }
    else {
        cb(new appError_1.default('Error: Only PDF, DOC, and DOCX files are allowed for the resume!'));
    }
};
// Initialize upload
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.fieldname === 'profilePicture') {
            photoFileFilter(req, file, cb);
        }
        else if (file.fieldname === 'resume') {
            resumeFileFilter(req, file, cb);
        }
        else {
            cb(new appError_1.default('Error: Unknown field!'));
        }
    },
});
const uploadProfilePicAndResume = (fields) => upload.fields(fields);
exports.uploadProfilePicAndResume = uploadProfilePicAndResume;
