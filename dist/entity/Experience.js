'use strict';
var __decorate =
    (this && this.__decorate) ||
    function (decorators, target, key, desc) {
        var c = arguments.length,
            r =
                c < 3
                    ? target
                    : desc === null
                      ? (desc = Object.getOwnPropertyDescriptor(target, key))
                      : desc,
            d;
        if (
            typeof Reflect === 'object' &&
            typeof Reflect.decorate === 'function'
        )
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if ((d = decorators[i]))
                    r =
                        (c < 3
                            ? d(r)
                            : c > 3
                              ? d(target, key, r)
                              : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
var __metadata =
    (this && this.__metadata) ||
    function (k, v) {
        if (
            typeof Reflect === 'object' &&
            typeof Reflect.metadata === 'function'
        )
            return Reflect.metadata(k, v);
    };
Object.defineProperty(exports, '__esModule', { value: true });
exports.Experience = void 0;
var typeorm_1 = require('typeorm');
var employmentType_1 = require('../enums/employmentType');
var locationType_1 = require('../enums/locationType');
var Account_1 = require('./Account');
var Experience = /** @class */ (function () {
    function Experience() {}
    __decorate(
        [
            (0, typeorm_1.PrimaryGeneratedColumn)(),
            __metadata('design:type', Number),
        ],
        Experience.prototype,
        'id',
        void 0,
    );
    __decorate(
        [
            (0, typeorm_1.ManyToOne)(
                function () {
                    return Account_1.Account;
                },
                function (account) {
                    return account.experiences;
                },
                {
                    onDelete: 'CASCADE',
                },
            ),
            (0, typeorm_1.JoinColumn)({
                name: 'account_id',
                foreignKeyConstraintName: 'FK_EXPERIENCE_ACCOUNT',
            }),
            __metadata('design:type', Account_1.Account),
        ],
        Experience.prototype,
        'account',
        void 0,
    );
    __decorate(
        [(0, typeorm_1.Column)('text'), __metadata('design:type', String)],
        Experience.prototype,
        'job_title',
        void 0,
    );
    __decorate(
        [
            (0, typeorm_1.Column)({
                type: 'enum',
                enum: employmentType_1.EmploymentType,
            }),
            __metadata('design:type', String),
        ],
        Experience.prototype,
        'employment_type',
        void 0,
    );
    __decorate(
        [(0, typeorm_1.Column)('text'), __metadata('design:type', String)],
        Experience.prototype,
        'company_name',
        void 0,
    );
    __decorate(
        [(0, typeorm_1.Column)('text'), __metadata('design:type', String)],
        Experience.prototype,
        'location',
        void 0,
    );
    __decorate(
        [
            (0, typeorm_1.Column)({
                type: 'enum',
                enum: locationType_1.LocationType,
            }),
            __metadata('design:type', String),
        ],
        Experience.prototype,
        'location_type',
        void 0,
    );
    __decorate(
        [(0, typeorm_1.Column)('bool'), __metadata('design:type', Boolean)],
        Experience.prototype,
        'still_working',
        void 0,
    );
    __decorate(
        [(0, typeorm_1.Column)('date'), __metadata('design:type', Date)],
        Experience.prototype,
        'start_date',
        void 0,
    );
    __decorate(
        [
            (0, typeorm_1.Column)('date', { nullable: true }),
            __metadata('design:type', Date),
        ],
        Experience.prototype,
        'end_date',
        void 0,
    );
    Experience = __decorate([(0, typeorm_1.Entity)()], Experience);
    return Experience;
})();
exports.Experience = Experience;
//# sourceMappingURL=AccountExperience.js.map
