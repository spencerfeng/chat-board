const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Channel = require('./channel');

const schema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  channel: {
    type: Schema.Types.ObjectId,
    ref: 'Channel',
    required: true
  }
});

module.exports = mongoose.model('Message', schema);