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
exports.Account = void 0;
var typeorm_1 = require("typeorm");
var Review_1 = require("./Review");
var HrEmployee_1 = require("./HrEmployee");
var FollowBusiness_1 = require("./FollowBusiness");
var JobApplication_1 = require("./JobApplication");
var Address_1 = require("./Address");
var Experience_1 = require("./Experience");
var Language_1 = require("./Language");
var Skill_1 = require("./Skill");
var Job_1 = require("./Job");
var Phone_1 = require("./Phone");
var Account = /** @class */ (function () {
    function Account() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], Account.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'text' }),
        __metadata("design:type", String)
    ], Account.prototype, "first_name", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'text' }),
        __metadata("design:type", String)
    ], Account.prototype, "last_name", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'text', unique: true }),
        __metadata("design:type", String)
    ], Account.prototype, "email", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'text', nullable: true }),
        __metadata("design:type", String)
    ], Account.prototype, "password", void 0);
    __decorate([
        (0, typeorm_1.Column)('date', { nullable: true }),
        __metadata("design:type", Date)
    ], Account.prototype, "date_of_birth", void 0);
    __decorate([
        (0, typeorm_1.Column)('text', { nullable: true }),
        __metadata("design:type", String)
    ], Account.prototype, "profile_picture", void 0);
    __decorate([
        (0, typeorm_1.Column)(function () { return Address_1.Address; }, { prefix: false }),
        __metadata("design:type", Address_1.Address)
    ], Account.prototype, "address", void 0);
    __decorate([
        (0, typeorm_1.Column)(function () { return Phone_1.Phone; }, { prefix: false }),
        __metadata("design:type", Phone_1.Phone)
    ], Account.prototype, "phone", void 0);
    __decorate([
        (0, typeorm_1.Column)('text', { nullable: true }),
        __metadata("design:type", String)
    ], Account.prototype, "resume", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: 'timestamptz',
            default: new Date(Date.now()),
        }),
        __metadata("design:type", Date)
    ], Account.prototype, "password_changed_at", void 0);
    __decorate([
        (0, typeorm_1.Column)('bool', { default: false }),
        __metadata("design:type", Boolean)
    ], Account.prototype, "is_activated", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return Experience_1.Experience; }, function (experience) { return experience.account; }, {
            cascade: true,
        }),
        __metadata("design:type", Array)
    ], Account.prototype, "experiences", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return Language_1.Language; }, function (language) { return language.account; }, {
            cascade: true,
        }),
        __metadata("design:type", Array)
    ], Account.prototype, "languages", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return Skill_1.Skill; }, function (skill) { return skill.account; }, { cascade: true }),
        __metadata("design:type", Array)
    ], Account.prototype, "skills", void 0);
    __decorate([
        (0, typeorm_1.ManyToMany)(function () { return JobApplication_1.JobApplication; }),
        (0, typeorm_1.JoinTable)({
            name: 'account_job_applications',
            joinColumn: { name: 'account_id', referencedColumnName: 'id' },
            inverseJoinColumn: {
                name: 'job_application_id',
                referencedColumnName: 'id',
            },
        }),
        __metadata("design:type", Array)
    ], Account.prototype, "job_applications", void 0);
    __decorate([
        (0, typeorm_1.ManyToMany)(function () { return Job_1.Job; }),
        (0, typeorm_1.JoinTable)({
            name: 'account_saved_jobs',
            joinColumn: { name: 'account_id', referencedColumnName: 'id' },
            inverseJoinColumn: { name: 'job_id', referencedColumnName: 'id' },
        }),
        __metadata("design:type", Array)
    ], Account.prototype, "saved_jobs", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return FollowBusiness_1.FollowBusiness; }, function (follow_business) { return follow_business.account; }, { cascade: true }),
        __metadata("design:type", Array)
    ], Account.prototype, "follow_businesses", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return Review_1.Review; }, function (review) { return review.account; }, { cascade: true }),
        __metadata("design:type", Array)
    ], Account.prototype, "reviews", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return HrEmployee_1.HrEmployee; }, function (hr_employee) { return hr_employee.account; }, {
            cascade: true,
        }),
        __metadata("design:type", Array)
    ], Account.prototype, "business_roles", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
        __metadata("design:type", Date)
    ], Account.prototype, "created_at", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' }),
        __metadata("design:type", Date)
    ], Account.prototype, "updated_at", void 0);
    Account = __decorate([
        (0, typeorm_1.Entity)()
    ], Account);
    return Account;
}());
exports.Account = Account;
//# sourceMappingURL=Account.js.map