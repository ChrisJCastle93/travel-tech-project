const { Schema, model } = require("mongoose");

// Company Schema for the companies being reviewed. It references the review schema.

const companySchema = Schema({
  profile: new Schema({
    name: String,
    logo: String,
    intro: String,
    pricing: String,
    type: String,
    usp: [String],
    website: String,
  }),
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

module.exports = model("Company", companySchema);
