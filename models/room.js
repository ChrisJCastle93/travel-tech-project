const { Schema, model } = require('mongoose');

const roomSchema = Schema({
  name:  String,
  desc:  String,
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = model('Room', roomSchema);