const express = require("express");
const router = express.Router();
const Review = require("../models/review");
const User = require("../models/user");
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard')
const ratingModule1 = require('../public/javascripts/script')

/* READ */
router.get("/new", isLoggedIn, (req, res, next) => {
  res.render("reviews/newreview", { user: req.user });
});

router.get("/", (req, res, next) => {
  Review.find()
    .then((reviews) => res.send(reviews))
    .catch((err) => console.log(err));
});

// CREATE
// STILL NEED TO ATTRIBUTE TO COMPANY AND USER

router.post("/new", isLoggedIn, (req, res, next) => {
  const { overallScore, features, customerSupport, distribution, proBullets, conBullets, reviewTitle } = req.body;
  const id = req.user.id;
  if (!overallScore || !features || !customerSupport || !distribution || !proBullets || !conBullets || !reviewTitle) {
    return res.render("reviews/newreview", {
      user: req.user,
      errorMessage: "Please complete all sections",
    });
  }
  Review.create({
    owner: id,
    content: {
      overallScore,
      features,
      customerSupport,
      distribution,
      proBullets,
      conBullets,
      reviewTitle,
    },
  })
    .then((reviewFromDB) => {
      // console.log(reviewFromDB)
      return User.find(reviewFromDB.owner)
    })
    .then(user => console.log(user))
    .catch((err) => console.log(err));
});

// UPDATE
router.post("/:id/edit", isLoggedIn, (req, res, next) => {
  const { id } = req.params;
  const { overallScore, features, customerSupport, distribution, proBullets, conBullets, reviewTitle } = req.body;
  Review.findOneAndUpdate(
    id,
    {
      content: {
        overallScore,
        features,
        customerSupport,
        distribution,
        proBullets,
        conBullets,
        reviewTitle,
      },
    },
    { new: true }
  )
    .then((reviewFromDB) => {
      console.log(reviewFromDB.id, "updated");
      res.redirect("/"); // could change to user profile, need to pass in success message somehow.
    })
    .catch((err) => console.log(err));
});

// DELETE
router.post("/:id/delete", isLoggedIn, (req, res, next) => {
  console.log("accessed delete route");
  const { id } = req.params;
  Review.findOneAndDelete(id)
    .then((deletedUser) => {
      console.log("Deleted user:", deletedUser.email);
      res.redirect("/"); // could change to user profile, need to pass in success message somehow.
    })
    .catch((err) => {
      console.log(err);
      res.render("/user-profile", { errorMessage: "User could not be deleted. Please contact support." });
    });
});

module.exports = router;
