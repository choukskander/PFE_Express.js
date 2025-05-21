// const mongoose = require('mongoose');
// const symptomSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   symptoms: { type: String, required: true },
//   prediction: { type: String },
//   severity: { type: Number },
//   date: { type: Date, default: Date.now },
// });
// module.exports = mongoose.model('Symptom', symptomSchema);
const mongoose = require('mongoose');

const symptomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  language: { type: String, required: true, enum: ['en', 'fr', 'ar'] }
});

module.exports = mongoose.model('Symptom', symptomSchema);