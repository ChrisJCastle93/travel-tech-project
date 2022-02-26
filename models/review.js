const { Schema, model } = require("mongoose");

const contentSchema = new Schema({
    reviewTitle: String,
    overallScore: Number,
    features: Number,
    easyToUse: Number,
    customerSupport: Number,
    valueForMoney: Number,
    distribution: Number,
    proBullets: [String],
    conBullets: [String],
});

const reviewSchema = new Schema({
  content: contentSchema,
  // verified: {
  //   type: Boolean,
  //   default: false
  // },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: "Company",
  },
});

module.exports = model("Review", reviewSchema);
