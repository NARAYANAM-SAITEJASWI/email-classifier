const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmailSchema = new Schema({
  email: { type: String, required: true },
  subject: { type: String },
  body: { type: String },
  createdAt: { type: Date, default: Date.now },
  opened: { type: Boolean, default: false },
  openedAt: { type: Date, default: null }
});

module.exports = mongoose.model('Email', EmailSchema);
