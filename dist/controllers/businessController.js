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
exports.deleteBusiness = exports.getFiveReviewsOfBusiness = exports.getUserBusinesses = exports.updateBusiness = exports.getBusinessById = exports.searchBusinessByName = exports.createBusiness = void 0;
var express_async_handler_1 = __importDefault(require("express-async-handler"));
var businessServices = __importStar(require("./../services/businessServices"));
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
exports.createBusiness = (0, express_async_handler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var business;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, businessServices.createBusiness(req.body, req.user.id)];
            case 1:
                business = _a.sent();
                res.status(201).json({
                    status: 'success',
                    message: 'Business created successfully',
                    business: business,
                });
                return [2 /*return*/];
        }
    });
}); });
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
exports.searchBusinessByName = (0, express_async_handler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/];
}); }); });
/**
 * Get a detailed business profile by the business name
 * TODO: talk with frontend about what they need to display in the business profile
 * */
exports.getBusinessById = (0, express_async_handler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var business;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, businessServices.getBusinessById(Number(req.params.businessId))];
            case 1:
                business = _a.sent();
                res.status(200).json({
                    status: 'success',
                    business: business,
                });
                return [2 /*return*/];
        }
    });
}); });
exports.updateBusiness = (0, express_async_handler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var business;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, businessServices.updateBusiness(req.body, req.user.id, Number(req.params.businessId))];
            case 1:
                business = _a.sent();
                res.status(200).json({
                    status: 'success',
                    message: 'Business updated successfully',
                    business: business,
                });
                return [2 /*return*/];
        }
    });
}); });
exports.getUserBusinesses = (0, express_async_handler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var businesses;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, businessServices.getUserBusinesses(req.user.id)];
            case 1:
                businesses = _a.sent();
                res.status(200).json({
                    status: 'success',
                    businesses: businesses,
                });
                return [2 /*return*/];
        }
    });
}); });
exports.getFiveReviewsOfBusiness = (0, express_async_handler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var reviews;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, businessServices.getFiveReviewsOfBusiness(Number(req.params.businessId))];
            case 1:
                reviews = _a.sent();
                res.status(200).json({
                    status: 'success',
                    reviews: reviews,
                });
                return [2 /*return*/];
        }
    });
}); });
exports.deleteBusiness = (0, express_async_handler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/];
}); }); });
//# sourceMappingURL=businessController.js.map