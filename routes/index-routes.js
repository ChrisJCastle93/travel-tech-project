const express = require("express");
const Company = require("../models/company");
const User = require("../models/user");
const router = express.Router();
const { averagesObject, getOverallReviewScore } = require("../utils/averages");

// GET route for rendering the homepage. We get the companies from the DB and run the functions to calculate the averages.

router.get("/", (req, res, _next) => {
  Company.find()

    .populate("reviews")

    .lean()

    .then((companiesFromDb) => {
      companiesFromDb.forEach((company, index) => {
        if (company.reviews) {
          company.averages = averagesObject(company.reviews);
          company.overall = getOverallReviewScore(company.reviews);
        }
      });

      const companiesWithReviews = companiesFromDb.filter((company) => company.overall !== undefined);
      const companiesWithoutReviews = companiesFromDb.filter((company) => company.overall == undefined);

      companiesWithReviews.sort((a, b) => {
        return b.overall - a.overall;
      });

      const mergedArr = [...companiesWithReviews, ...companiesWithoutReviews];

      mergedArr.forEach((company, index) => {
        company.index = index + 1;
      });

      User.findOne({ _id: req.session?.passport?.user }).then((response) => {
        const passportUser = response;
        req.session.currentUser = passportUser;
        return res.render("index", { user: req.session.currentUser || passportUser, companies: mergedArr });
      });
    })
    .catch((err) => console.log(err));
});

module.exports = router;
