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
    ], Account.prototype, "firstName", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'text' }),
        __metadata("design:type", String)
    ], Account.prototype, "lastName", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'text', unique: true }),
        __metadata("design:type", String)
    ], Account.prototype, "email", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'text' }),
        __metadata("design:type", String)
    ], Account.prototype, "password", void 0);
    __decorate([
        (0, typeorm_1.Column)('date', { nullable: true }),
        __metadata("design:type", Date)
    ], Account.prototype, "dateOfBirth", void 0);
    __decorate([
        (0, typeorm_1.Column)('text', { nullable: true }),
        __metadata("design:type", String)
    ], Account.prototype, "profilePicture", void 0);
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
    ], Account.prototype, "passwordChangedAt", void 0);
    __decorate([
        (0, typeorm_1.Column)('bool', { default: true }),
        __metadata("design:type", Boolean)
    ], Account.prototype, "isActivated", void 0);
    Account = __decorate([
        (0, typeorm_1.Entity)()
    ], Account);
    return Account;
}());
exports.Account = Account;
//# sourceMappingURL=Account.js.map