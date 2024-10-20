const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, // This ensures the email is stored in lowercase
  },
  password: { type: String },
  cartData: { type: Object },
  date: { type: Date, default: Date.now },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
});

module.exports = mongoose.model('User', userSchema);
