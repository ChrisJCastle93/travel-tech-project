const { Schema, model } = require('mongoose');

const companySchema = Schema({
  name:  String,
  logo:  String,
  intro: String,
  pricing: String,
  types: String,
  usps: [String],
  website: String,
  admin: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: 'Review'
  }],
});

module.exports = model('Company', companySchema);