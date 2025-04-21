const mongoose = require('mongoose');
const doctorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  specialite: { type: String },
  verified: { type: Boolean, default: false },
  certifications: [{ type: String }],
  reviews: [{ rating: Number, comment: String, patientId: String }],
});
module.exports = mongoose.model('Doctor', doctorSchema);