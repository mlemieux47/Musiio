const mongoose = require('mongoose');

const convertedFileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  convertedData: {
    type: Buffer,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ConvertedFile = mongoose.model('ConvertedFile', convertedFileSchema);

module.exports = ConvertedFile;