const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  deletable: {
    type: Boolean,
    default: true
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('Channel', schema);