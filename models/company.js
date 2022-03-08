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
  // admin: {
  //   type: Schema.Types.ObjectId,
  //   ref: "User",
  // },
  verified: {
    type: Boolean,
    default: false,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

module.exports = model("Company", companySchema);
