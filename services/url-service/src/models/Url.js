const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  shortCode: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  originalUrl: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: null,
  },
  clickCount: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  expiresAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Url', urlSchema);
