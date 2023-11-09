// The routes file will be defined in the routes/auth.routes.js, and we will set the necessary packages and code to signup in the application:

const { Router } = require("express");
const router = new Router();
const passport = require("passport");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const { isLoggedOut } = require("../middleware/route-guard");
const nodemailerSetup = require("../utils/nodemailer");
const getNewConfirmationCode = require("../utils/confirmationCode");

// SIGNUP ROUTES, implemented with server-side validation on the email and password used. Users are also issued a verification code over email to verify their sign up.

router.get("/signup", isLoggedOut, (_req, res, _next) => res.render("auth/signup", { layout: false }));

router.post("/signup", isLoggedOut, (req, res, next) => {
  const { firstName, lastName, email, password, companyName } = req.body;

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

  if (!regex.test(password)) {
    res.status(500).render("auth/signup", { layout: false, errorMessage: "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter." });
    return;
  }

  if (!email || !password) {
    res.render("auth/signup", {
      layout: false,
      errorMessage: "Indicate username and password",
    });
    return;
  }

  const confirmationCode = getNewConfirmationCode();

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
          req.session.currentUser = user;
          res.redirect("/reviews/new");
          return nodemailerSetup();
        })

        .then((transporter) => {
          return transporter.sendMail({
            from: "Chris Castle",
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
        res.status(422).render("auth/signup", { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(422).render("auth/signup", {
          errorMessage: "Username and email need to be unique. Either username or email is already used.",
        });
      } else {
        next(err);
      }
    });
});

// Route to verify email address - user clicks link in email, and this switches the boolean on verified in the User model from false to true;

router.get("/auth/confirm/:confirmCode", (req, res, _next) => {
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

router.get("/login", isLoggedOut, (_req, res, _next) => {
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

router.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/auth/google/failure" }), function (_req, res) {
  res.redirect("/");
});

// Logout route

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
