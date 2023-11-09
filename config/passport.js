const passport = require("passport");
const LocalStrategy = require("passport-local");
const GoogleStrategy = require("passport-google-oauth20");
const User = require("../models/user");
const bcrypt = require("bcrypt");

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id)
    .then((user) => {
      cb(null, user);
    })
    .catch((error) => cb(error));
});

// PASSPORT LOCAL STRAT TO AUTHENTICATE LOGIN

passport.use(
  new LocalStrategy(
    {
      passReqToCallback: true,
      usernameField: "email",
      passwordField: "password",
    },
    (req, email, password, done) => {

      User.findOne({ email })
        .then((user) => {
          console.log(".then");

          if (!user) {
            req.session.error = "Invalid Login Details";
            console.log("email is not registered");
            return done(null, false, {
              message: "That email is not registered",
            });
          }

          console.log("compairing with bcrypt");

          bcrypt.compare(password, user.password).then((result) => {
            if (result) {
              console.log("should successfully login");
              req.session.currentUser = user;
              req.session.success = "Successful Login";
              return done(null, user);
            } else {
              req.session.error = "Invalid Login Details";
              console.log("incorrect pass");
              return done(null, false, {
                message: "Password incorrect",
              });
            }
          });
        })
        .catch((error) => {
          console.log(error);
          done(error);
        });
    }
  )
);

// PASSPORT GOOGLE STRAT TO FACILITATE SSO

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.googleClientId,
      clientSecret: process.env.googleSecret,
      callbackURL: "/auth/google/callback",
      passReqToCallback: true,
    },
    function (req, accessToken, refreshToken, profile, cb) {
      User.findOrCreate(
        {
          // googleId: profile.id,
          email: profile.emails[0].value,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
        },
        function (err, user) {
          req.session.currentUser = user;
          return cb(err, user);
        }
      );
    }
  )
);
