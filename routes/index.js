const express = require("express");
const Company = require("../models/company");
const router = express.Router();
const { averagesObject, getOverallReviewScore } = require("../public/javascripts/averages");

/* GET home page */
router.get("/", (req, res, next) => {
  Company.find()
    .populate("reviews")
    .then((companiesFromDb) => {
      const companies = companiesFromDb.map((company, index) => {
        // console.log(company.reviews)
        company.averages = averagesObject(company.reviews);
        company.overall = getOverallReviewScore(company.reviews);
        company.index = index + 1;
        return company;
      });
      companies.sort((a, b) => {
        return a.overall - b.overall;
      });
      res.render("index", { user: req.session.currentUser, companies });
    })
    .catch((err) => console.log(err));
});

module.exports = router;
