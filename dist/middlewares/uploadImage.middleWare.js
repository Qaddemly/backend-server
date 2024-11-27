"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadSingleImage = void 0;
const multer_1 = __importDefault(require("multer"));
const appError_1 = __importDefault(require("../utils/appError"));
const storage = multer_1.default.memoryStorage();
const imageMulterOption = () => {
    const fileFilter = (req, file, cb) => {
        if (file.mimetype.split('/')[0] === 'image') {
            cb(null, true);
        }
        else
            cb(new appError_1.default('only images is allowed'));
    };
    const upload = (0, multer_1.default)({ storage: storage, fileFilter: fileFilter });
    return upload;
};
const uploadSingleImage = (fieldName) => {
    return imageMulterOption().single(fieldName);
};
exports.uploadSingleImage = uploadSingleImage;
