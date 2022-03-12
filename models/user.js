// models/user.js. In the models folder create User.model.js file inside it. In models/User.model.js, we will define the Schema with username and password as follows:

// Added googleID as a property to Schema to enable OAuth

const { Schema, model } = require('mongoose');
const findOrCreate = require("mongoose-findorcreate");

const userSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    googleId: {type: String},
    email: {
      type: String,
      sparse: true,
      required: [true, 'Email is required.'],
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    companyName: String,
    reviews: [{
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }],
    password: String,
  },
  {
    timestamps: true
  }
);

userSchema.plugin(findOrCreate);
module.exports = model('User', userSchema);
