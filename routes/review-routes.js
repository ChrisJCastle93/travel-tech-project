const express = require("express");
const router = express.Router();
const Review = require("../models/review");
const User = require("../models/user");
const Company = require("../models/company");
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard");
const sendTweet = require("../public/javascripts/twitter");

// Route to render new review form. We get the companies from the DB so that the users can select the relevant one from a dropdown in the review form.

router.get("/new", isLoggedIn, (req, res, next) => {
  Company.find().then((companies) => {
    res.render("reviews/newreview", { user: req.session.currentUser, companies, layout: false });
  });
});

// Post route for submitting the review. The frontend form is dynamic - if a user signed up through Google and didn't submit thier companyName they'll be shown that on the form. If we receive that info, we want to update the user in the DB with it. Then we go on to create the review, and then attribute that review to the company it was left about.

router.post("/new", isLoggedIn, (req, res, next) => {
  let rev;
  const { companyBeingReviewed, overallScore, features, customerSupport, valueForMoney, easyToUse, distribution, proBullets, conBullets, reviewTitle } = req.body;
  const { _id } = req.session.currentUser;
  if (!overallScore || !features || !customerSupport || !distribution || !valueForMoney || !easyToUse || !proBullets || !conBullets || !reviewTitle || !companyBeingReviewed) {
    Company.find().then((companies) => {
      return res.render("reviews/newreview", { user: req.session.currentUser, errorMessage: "Please complete all sections", companies, layout: false });
    });
  }
  if (req.body.companyName) {
    console.log("req.body.com exists");
    User.findByIdAndUpdate(_id, { companyName: req.body.companyName }, { new: true })
      .then((userInDb) => console.log(userInDb))
      .catch((err) => console.log(err));
  }
  Review.create({
    content: {
      overallScore,
      easyToUse,
      valueForMoney,
      features,
      customerSupport,
      distribution,
      proBullets,
      conBullets,
      reviewTitle,
    },
    owner: _id,
    companyBeingReviewed: companyBeingReviewed,
  })
    .then((reviewFromDB) => {
      rev = reviewFromDB;
      return Company.findByIdAndUpdate(companyBeingReviewed, { $push: { reviews: reviewFromDB._id } }, { new: true });
    })
    .then((company) => {
      sendTweet(rev, company);
      req.session.success = "Successfully left review";
      res.redirect(`/companies/${company.id}`);
    })
    .catch((err) => console.log(err));
});

// I established routes to update and delete reviews, but de-prioritized this before launching the MVP.

// // UPDATE
// router.post("/:id/edit", isLoggedIn, (req, res, next) => {
//   const { id } = req.params;
//   const { overallScore, features, customerSupport, distribution, proBullets, conBullets, reviewTitle } = req.body;
//   Review.findOneAndUpdate(
//     id,
//     {
//       content: {
//         overallScore,
//         features,
//         customerSupport,
//         distribution,
//         proBullets,
//         conBullets,
//         reviewTitle,
//       },
//     },
//     { new: true }
//   )
//     .then((reviewFromDB) => {
//       res.redirect("/"); // could change to user profile, need to pass in success message somehow.
//     })
//     .catch((err) => console.log(err));
// });

// // DELETE
// router.post("/:id/delete", isLoggedIn, (req, res, next) => {
//   const { id } = req.params;
//   Review.findOneAndDelete(id)
//     .then((deletedUser) => {
//       res.redirect("/"); // could change to user profile, need to pass in success message somehow.
//     })
//     .catch((err) => {
//       console.log(err);
//       res.render("/user-profile", { errorMessage: "User could not be deleted. Please contact support." });
//     });
// });

module.exports = router;
