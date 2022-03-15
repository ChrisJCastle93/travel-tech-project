const { Schema, model } = require("mongoose");

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
