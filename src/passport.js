const passport = require("passport")
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const User = require("./DB/models/User");

let UserService = require("./services/UserService");
UserService = new UserService()

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
        done(null, user);
});

passport.use(new GoogleStrategy({
        clientID:"548185768048-sshoppdomogdd3knon71i8dg04c5vfeh.apps.googleusercontent.com",
        clientSecret:"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",
        callbackURL: "http://localhost:3000/google/callback",
        passReqToCallback   : true
    },
    async function(request, accessToken, refreshToken, profile, done) {
        let user = await User.findOne({googleId: profile.id});
        if(user) {
                console.log("Exitst")
                user.accessToken = accessToken;
                user.currentlyLoggedIn = true;
                await user.save()
                return done(null, profile);
        }
        user = new User({
                googleId: profile.id,
                name: `${profile.given_name} ${profile.family_name}`,
                email: profile.email,
                accessToken: accessToken,
                currentlyLoggedIn: true
        })
        await user.save()
        return done(null, profile);
    }
));