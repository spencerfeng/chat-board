const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Message = require('./message');

const schema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  lastViewedChannel: {
    type: Schema.Types.ObjectId,
    ref: 'Channel',
    required: false
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('User', schema);
