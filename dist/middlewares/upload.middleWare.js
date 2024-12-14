"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resizeBusinessLogo = exports.uploadProfilePicAndResume = exports.uploadSingleResume = exports.uploadSingleImage = void 0;
var multer_1 = __importDefault(require("multer"));
var path_1 = __importDefault(require("path"));
var appError_1 = __importDefault(require("../utils/appError"));
var express_async_handler_1 = __importDefault(require("express-async-handler"));
var fs_1 = __importDefault(require("fs"));
var sharp_1 = __importDefault(require("sharp"));
var storage = multer_1.default.memoryStorage();
var imageMulterOption = function () {
    var fileFilter = function (req, file, cb) {
        // console.log(file);
        if (file.mimetype.split('/')[0] === 'image') {
            cb(null, true);
        }
        else
            cb(new appError_1.default('only images is allowed'));
    };
    return (0, multer_1.default)({ storage: storage, fileFilter: fileFilter });
};
var resumeMulterOption = function () {
    var fileFilter = function (req, file, cb) {
        console.log(file.mimetype);
        cb(null, true);
        // if (file.mimetype.split('/')[0] === 'image') {
        // } else cb(new AppError('only images is allowed'));
    };
    return (0, multer_1.default)({ storage: storage, fileFilter: fileFilter });
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
exports.resizeBusinessLogo = (0, express_async_handler_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var outputFileName, outputFilePath;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.file)
                    return [2 /*return*/, next()];
                outputFileName = "business-logo-".concat(req.body.name, "-").concat(Date.now(), ".jpeg");
                outputFilePath = "src/uploads/businesses/".concat(outputFileName);
                // Ensure the directory exists
                if (!fs_1.default.existsSync(path_1.default.dirname(outputFilePath))) {
                    fs_1.default.mkdirSync(path_1.default.dirname(outputFilePath), { recursive: true });
                }
                return [4 /*yield*/, (0, sharp_1.default)(req.file.buffer)
                        .resize(300, 300)
                        .toFormat('jpeg')
                        .jpeg({ quality: 90 })
                        .toFile(outputFilePath)];
            case 1:
                _a.sent();
                req.body.logo = outputFileName;
                next();
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=upload.middleWare.js.map