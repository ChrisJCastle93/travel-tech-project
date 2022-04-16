const express = require("express");
const router = express.Router();
const Review = require("../models/review");
const Company = require("../models/company");
const { isLoggedIn } = require("../middleware/route-guard");
const { averagesObject, getOverallReviewScore } = require("../utils/averages");

// Created an individual company page where you could see reviews left for that company. It require accessing the Company and User collections, sorting and deep-populating the query before calculating the averages and displaying all reviews.

router.get("/:id", (req, res, _next) => {
  const { id } = req.params;

  let comp;

  Company.findById(id)

    .then((company) => {
      comp = company;
      return Review.find({ companyBeingReviewed: company })
        .sort({ createdAt: -1 })
        .populate([{ path: "companyBeingReviewed" }, { path: "owner" }]);
    })

    .then((reviews) => {
      const averagesObj = averagesObject(reviews);
      const overallReviewScore = getOverallReviewScore(reviews);
      res.render("companyprofile", { user: req.session.currentUser, reviews, averagesObj, noReviews: reviews.length, overallReviewScore, comp });
    })

    .catch((err) => console.log(err));
});

// CRUD routes to be able to viwe and add companies to DB using Postman.

router.get("/", (_req, res, _next) => {
  Company.find()
    .then((companies) => res.send(companies))
    .catch((err) => console.log(err));
});

router.post("/new", (req, res, _next) => {
  const { name, logo, intro, pricing, type, usp, website } = req.body;

  if (!name || !logo || !intro || !pricing || !type || !usp || !website) {
    return res.render("reviews/new", {
      user: req.session.currentUser,
      errorMessage: "Please complete all fields",
    });
  }

  Company.create({
    profile: {
      name,
      logo,
      intro,
      pricing,
      type,
      usp,
      website,
    },
  })

    .then((companyFromDB) => {
      console.log("Saved", companyFromDB.profile.name, "to database");
    })

    .catch((err) => console.log(err));
});

router.post("/:id/edit", isLoggedIn, (req, res, _next) => {
  const { id } = req.params;

  const { overallScore, features, customerSupport, valueForMoney, easyToUse, distribution, proBullets, conBullets, reviewTitle } = req.body;

  Review.findOneAndUpdate(
    id,
    {
      content: {
        overallScore,
        features,
        customerSupport,
        easyToUse,
        distribution,
        valueForMoney,
        proBullets,
        conBullets,
        reviewTitle,
      },
    },
    { new: true }
  )

    .then((reviewFromDB) => {
      res.redirect("/");
    })

    .catch((err) => console.log(err));
});

router.post("/:id/delete", isLoggedIn, (req, res, _next) => {
  const { id } = req.params;

  Review.findOneAndDelete(id)

    .then((deletedUser) => {
      console.log("Deleted user:", deletedUser.email);
      res.redirect("/");
    })

    .catch((err) => {
      console.log(err);
      res.render("/user-profile", { errorMessage: "User could not be deleted. Please contact support." });
    });
});

module.exports = router;
