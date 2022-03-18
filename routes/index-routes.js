const express = require("express");
const Company = require("../models/company");
const router = express.Router();
const { averagesObject, getOverallReviewScore } = require("../public/javascripts/averages");

// GET route for rendering the homepage. We get the companies from the DB and run the functions to calculate the averages.

router.get("/", (req, res, next) => {
  Company.find()
    .populate("reviews")
    .then((companiesFromDb) => {
      const companies = companiesFromDb.map((company, index) => {
        company.averages = averagesObject(company.reviews);
        company.overall = getOverallReviewScore(company.reviews);
        company.index = index + 1;
        return company;
      });
      companies.sort((a, b) => {
        return b.overall - a.overall;
      });
      res.render("index", { user: req.session.currentUser, companies });
    })
    .catch((err) => console.log(err));
});

module.exports = router;
