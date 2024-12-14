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
exports.Business = void 0;
var typeorm_1 = require("typeorm");
var Review_1 = require("./Review");
var locationType_1 = require("../enums/locationType");
var HrEmployee_1 = require("./HrEmployee");
var FollowBusiness_1 = require("./FollowBusiness");
var Job_1 = require("./Job");
var Address_1 = require("./Address");
/**
 * TODO: add fields of CEO, FOUNDER, FOUNDED
 * TODO: remove specialities and add tags
 * TODO: phone number optional
 * TODO: email optional
 * TODO: website optional
 * */
var Business = /** @class */ (function () {
    function Business() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], Business.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)('text'),
        __metadata("design:type", String)
    ], Business.prototype, "name", void 0);
    __decorate([
        (0, typeorm_1.Column)('text'),
        __metadata("design:type", String)
    ], Business.prototype, "logo", void 0);
    __decorate([
        (0, typeorm_1.Column)('text'),
        __metadata("design:type", String)
    ], Business.prototype, "CEO", void 0);
    __decorate([
        (0, typeorm_1.Column)('text'),
        __metadata("design:type", String)
    ], Business.prototype, "founder", void 0);
    __decorate([
        (0, typeorm_1.Column)('date'),
        __metadata("design:type", Date)
    ], Business.prototype, "founded", void 0);
    __decorate([
        (0, typeorm_1.Column)(function () { return Address_1.Address; }, { prefix: false }),
        __metadata("design:type", Address_1.Address)
    ], Business.prototype, "address", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: 'enum',
            enum: locationType_1.LocationType,
            default: locationType_1.LocationType.Onsite,
        }),
        __metadata("design:type", String)
    ], Business.prototype, "location_type", void 0);
    __decorate([
        (0, typeorm_1.Column)('text'),
        __metadata("design:type", String)
    ], Business.prototype, "description", void 0);
    __decorate([
        (0, typeorm_1.Column)('integer'),
        __metadata("design:type", Number)
    ], Business.prototype, "company_size", void 0);
    __decorate([
        (0, typeorm_1.Column)('text'),
        __metadata("design:type", String)
    ], Business.prototype, "industry", void 0);
    __decorate([
        (0, typeorm_1.Column)('text', { nullable: true }),
        __metadata("design:type", String)
    ], Business.prototype, "website", void 0);
    __decorate([
        (0, typeorm_1.Column)('text'),
        __metadata("design:type", String)
    ], Business.prototype, "headquarter", void 0);
    __decorate([
        (0, typeorm_1.Column)('text', { nullable: true }),
        __metadata("design:type", String)
    ], Business.prototype, "email", void 0);
    __decorate([
        (0, typeorm_1.Column)('text', { nullable: true }),
        __metadata("design:type", String)
    ], Business.prototype, "phone", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return Review_1.Review; }, function (review) { return review.business; }, { cascade: true }),
        __metadata("design:type", Array)
    ], Business.prototype, "reviews", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return FollowBusiness_1.FollowBusiness; }, function (followBusiness) { return followBusiness.business; }, { cascade: true }),
        __metadata("design:type", Array)
    ], Business.prototype, "followers", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return HrEmployee_1.HrEmployee; }, function (hr_employee) { return hr_employee.business; }, {
            cascade: true,
        }),
        __metadata("design:type", Array)
    ], Business.prototype, "hr_employees", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return Job_1.Job; }, function (job) { return job.business; }, { cascade: true }),
        __metadata("design:type", Array)
    ], Business.prototype, "jobs", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
        __metadata("design:type", Date)
    ], Business.prototype, "created_at", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' }),
        __metadata("design:type", Date)
    ], Business.prototype, "updated_at", void 0);
    Business = __decorate([
        (0, typeorm_1.Entity)()
    ], Business);
    return Business;
}());
exports.Business = Business;
//# sourceMappingURL=Business.js.map