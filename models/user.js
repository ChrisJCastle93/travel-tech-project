const { Schema, model } = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");

// User Schema for the users that are signing up and leaving reviews.

const userSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    googleId: { type: String },
    email: {
      type: String,
      sparse: true,
      required: [true, "Email is required."],
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    companyName: String,
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    password: String,
    confirmationCode: String,
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(findOrCreate);
module.exports = model("User", userSchema);
