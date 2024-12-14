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
exports.FollowBusiness = void 0;
var typeorm_1 = require("typeorm");
var Business_1 = require("./Business");
var Account_1 = require("./Account");
var FollowBusiness = /** @class */ (function () {
    function FollowBusiness() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], FollowBusiness.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return Business_1.Business; }),
        (0, typeorm_1.JoinColumn)({
            name: 'business_id',
            foreignKeyConstraintName: 'FK_FOLLOW_BUSINESS_BUSINESS',
        }),
        __metadata("design:type", Business_1.Business)
    ], FollowBusiness.prototype, "business", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return Account_1.Account; }),
        (0, typeorm_1.JoinColumn)({
            name: 'account_id',
            foreignKeyConstraintName: 'FK_FOLLOW_BUSINESS_ACCOUNT',
        }),
        __metadata("design:type", Account_1.Account)
    ], FollowBusiness.prototype, "account", void 0);
    FollowBusiness = __decorate([
        (0, typeorm_1.Entity)()
    ], FollowBusiness);
    return FollowBusiness;
}());
exports.FollowBusiness = FollowBusiness;
//# sourceMappingURL=FollowBusiness.js.map