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
exports.getFiveReviewsOfBusiness = exports.getBusinessById = exports.getUserBusinesses = exports.updateBusiness = exports.createBusiness = void 0;
var Business_1 = require("../entity/Business");
var businessRepository_1 = require("../Repository/businessRepository");
var accountRepository_1 = require("../Repository/accountRepository");
var HrEmployee_1 = require("../entity/HrEmployee");
var HrRole_1 = require("../enums/HrRole");
var Address_1 = require("../entity/Address");
var appError_1 = __importDefault(require("../utils/appError"));
var hrEmployeeRepository_1 = require("../Repository/hrEmployeeRepository");
var logger_1 = require("../utils/logger");
/**
 * TODO: mark the Account that created the business as the owner.
 * TODO: make it possible for user to add hr_employees with their roles at Creation.
 * */
var createBusiness = function (createBusinessDto, accountId) { return __awaiter(void 0, void 0, void 0, function () {
    var account, business, address, hrEmployee, saved_business;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, accountRepository_1.AccountRepository.findOneBy({ id: accountId })];
            case 1:
                account = _a.sent();
                if (!account) {
                    logger_1.Logger.error('Account with ${accountId} do not exist in database');
                    throw new appError_1.default("Account with ".concat(accountId, " do not exist in database"), 500);
                }
                business = new Business_1.Business();
                business.name = createBusinessDto.name;
                business.logo = createBusinessDto.logo;
                business.CEO = createBusinessDto.CEO;
                business.founder = createBusinessDto.founder;
                business.founded = createBusinessDto.founded;
                address = new Address_1.Address();
                address.country = createBusinessDto.address.country;
                address.city = createBusinessDto.address.city;
                business.address = address;
                business.location_type = createBusinessDto.location_type;
                business.description = createBusinessDto.description;
                business.company_size = createBusinessDto.company_size;
                business.industry = createBusinessDto.industry;
                business.website = createBusinessDto.website;
                business.headquarter = createBusinessDto.headquarter;
                business.email = createBusinessDto.email;
                business.phone = createBusinessDto.phone;
                hrEmployee = new HrEmployee_1.HrEmployee();
                hrEmployee.business = business;
                hrEmployee.account = account;
                hrEmployee.role = HrRole_1.HrRole.OWNER;
                return [4 /*yield*/, businessRepository_1.BusinessRepository.save(business)];
            case 2:
                saved_business = _a.sent();
                return [4 /*yield*/, hrEmployeeRepository_1.HrEmployeeRepository.save(hrEmployee)];
            case 3:
                _a.sent();
                logger_1.Logger.info("Business ".concat(saved_business.id, " created successfully"));
                return [2 /*return*/, saved_business];
        }
    });
}); };
exports.createBusiness = createBusiness;
var updateBusiness = function (updateBusinessDTO, accountId, businessId) { return __awaiter(void 0, void 0, void 0, function () {
    var account, permissionToUpdate, business;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, accountRepository_1.AccountRepository.findOneBy({ id: accountId })];
            case 1:
                account = _a.sent();
                return [4 /*yield*/, hrEmployeeRepository_1.HrEmployeeRepository.checkPermission(accountId, businessId)];
            case 2:
                permissionToUpdate = _a.sent();
                if (!permissionToUpdate) {
                    logger_1.Logger.error('User does not have permission to update business');
                    throw new appError_1.default('User does not have permission to update business', 403);
                }
                return [4 /*yield*/, businessRepository_1.BusinessRepository.updateBusiness(updateBusinessDTO, businessId)];
            case 3:
                business = _a.sent();
                logger_1.Logger.info("Business ".concat(businessId, " updated successfully"));
                return [2 /*return*/, business];
        }
    });
}); };
exports.updateBusiness = updateBusiness;
var getUserBusinesses = function (accountId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, businessRepository_1.BusinessRepository.getBusinessOfAccount(accountId)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getUserBusinesses = getUserBusinesses;
var getBusinessById = function (businessId) { return __awaiter(void 0, void 0, void 0, function () {
    var business;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, businessRepository_1.BusinessRepository.findOneBy({ id: businessId })];
            case 1:
                business = _a.sent();
                if (!business) {
                    logger_1.Logger.error('Business not found');
                    throw new appError_1.default('Business not found', 404);
                }
                return [2 /*return*/, business];
        }
    });
}); };
exports.getBusinessById = getBusinessById;
var getFiveReviewsOfBusiness = function (businessId) { return __awaiter(void 0, void 0, void 0, function () {
    var business;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, businessRepository_1.BusinessRepository.findOneBy({ id: businessId })];
            case 1:
                business = _a.sent();
                if (!business) {
                    logger_1.Logger.error('Business not found');
                    throw new appError_1.default('Business not found', 404);
                }
                return [4 /*yield*/, businessRepository_1.BusinessRepository.getFiveReviewsOfBusiness(businessId)];
            case 2: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getFiveReviewsOfBusiness = getFiveReviewsOfBusiness;
//# sourceMappingURL=businessServices.js.map