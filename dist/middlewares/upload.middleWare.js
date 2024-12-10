"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadProfilePicAndResume = exports.uploadSingleResume = exports.uploadSingleImage = void 0;
var multer_1 = __importDefault(require("multer"));
var path_1 = __importDefault(require("path"));
var appError_1 = __importDefault(require("../utils/appError"));
var storage = multer_1.default.memoryStorage();
var imageMulterOption = function () {
    var fileFilter = function (req, file, cb) {
        console.log(file);
        if (file.mimetype.split('/')[0] === 'image') {
            cb(null, true);
        }
        else
            cb(new appError_1.default('only images is allowed'));
    };
    var upload = (0, multer_1.default)({ storage: storage, fileFilter: fileFilter });
    return upload;
};
var resumeMulterOption = function () {
    var fileFilter = function (req, file, cb) {
        console.log(file.mimetype);
        cb(null, true);
        // if (file.mimetype.split('/')[0] === 'image') {
        // } else cb(new AppError('only images is allowed'));
    };
    var upload = (0, multer_1.default)({ storage: storage, fileFilter: fileFilter });
    return upload;
};
var uploadSingleImage = function (fieldName) {
    return imageMulterOption().single(fieldName);
};
exports.uploadSingleImage = uploadSingleImage;
var uploadSingleResume = function (fieldName) {
    return resumeMulterOption().single(fieldName);
};
exports.uploadSingleResume = uploadSingleResume;
// File filter for photos
var photoFileFilter = function (req, file, cb) {
    var filetypes = /jpeg|jpg|png/;
    var extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
    var mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    }
    else {
        cb(new appError_1.default('Error: Only images are allowed for the photo!'));
    }
};
// File filter for resumes
var resumeFileFilter = function (req, file, cb) {
    var filetypes = /pdf|doc|docx/;
    var extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
    var mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    }
    else {
        cb(new appError_1.default('Error: Only PDF, DOC, and DOCX files are allowed for the resume!'));
    }
};
// Initialize upload
var upload = (0, multer_1.default)({
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
    limits: { fieldSize: 5000000 }, //5MB limit
});
var uploadProfilePicAndResume = function (fields) {
    return upload.fields(fields);
};
exports.uploadProfilePicAndResume = uploadProfilePicAndResume;
//# sourceMappingURL=upload.middleWare.js.map