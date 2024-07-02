const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pinSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  creator: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true
  },
}, { timestamps: true });

const Pin = mongoose.model('Pin', pinSchema);
module.exports = Pin;