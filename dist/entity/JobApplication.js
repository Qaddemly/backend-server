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
exports.JobApplication = void 0;
var typeorm_1 = require("typeorm");
var Job_1 = require("./Job");
var JobApplication = /** @class */ (function () {
    function JobApplication() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], JobApplication.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return Job_1.Job; }, function (job) { return job.job_applications; }, {
            onDelete: 'CASCADE',
        }),
        (0, typeorm_1.JoinColumn)({
            name: 'job_id',
            foreignKeyConstraintName: 'FK_JOB_APPLICATION_JOB',
        }),
        __metadata("design:type", Job_1.Job)
    ], JobApplication.prototype, "job", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
        __metadata("design:type", Date)
    ], JobApplication.prototype, "created_at", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' }),
        __metadata("design:type", Date)
    ], JobApplication.prototype, "updated_at", void 0);
    JobApplication = __decorate([
        (0, typeorm_1.Entity)()
    ], JobApplication);
    return JobApplication;
}());
exports.JobApplication = JobApplication;
//# sourceMappingURL=JobApplication.js.map