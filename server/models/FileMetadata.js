const mongoose = require('mongoose');

const fileMetadataSchema = new mongoose.Schema({
  accessId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  filePath: {
    type: String,
    required: true
  },
  allowedLat: {
    type: Number,
    required: true
  },
  allowedLng: {
    type: Number,
    required: true
  },
  radius: {
    type: Number,
    required: true,
    default: 100
  },
  verifiedAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const FileMetadata = mongoose.model('FileMetadata', fileMetadataSchema);

module.exports = FileMetadata;
