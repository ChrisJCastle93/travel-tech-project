const { Schema, model } = require("mongoose");

const companySchema = Schema({
  profile: {
    name: String,
    logo: String,
    intro: String,
    pricing: String,
    types: String,
    usp: [String],
    website: String,
  },
  // admin: {
  //   type: Schema.Types.ObjectId,
  //   ref: "User",
  // },
    verified: {
    type: Boolean,
    default: false
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

module.exports = model("Company", companySchema);
