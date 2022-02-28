const express = require("express");
const router = express.Router();
const Review = require("../models/review");
const User = require("../models/user");
const Company = require("../models/company");
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard");

/* READ */
router.get("/", (req, res, next) => {
  Company.find()
    .then((reviews) => res.send(reviews))
    .catch((err) => console.log(err));
});

// router.get("/new", isLoggedIn, (req, res, next) => {
//   res.render("reviews/newreview", { user: req.user });
// });

// CREATE
// STILL NEED TO ATTRIBUTE TO COMPANY AND USER

// router.post("/new", isLoggedIn, (req, res, next) => {
router.post("/new", (req, res, next) => {
  const { name, logo, intro, pricing, type, usp, website } = req.body;
  console.log(req.body);
  // const id = req.user.id;
  if (!name || !logo || !intro || !pricing || !type || !usp || !website) {
    res.send("missing something");
    // return res.render("reviews/newreview", {
    //   user: req.user,
    //   errorMessage: "Please complete all sections",
    // });
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
      console.log('Saved', companyFromDB.profile.name, 'to database');
    })
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


// COMPANIES INDIVIDUAL PAGE

/* GET Individual Review Page */
router.get('/:id', (req, res, next) => {
  console.log('ACCESSED ROUTE YA KNOW')
  const { id } = req.params;
  Company.findById(id)
  .then(company => {
    console.log('rendering company profile')
    res.render('company-profile', { user: req.user, company });
  })
  .catch(err => console.log(err))
});

module.exports = router;
