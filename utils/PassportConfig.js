const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20");
const User = require('../models/User');
const debug = require('debug')('passport:');
const oauth = {
    callbackURL:process.env.SERVER_URL+"/api/google/callback",
    clientID : process.env.CLIENT_ID,
    clientSecret : process.env.CLIENT_SECRET,
};

passport.serializeUser( (user, done) => {
    done(null, user);
});

passport.deserializeUser( (user, done) => {
    done(null, user);
});

passport.use(
  new GoogleStrategy(oauth, (accessToken, refreshToken, profile, done)=>{
    const profilePic = profile.photos[0].value;
    const name = profile.displayName;
    const email = profile.emails[0].value;
    User.findOneAndUpdate({email: email}, {
        email: email,
        name: name,
        dp: profilePic,
        isVerified: true,
        isGoogleLogin: true,
    },{upsert: true, new: true,}). then(()=>{
        return(null, user);
    }).catch((err)=>{
        return done(null, false, { error: "something went wrong" })
    });
  })
)