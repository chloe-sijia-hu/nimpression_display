const mongoose = require('mongoose');

const truckSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  info: { type: String },
  gcw: { type: Number },
  image: { type: String },
  long: { type: Number },
  high: { type: Number },
  wide: { type: Number },
  capacity: { type: Number },
  available: { type: Boolean, required: true },
});

module.exports = mongoose.model('Truck', truckSchema);
