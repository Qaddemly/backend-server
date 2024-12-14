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
exports.Job = void 0;
var typeorm_1 = require("typeorm");
var locationType_1 = require("../enums/locationType");
var employmentType_1 = require("../enums/employmentType");
var Business_1 = require("./Business");
var JobApplication_1 = require("./JobApplication");
var Job = /** @class */ (function () {
    function Job() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], Job.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)('text'),
        __metadata("design:type", String)
    ], Job.prototype, "title", void 0);
    __decorate([
        (0, typeorm_1.Column)('text'),
        __metadata("design:type", String)
    ], Job.prototype, "description", void 0);
    __decorate([
        (0, typeorm_1.Column)('text'),
        __metadata("design:type", String)
    ], Job.prototype, "location", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: 'enum',
            enum: locationType_1.LocationType,
            default: locationType_1.LocationType.Onsite,
        }),
        __metadata("design:type", String)
    ], Job.prototype, "location_type", void 0);
    __decorate([
        (0, typeorm_1.Column)('text', { array: true }),
        __metadata("design:type", String)
    ], Job.prototype, "skills", void 0);
    __decorate([
        (0, typeorm_1.Column)('float'),
        __metadata("design:type", Number)
    ], Job.prototype, "salary", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: 'enum',
            enum: employmentType_1.EmploymentType,
            default: employmentType_1.EmploymentType.FullTime,
        }),
        __metadata("design:type", String)
    ], Job.prototype, "employee_type", void 0);
    __decorate([
        (0, typeorm_1.Column)('text', { array: true }),
        __metadata("design:type", Array)
    ], Job.prototype, "keywords", void 0);
    __decorate([
        (0, typeorm_1.Column)('int'),
        __metadata("design:type", Number)
    ], Job.prototype, "experience", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return Business_1.Business; }, function (business) { return business.jobs; }, {
            onDelete: 'CASCADE',
        }),
        (0, typeorm_1.JoinColumn)({
            name: 'business_id',
            foreignKeyConstraintName: 'FK_JOB_BUSINESS',
        }),
        __metadata("design:type", Business_1.Business)
    ], Job.prototype, "business", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return JobApplication_1.JobApplication; }, function (job_application) { return job_application.job; }, {
            cascade: true,
        }),
        __metadata("design:type", Array)
    ], Job.prototype, "job_applications", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
        __metadata("design:type", Date)
    ], Job.prototype, "created_at", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' }),
        __metadata("design:type", Date)
    ], Job.prototype, "updated_at", void 0);
    Job = __decorate([
        (0, typeorm_1.Entity)()
    ], Job);
    return Job;
}());
exports.Job = Job;
//# sourceMappingURL=Job.js.map