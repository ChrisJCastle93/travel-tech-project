// The routes file will be defined in the routes/auth.routes.js, and we will set the necessary packages and code to signup in the application:

const { Router } = require("express");
const router = new Router();
const passport = require("passport");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard");
const filteredDomains = require("../public/javascripts/filteredDomains");

// SIGNUP

router.get("/signup", isLoggedOut, (req, res, next) => res.render("auth/signup", { layout: false }));

router.post("/signup", isLoggedOut, (req, res, next) => {
  const { firstName, lastName, email, password, companyName } = req.body;
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.status(500).render("auth/signup", { layout: false, errorMessage: "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter." });
    return;
  }
  if (filteredDomains.indexOf(email.split("@")[1]) !== -1) {
    res.status(500).render("auth/signup", { layout: false, errorMessage: "Email needs to be a professional email address." });
    return;
  }
  if (!email || !password) {
    console.log("USERNAME OR PASSWORD MISSING");
    res.render("auth/signup", {
      layout: false,
      errorMessage: "Indicate username and password",
    });
    return;
  }
  User.findOne({ email })
    .then((user) => {
      if (user !== null) {
        console.log("USERNAME ALREADY EXISTS IN DB");
        res.render("auth/signup", {
          layout: false,
          errorMessage: "There's already an account registered with this email",
        });
        return;
      }
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
      User.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        verified: false,
        companyName: companyName,
        password: hashPass,
      })
        .then((user) => {
          console.log("new user created ", user.email);
          req.session.currentUser = user;
          res.redirect("/reviews/new");
        })
        .catch((err) => next(err));
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        console.log("FAILED SERVER SIDE VALIDATION");
        res.status(500).render("auth/signup", { errorMessage: error.message });
      } else if (error.code === 11000) {
        console.log("FAILED SERVER SIDE VALIDATION - NOT UNIQUE");
        res.status(500).render("auth/signup", {
          errorMessage: "Username and email need to be unique. Either username or email is already used.",
        });
      } else {
        next(err);
      }
    });
});

// Then, we have to define the routes and the corresponding functionality associated with each one. The GET route has one mission, and that is to load the view we will use. Meanwhile, the POST will contain the Passport functionality. The routes are in routes/auth-routes.js, and we have to add the following: In the routes/auth-route.js, let’s add failureFlash option:

// LOGIN ROUTES

router.get("/login", isLoggedOut, (req, res, next) => {
  res.render("auth/login", { layout: false });
});

router.post(
  "/login",
  isLoggedOut,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    passReqToCallback: true,
  })
);

// PRIVATE ROUTES

router.get("/private-page", isLoggedIn, (req, res, next) => {
  res.render("private", { user: req.session.currentUser });
});

// GOOGLE ROUTES

router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: '/auth/google/failure' }), function (req, res) {
  res.redirect("/");
});

// Passport exposes a logout() function on req object that can be called from any route handler which needs to terminate a login session. We will declare the logout route in the auth-routes.js file as it follows:

router.get("/logout", isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
