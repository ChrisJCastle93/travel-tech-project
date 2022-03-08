const mongoose = require("mongoose");
const User = require("../models/user");
const Review = require("../models/review");
const Company = require("../models/company");

const seedDb = () => {
  let comp;
  let userReviewer;
  let rev;
  User.deleteMany({})
    .then(() => {
      return Review.deleteMany({});
    })
    .then(() => {
      return Company.deleteMany({});
    })
    .then(() => {
      return       User.create({
        firstName: "Chris",
        lastName: "Castle",
        email: "chrisjcastle93@gmail.com",
        companyName: "Urban Adventures",
        password: "$2b$10$BDYdLC8AfS6vvYOr7Xuj/egqfIJpztpSAkS8a1I2RN5JhGP6V8j8y",
      })
    })
    .then((userInDb) => {
      userReviewer = userInDb.id;
      return Company.create({
        profile: {
          name: "bookingkit",
          logo: "https://img1.oastatic.com/img2/23902507/max/bookingkit_logo_02-.png",
          intro: "We make it easy and frictionless, helping you focus on what’s truly important. Running a business is challenging enough without tedious, complicated, often repetitive manual processes. For that there’s bookingkit: the smart, all-in-one software solution especially built for promoting, managing & operating Tours, Activities and Attractions.",
          pricing: "There are three tiers available, each offering different features. Prices start $39 per month plus transaction fees of 3% plus 50¢ per ticket sold.",
          type: "Reservation System",
          usp: ["Native support available in English, Spanish, Italian, French & German", "manage all of your bookings, availabilities and cancellations from one central platform", "Chosen by thousands of European providers."],
          website: "www.bookingkit.com",
        },
      });
    })
    .then((companyInDb) => {
      comp = companyInDb.id;
      return Review.create({
        content: {
          reviewTitle: "REVIEW TITLE",
          overallScore: 4,
          features: 3,
          easyToUse: 4,
          customerSupport: 2,
          valueForMoney: 5,
          distribution: 3,
          proBullets: ["PRO1", "PRO2", "PRO3"],
          conBullets: ["CON1", "CON2", "CON3"],
        },
        owner: userReviewer,
        companyBeingReviewed: comp,
      });
    })
    .then((reviewInDb) => {
      rev = reviewInDb.id;
      return Company.findByIdAndUpdate(comp, { $push: { reviews: reviewInDb.id } }, { new: true });
    })
    .then((updatedCompany) => {
      return User.findByIdAndUpdate(userReviewer, { $push: { reviews: rev } }, { new: true });
    })
    .then(() => console.log("DB SEEDED"))
    .catch((err) => console.log(err));
};

module.exports = seedDb;
