const express = require("express");
const router = express.Router();
const Review = require("../models/review");
const User = require("../models/user");
const Company = require("../models/company");
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard");
const sendTweet = require("../utils/twitter");

// Route to render new review form. We get the companies from the DB so that the users can select the relevant one from a dropdown in the review form.

router.get("/new", isLoggedIn, (req, res, next) => {
  Company.find().then((companies) => {
    res.render("reviews/newreview", { user: req.session.currentUser, companies, layout: false });
  });
});

// Post route for submitting the review. The frontend form is dynamic - if a user signed up through Google and didn't submit thier companyName they'll be shown that on the form. If we receive that info, we want to update the user in the DB with it. Then we go on to create the review, and then attribute that review to the company it was left about.

router.post("/new", isLoggedIn, async (req, res, next) => {
  const { companyBeingReviewed, overallScore, features, customerSupport, valueForMoney, easyToUse, distribution, proBullets, conBullets, reviewTitle } = req.body;
  const { _id } = req.session.currentUser;

  if (!overallScore || !features || !customerSupport || !distribution || !valueForMoney || !easyToUse || !proBullets || !conBullets || !reviewTitle || !companyBeingReviewed) {
    Company.find()
      .then((companies) => {
        return res.render("reviews/newreview", { user: req.session.currentUser, errorMessage: "Please complete all sections", companies, layout: false });
      })
      .catch((err) => console.log(err));
  } else {
    try {
      filteredProBullets = proBullets.filter((bullet) => !bullet);
      filteredConBullets = conBullets.filter((bullet) => !bullet);

      if (req.body.companyName) {
        User.findByIdAndUpdate(_id, { companyName: req.body.companyName }, { new: true })
          .then((userInDb) => console.log(userInDb))
          .catch((err) => console.log(err));
      }

      const reviewFromDB = await Review.create({
        content: {
          overallScore,
          easyToUse,
          valueForMoney,
          features,
          customerSupport,
          distribution,
          proBullets: filteredProBullets,
          conBullets: filteredConBullets,
          reviewTitle,
        },
        owner: _id,
        companyBeingReviewed: companyBeingReviewed,
      });

      const companyFromDB = await Company.findByIdAndUpdate(companyBeingReviewed, { $push: { reviews: reviewFromDB._id } }, { new: true });

      sendTweet(reviewFromDB, companyFromDB);

      User.findByIdAndUpdate(req.session.currentUser, { $push: { reviews: reviewFromDB._id } }, { new: true });

      req.session.success = "Successfully left review";

      res.redirect(`/companies/${companyFromDB.id}`);
      
    } catch (err) {

      console.log(err);

    }
  }
});

module.exports = router;
