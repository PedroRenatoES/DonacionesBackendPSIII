const { Schema, model } = require('mongoose');

const imageSchema = new Schema({
  filename: { type: String, required: true },
  contentType: { type: String, required: true },
  data: { type: String, required: true }
}, { timestamps: true });

module.exports = model('Image', imageSchema);