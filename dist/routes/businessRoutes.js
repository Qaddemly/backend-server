"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.businessRoute = void 0;
var express_1 = __importDefault(require("express"));
var businessController = __importStar(require("../controllers/businessController"));
var upload_middleWare_1 = require("../middlewares/upload.middleWare");
var authServices_1 = require("../services/authServices");
exports.businessRoute = express_1.default.Router();
exports.businessRoute.post('/', authServices_1.protect, (0, upload_middleWare_1.uploadSingleImage)('logo'), upload_middleWare_1.resizeBusinessLogo, businessController.createBusiness);
exports.businessRoute.get('/userBusinesses', authServices_1.protect, businessController.getUserBusinesses);
exports.businessRoute.get('/', authServices_1.protect, businessController.searchBusinessByName);
exports.businessRoute.get('/profile/:businessId', authServices_1.protect, businessController.getBusinessById);
exports.businessRoute.put('/:businessId', authServices_1.protect, (0, upload_middleWare_1.uploadSingleImage)('logo'), upload_middleWare_1.resizeBusinessLogo, businessController.updateBusiness);
exports.businessRoute.get('/profile/reviewsFive/:businessId', authServices_1.protect, businessController.getFiveReviewsOfBusiness);
exports.businessRoute.delete('/:id', authServices_1.protect, businessController.deleteBusiness);
//# sourceMappingURL=businessRoutes.js.map