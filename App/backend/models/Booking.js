const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  id: { type: Number, required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  category: {
    type: String,
    enum: ['documents', 'electronics', 'furniture', 'clothing', 'antiques', 'crates', 'tools', 'sporting goods', 'other'],
    required: true,
  },
  // pending: when the booking is created
  // wait for payment: when the booking is confirmed and waiting for payment
  // Payment receieved. Order in process: when the booking is paid and on the way to be delivered
  // delivered: when the booking is delivered

  status: {
    type: String,
    enum: ['Pending', 'Wait for payment', 'Paid', 'Payment received. Order in process', 'Delivered'],
    required: true,
  },
  length: { type: Number, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  value: { type: Number, required: true },
  sendingDate: { type: Date, required: true },
  senderName: { type: String, required: true },
  senderCompany: { type: String, default: '' },
  senderEmail: { type: String, required: true },
  senderPhone: { type: String, required: true },
  senderReference: { type: String, default: '' },
  receiverName: { type: String, required: true },
  receiverCompany: { type: String, default: '' },
  receiverEmail: { type: String, required: true },
  receiverPhone: { type: String, required: true },
  duration: { type: Number, required: true }, 
  chargeableWeight: { type: Number, required: true },
  deliveryFee: { type: Number, required: true },
});

module.exports = mongoose.model('Booking', bookingSchema);
