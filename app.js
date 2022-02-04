require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
// const sass = require('sass');
// Once the packages are installed, we have to require them in the app.js file:
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const flash = require("connect-flash");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// MONGOOSE SETUP

// to connect to DB: mongosh "mongodb+srv://chrisjcastle93:dougal22@cluster0.ey3wh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch((err) => {
    console.error("Error connecting to mongo", err);
  });

const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

// MODEL SETUP

const User = require("./models/user.js");
const Review = require("./models/review.js");
const Company = require("./models/company.js");

// INITIALIZE EXPRESS

const app = express();

const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false, // <== false if you don't want to save empty session object to the store
    cookie: {
      httpOnly: true,
      maxAge: 10060000, // 60 * 1000 ms === 1 min
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URL,
      mongoOptions: advancedOptions, // See below for details
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

// MIDDLEWARE SETUP

// DEFINING THE METHODS OF PASSPORT

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id)
    .then((user) => cb(null, user))
    .catch((error) => cb(error));
});

passport.use(
  new LocalStrategy(
    {
      passReqToCallback: true,
      usernameField: "email",
      passwordField: "password",
    },
    (req, email, password, next) => {
      // console.log(email, password)
      User.findOne({ email })
        .then((user) => {
          // console.log('USER: ', user)
          if (!user) {
            console.log("Username or password incorrect");
            return next(null, false, {
              message: "Username or password incorrect",
            });
          }
          if (bcrypt.compare(password, user.password)) {
            bcrypt
              .compare(password, user.password)
              .then((result) => console.log(result));
            return next(null, user);
          } else {
            console.log("2nd... USERNAME OR PASSWROD INCORRECT");
            return next(null, false, {
              message: "Username or password incorrect",
            });
          }
        })
        .catch((error) => {
          console.log(error);
          next(error);
        });
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "715802172124-m822aiov7h1g9bsqu1l7otumkbpbroou.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);

// Next up, we have to configure the session middleware. First of all, we have to configure the express-session, indicating which is the secret key it will use to be generated. Add the session right before the routes middleware (toward the end of app.js)

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(flash());
app.use(express.static(path.join(__dirname, "public")));

// Express View engine setup

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

// default value for title local

app.locals.title = "ResTechRater";

// Last, but not least, we will have to define the routes in the app.js file. We will mount our authentication routes on the / path.

// ROUTERS

const index = require("./routes/index");
app.use("/", index);

const router = require("./routes/auth-routes");

app.use("/", router);

app.use(function (req, res, next) {
  res.status(404).render("404");
});

module.exports = app;
