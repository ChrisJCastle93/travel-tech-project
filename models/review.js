const { Schema, model } = require('mongoose');

const reviewSchema = Schema({
  content: {
    title: String,
    title: String,
    title: String,
    title: String,
  },
  verified:  Boolean,
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company'
  }
});

module.exports = model('Review', reviewSchema);