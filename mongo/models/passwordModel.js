const mongoose = require('mongoose');

const PasswordSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('UserPasswords', PasswordSchema);
