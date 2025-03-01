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
exports.Language = void 0;
var typeorm_1 = require('typeorm');
var language_1 = require('../enums/language');
var Account_1 = require('./Account');
var Language = /** @class */ (function () {
    function Language() {}
    __decorate(
        [
            (0, typeorm_1.PrimaryGeneratedColumn)(),
            __metadata('design:type', Number),
        ],
        Language.prototype,
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
                    return account.languages;
                },
                {
                    onDelete: 'CASCADE',
                },
            ),
            (0, typeorm_1.JoinColumn)({
                name: 'account_id',
                foreignKeyConstraintName: 'FK_LANGUAGE_ACCOUNT',
            }),
            __metadata('design:type', Account_1.Account),
        ],
        Language.prototype,
        'account',
        void 0,
    );
    __decorate(
        [
            (0, typeorm_1.Column)({ type: 'enum', enum: language_1.Language }),
            __metadata('design:type', String),
        ],
        Language.prototype,
        'name',
        void 0,
    );
    Language = __decorate([(0, typeorm_1.Entity)()], Language);
    return Language;
})();
exports.Language = Language;
//# sourceMappingURL=AccountLanguage.js.map
