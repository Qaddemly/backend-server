"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HrEmployee = void 0;
var typeorm_1 = require("typeorm");
var Business_1 = require("./Business");
var Account_1 = require("./Account");
var HrRole_1 = require("../enums/HrRole");
var HrEmployee = /** @class */ (function () {
    function HrEmployee() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], HrEmployee.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return Business_1.Business; }, function (business) { return business.hr_employees; }, {
            onDelete: 'CASCADE',
        }),
        (0, typeorm_1.JoinColumn)({
            name: 'business_id',
            foreignKeyConstraintName: 'FK_HR_EMPLOYEE_BUSINESS',
        }),
        __metadata("design:type", Business_1.Business)
    ], HrEmployee.prototype, "business", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return Account_1.Account; }, function (account) { return account.business_roles; }, {
            onDelete: 'CASCADE',
        }),
        (0, typeorm_1.JoinColumn)({
            name: 'account_id',
            foreignKeyConstraintName: 'FK_HR_EMPLOYEE_ACCOUNT',
        }),
        __metadata("design:type", Account_1.Account)
    ], HrEmployee.prototype, "account", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: 'enum',
            enum: HrRole_1.HrRole,
            default: HrRole_1.HrRole.HR,
        }),
        __metadata("design:type", String)
    ], HrEmployee.prototype, "role", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
        __metadata("design:type", Date)
    ], HrEmployee.prototype, "created_at", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' }),
        __metadata("design:type", Date)
    ], HrEmployee.prototype, "updated_at", void 0);
    HrEmployee = __decorate([
        (0, typeorm_1.Entity)()
    ], HrEmployee);
    return HrEmployee;
}());
exports.HrEmployee = HrEmployee;
//# sourceMappingURL=HrEmployee.js.map