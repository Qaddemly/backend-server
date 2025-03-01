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
exports.Skill = void 0;
var typeorm_1 = require('typeorm');
var Account_1 = require('./Account');
var Skill = /** @class */ (function () {
    function Skill() {}
    __decorate(
        [
            (0, typeorm_1.PrimaryGeneratedColumn)(),
            __metadata('design:type', Number),
        ],
        Skill.prototype,
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
                    return account.skills;
                },
                {
                    onDelete: 'CASCADE',
                },
            ),
            (0, typeorm_1.JoinColumn)({
                name: 'account_id',
                foreignKeyConstraintName: 'FK_SKILL_ACCOUNT',
            }),
            __metadata('design:type', Account_1.Account),
        ],
        Skill.prototype,
        'account',
        void 0,
    );
    __decorate(
        [(0, typeorm_1.Column)('text'), __metadata('design:type', String)],
        Skill.prototype,
        'name',
        void 0,
    );
    Skill = __decorate([(0, typeorm_1.Entity)()], Skill);
    return Skill;
})();
exports.Skill = Skill;
//# sourceMappingURL=AccountSkill.js.map
