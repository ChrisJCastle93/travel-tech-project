// The routes file will be defined in the routes/auth.routes.js, and we will set the necessary packages and code to signup in the application:

const { Router } = require("express");
const router = new Router();
const passport = require("passport");
const User = require("../models/user");
// const Room = require("../models/room"); 
const bcrypt = require("bcrypt"); // secures passwords. We specified a hash of 10 characters here.
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");

// SIGNUP

// router.get("/login", (req, res, next) => {
//   console.log('=================')
//   console.log(req.session.id)
//   console.log('=================')
//   res.render("index")
// });
  

router.get("/signup", (req, res, next) => res.render("auth/signup", { layout: false } ));

router.post("/signup", (req, res, next) => {
  const { firstName, lastName, email, password, companyName } = req.body;
  if(!email || !password) {
      console.log('USERNAME OR PASSWORD MISSING');
      res.render("auth/signup", {
        errorMessage: "Indicate username and password",
      });
      return;
    }
    User.findOne({ email })
    .then((user) => {
      if (user !== null) {
        console.log('USERNAME ALREADY EXISTS IN DB');
        res.render("auth/signup", { errorMessage: "The username already exists" });
        return;
      }
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
      User
        .create({
          firstName: firstName,
          lastName: lastName,
          email: email,
          verified: false,
          companyName: companyName,
          password: hashPass,
        })
        .then((user) => {
          console.log('new user created ', user.email);
          res.redirect("/");
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
});

// Then, we have to define the routes and the corresponding functionality associated with each one. The GET route has one mission, and that is to load the view we will use. Meanwhile, the POST will contain the Passport functionality. The routes are in routes/auth-routes.js, and we have to add the following: In the routes/auth-route.js, let’s add failureFlash option:

// LOGIN ROUTES

router.get('/login', (req, res, next) => {
  res.locals.message = req.flash('message');
  console.log(res.locals)
  res.render('auth/login', { layout: false })
});

router.post('/login', passport.authenticate("local",{
  successRedirect : '/',
  failureRedirect: '/login',
  passReqToCallback: true
}));

// PRIVATE ROUTES

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  res.render('private', { user: req.user });
});

// GOOGLE ROUTES

router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    console.log('=============');
    console.log('successfully logged in with Google');
    console.log('=============');
    res.redirect('/');
  });


// router.get('/newreview', (req, res, next) => {
//     res.render('newreview', { user: req.user });
//   });

// Passport exposes a logout() function on req object that can be called from any route handler which needs to terminate a login session. We will declare the logout route in the auth-routes.js file as it follows:

router.get("/logout", (req, res) => {
  console.log('=============');
  console.log('user logged out');
  console.log('=============');
  req.logout();
  res.redirect("/");
});

module.exports = router;
