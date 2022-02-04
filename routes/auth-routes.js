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

router.get("/signup", (req, res, next) => res.render("auth/signup", { layout: false } ));

router.post("/signup", (req, res, next) => {
  console.log(req.body);
  const { firstName, lastName, email, password, companyName } = req.body;
  if (!email || !password) {
    res.render("auth/signup", {
      errorMessage: "Indicate username and password",
    });
    return;
  }
  User.findOne({ email })
    .then((user) => {
      if (user !== null) {
        res.render("auth/signup", { message: "The username already exists" });
        return;
      }
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
      const newUser = new User({
        firstName: firstName,
        lastName: lastName,
        email: email,
        verified: false,
        companyName: companyName,
        password: hashPass,
      });
      newUser
        .save()
        .then(() => {
          console.log('new user created');
          res.redirect("/");
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
});

// Then, we have to define the routes and the corresponding functionality associated with each one. The GET route has one mission, and that is to load the view we will use. Meanwhile, the POST will contain the Passport functionality. The routes are in routes/auth-routes.js, and we have to add the following: In the routes/auth-route.js, let’s add failureFlash option:

// LOGIN ROUTES

router.get('/login', (req, res, next) => res.render('auth/login', { layout: false }));

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

// AIRBNB ROUTES

// router.get("/rooms", ensureLogin.ensureLoggedIn(), (req, res, next) => {
//   const { _id } = req.user;
//   Room.find({ owner: _id })
//   .populate('owner')
//   .then((myRooms) => res.render("rooms", { user: req.user,  rooms: myRooms }))
//   .catch((err) => next(err));
// });

// // AIRBNB NEW ROOMS

// router.get("/newroom", ensureLogin.ensureLoggedIn(), (req, res, next) => {
//   res.render("newroom", { user: req.user });
// });

// router.post("/newroom", ensureLogin.ensureLoggedIn(), (req, res, next) => {
//   const { name, desc } = req.body;
//   const { _id } = req.user; // <-- Id from the logged user
//   Room.create({
//     name,
//     desc,
//     owner: _id,
//   })
//     .then(() => res.redirect("/rooms"))
//     .catch((err) => next(err));
// });

// LEAVE A NEW REVIEW

// router.get("/newreview", ensureLogin.ensureLoggedIn(), (req, res, next) => {
//   res.render("newreview", { user: req.user });
// });

router.get('/newreview', (req, res, next) => {
    res.render('newreview', { user: req.user });
  });

// router.post("/newroom", ensureLogin.ensureLoggedIn(), (req, res, next) => {
//   const { name, desc } = req.body;
//   const { _id } = req.user; // <-- Id from the logged user
//   Room.create({
//     name,
//     desc,
//     owner: _id,
//   })
//     .then(() => res.redirect("/rooms"))
//     .catch((err) => next(err));
// });

// Passport exposes a logout() function on req object that can be called from any route handler which needs to terminate a login session. We will declare the logout route in the auth-routes.js file as it follows:

router.get("/logout", (req, res) => {
  console.log('=============');
  console.log('user logged out');
  console.log('=============');
  req.logout();
  res.redirect("/");
});

module.exports = router;
