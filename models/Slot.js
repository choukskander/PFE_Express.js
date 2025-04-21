const mongoose = require('mongoose');
const slotSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  status: { type: String, enum: ['available', 'booked'], default: 'available' },
});
module.exports = mongoose.model('Slot', slotSchema);