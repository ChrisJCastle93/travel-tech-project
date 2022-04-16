const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const logger = require("morgan");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const flash = require("connect-flash");
const clientPromise = require('./db/init');
require("dotenv").config();

// MONGOOSE SETUP

const app_name = require("./package.json").name;
const debug = require("debug")(`${app_name}:${path.basename(__filename).split(".")[0]}`);

// MODEL SETUP

const User = require("./models/user.js");

// INITIALIZE EXPRESS

const app = express();

// ESTABLISH DB CONNECTION and SETTING UP SESSION AND COOKIES

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 10060000,
    },
    store: MongoStore.create({
      clientPromise: clientPromise,
      dbName: "prod",
      stringify: false,
      autoRemove: "interval",
      autoRemoveInterval: 1,
    }),
  })
);

// MIDDLEWARE SETUP

// Displaying errors and success messages. They're attached to the req object and passed to the views.

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

// PASSPORT SET UP

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport.js')

// Configuring all of the basic middleware - bodyparser, cookieparser, serving static files from the public folder

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

// Setting views file and setting hbs as the views engine

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

// Setting default value for title local

app.locals.title = "TrustedTravelTech";

// Last, but not least, we will have to define the routes in the app.js file. We will mount our authentication routes on the / path.

// ROUTERS

const index = require("./routes/index-routes");
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
