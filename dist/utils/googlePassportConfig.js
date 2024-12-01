"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = __importDefault(require("passport-google-oauth20"));
const userModel_1 = __importDefault(require("../models/userModel"));
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findById(id);
    done(null, user);
}));
passport_1.default.use(new passport_google_oauth20_1.default.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URL,
}, 
// call back function
(accessToken, RefreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log(profile, 'a7aaaaaaaaaaaaa');
    let user = yield userModel_1.default.findOne({ googleId: profile.id });
    if (user) {
        //console.log("user found");
        done(null, user);
    }
    else {
        user = new userModel_1.default({
            firstName: profile._json.given_name,
            lastName: profile._json.family_name,
            email: profile.emails[0].value,
            googleId: profile.id,
            profilePicture: profile._json.picture,
            isActivated: true,
        });
        yield user.save({ validateBeforeSave: false });
        done(null, user);
    }
})));
