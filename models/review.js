const { Schema, model } = require("mongoose");

// Review Schema for the reviews being left by users about companies. It references the both the review and company schema.

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

const reviewSchema = new Schema(
  {
    content: contentSchema,
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    companyBeingReviewed: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Review", reviewSchema);


