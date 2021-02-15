const express = require('express');
const cors = require('cors');

const passport = require('passport');
const FacebookStrategy = require('passport-facebook');
const GoogleStrategy = require('passport-google-oauth20');
const InstagramStrategy = require('passport-instagram');

const config = require('./config/config')
const PassportKeys = require('./config/passport_keys')

const PORT = process.env.PORT;

const app = express();
app.use(cors());

passport.serializeUser((user,cb) => {
    cb(null,user);
})

passport.deserializeUser((user,cb) => {
    cb(null,user);
})

//Facebook Strategy
passport.use(new FacebookStrategy({
   clientID: PassportKeys.FACEBOOK.clientID,
   clinetSecret: PassportKeys.FACEBOOK.clientSecret,
   callbackURL: "/auth/facebook/callback"
  },
  (accessToken,refreshToken,profile,cb) => {
      console.log('profile',profile)
      return AbortController(null,profile);
  }
))

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: PassportKeys.GOOGLE.clientID,
    clientSecret: PassportKeys.GOOGLE.clientSecret,
    callbackURL: "/auth/google/callback"
},
(accessToken, refreshToken, profile, cb) => {
    console.log(chalk.blue(JSON.stringify(profile)));
    user = { ...profile };
    return cb(null, profile);
}));

// Instagram Strategy
passport.use(new InstagramStrategy({
    clientID: PassportKeys.INSTAGRAM.clientID,
    clientSecret: PassportKeys.INSTAGRAM.clientSecret,
    callbackURL: "/auth/instagram/callback"
},
(accessToken, refreshToken, profile, cb) => {
    console.log(chalk.blue(JSON.stringify(profile)));
    user = { ...profile };
    return cb(null, profile);
}));

app.use(passport.initialize());

app.get("/auth/facebook", passport.authenticate("facebook"));

app.get("/auth/facebook/callback",
        passport.authenticate("facebook"),
        (req, res) => {
    res.redirect("/profile");
});

app.get("/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"]
}));

app.get("/auth/google/callback",
    passport.authenticate("google"),
        (req, res) => {
            console.log('in')
            res.send("done")
        });

app.get("/auth/instagram", passport.authenticate("instagram"));

app.get("/auth/instagram/callback",
    passport.authenticate("instagram"),
        (req, res) => {
            res.redirect("/profile");
        });

app.get('/',(req,res) => {
    console.log('deployed successfully')
    res.send('deployed successfully')
})

app.listen(PORT,() => {
    console.log(`Server is up on port ${PORT}`);
})