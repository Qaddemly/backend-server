import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import User from '../models/userModel';
declare global {
    namespace Express {
        interface User {
            id?: any;
        }
    }
}

passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
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
            //console.log(profile);
            let user = await User.findOne({ googleId: profile.id });
            if (user) {
                //console.log("user found");
                done(null, user);
            } else {
                console.log(profile);
                user = new User({
                    firstName: profile._json.given_name,
                    lastName: profile._json.family_name,
                    email: profile.emails![0].value,
                    googleId: profile.id,
                    profilePicture: profile._json.picture,
                    isActivated: true,
                });
                await user.save({ validateBeforeSave: false });
                done(null, user);
            }
        },
    ),
);
