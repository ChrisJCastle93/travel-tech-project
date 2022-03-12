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
const seedDb = require("./db/seed");

require("dotenv").config();

// MONGOOSE SETUP

const app_name = require("./package.json").name;
const debug = require("debug")(`${app_name}:${path.basename(__filename).split(".")[0]}`);

// MODEL SETUP

const User = require("./models/user.js");
const Review = require("./models/review.js");
const Company = require("./models/company.js");

// INITIALIZE EXPRESS

const app = express();
seedDb();

const clientP = mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((m) => {
    console.log(`Connected to Mongo! Database name: "${m.connections[0].name}"`);
    return m.connection.getClient();
  })
  .catch((err) => {
    console.error("Error connecting to mongo", err);
  });

mongoose.set("useCreateIndex", true);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 10060000, // 60 * 1000 ms === 1 min
      // expires: false,
    },
    store: MongoStore.create({
      clientPromise: clientP,
      dbName: "prod",
      stringify: false,
      autoRemove: "interval",
      autoRemoveInterval: 1,
    }),
  })
);

// MIDDLEWARE SETUP

app.use(function (req, res, next) {
  const err = req.session.error;
  const msg = req.session.notice;
  const success = req.session.success;
  delete req.session.error;
  delete req.session.success;
  delete req.session.notice;
  if (err) res.locals.error = err;
  if (msg) res.locals.notice = msg;
  if (success) res.locals.success = success;
  next();
});

// DEFINING THE METHODS OF PASSPORT
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, cb) => {
  // console.log('SERIALIZING USER', user)
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id)
    .then((user) => {
      // console.log('DESERIALIZING USER', user)
      cb(null, user)
    })
    .catch((error) => cb(error));
});

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
          if (!user) {
            req.session.error = "Invalid Login Details";
            return done(null, false, {
              message: "That email is not registered",
            });
          }
          bcrypt.compare(password, user.password).then((result) => {
            if (result) {
              req.session.currentUser = user;
              req.session.success = "Successful Login";
              return done(null, user);
            } else {
              req.session.error = "Invalid Login Details";
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
          // user.firstName
          req.session.currentUser = user;
          return cb(err, user);
        }
      )
      // User.findOneAndUpdate( { email: profile.emails[0].value }, { firstName: 'John' })
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
hbs.registerHelper("times", function (n, block) {
  var accum = "";
  for (var i = 0; i < n; ++i) accum += block.fn(i);
  return accum;
});
// app.engine('handlebars', hbs.engine);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

// default value for title local

app.locals.title = "TrustedTravelTech";

// Last, but not least, we will have to define the routes in the app.js file. We will mount our authentication routes on the / path.

// ROUTERS

const index = require("./routes/index");
app.use("/", index);

const auth = require("./routes/auth-routes");
app.use("/", auth);

const reviews = require("./routes/review-routes");
app.use("/reviews", reviews);

const companies = require("./routes/company-routes");
app.use("/companies", companies);

app.use(function (req, res, next) {
  res.status(404).render("404");
});

module.exports = app;
