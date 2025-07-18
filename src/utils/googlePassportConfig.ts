import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import AccountTempData from '../models/accountModel';
import { AccountRepository } from '../Repository/Account/accountRepository';
import { Account } from '../entity/Account/Account';
declare global {
    namespace Express {
        interface User {
            id?: any;
            googleId?: any;
        }
    }
}

passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
    const user = await AccountRepository.findOneBy({ id: id as never });
    done(null, user);
});
passport.use(
    new GoogleStrategy.Strategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: process.env.GOOGLE_REDIRECT_URL!,
        },
        // call back function
        async (accessToken, RefreshToken, profile, done) => {
            let userTempData = await AccountTempData.findOne({
                googleId: profile.id,
            });
            if (userTempData) {
                console.log('user found');
                const user = await AccountRepository.findOneBy({
                    id: userTempData.accountId,
                });
                done(null, user);
            } else {
                const user = new Account();
                user.first_name = profile._json.given_name;
                user.last_name = profile._json.family_name;
                user.email = profile.emails![0].value;
                user.profile_picture = profile._json.picture;
                user.is_activated = true;
                const returnedUser = await AccountRepository.save(user);
                userTempData = await AccountTempData.create({
                    accountId: returnedUser.id,
                    googleId: profile.id,
                });
                done(null, user);
            }
        },
    ),
);
