const mongoose = require('mongoose');
const appointmentSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  slot: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  zoomLink: { type: String },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Appointment', appointmentSchema);