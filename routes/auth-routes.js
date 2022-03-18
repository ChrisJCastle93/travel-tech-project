// The routes file will be defined in the routes/auth.routes.js, and we will set the necessary packages and code to signup in the application:

const { Router } = require("express");
const router = new Router();
const passport = require("passport");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard");
const filteredDomains = require("../public/javascripts/filteredDomains");
const nodemailer = require("nodemailer");
const nodemailerSetup = require('../public/javascripts/nodemailer');

// SIGNUP ROUTES, implemented with server-side validation on the email and password used. Users are also issued a verification code over email to verify their sign up.

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
  const characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let confirmationCode = "";
  for (let i = 0; i < 25; i++) {
    confirmationCode += characters[Math.floor(Math.random() * characters.length)];
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
        confirmationCode,
      })
        .then((user) => {
          console.log("new user created ", user.email);
          req.session.currentUser = user;
          res.redirect("/reviews/new");
          return nodemailerSetup();
        })
        .then((transporter) => {
          return transporter.sendMail({
            from: "Chris Castle <chrisjcastle93@gmail.com>",
            to: req.session.currentUser.email,
            subject: "TrustedTravelTech - Verify Your Email",
            text: confirmationCode,
            html: `<a href='https://www.trustedtraveltech.com/auth/confirm/${confirmationCode}'>Verify Email</a>`,
          });
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

// Route to verify email address - user clicks link in email, and this switches the boolean on verified in the User model from false to true;

router.get("/auth/confirm/:confirmCode", (req, res, next) => {
  const { confirmCode } = req.params;
  User.findOneAndUpdate({ confirmationCode: confirmCode }, { verified: true }, { new: true })
    .then((foundUser) => {
      req.session.currentUser = foundUser;
      req.session.success = "You are now verified.";
      res.redirect("/");
    })
    .catch((err) => console.log(err));
});

// LOGIN ROUTES - authed with Passport Local

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

// GOOGLE SSO ROUTES - PASSPORT

router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/auth/google/failure" }), function (req, res) {
  res.redirect("/");
});

// Logout route

router.get("/logout", (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
