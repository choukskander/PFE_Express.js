const mongoose = require('mongoose');

const diseaseSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Suppression de unique: true pour éviter les conflits
  description: { type: String, required: true },
  precautions: [{ type: String }],
  language: { type: String, enum: ['en', 'fr', 'ar'], required: true }
}, { 
  // Ajout d'un index composé pour garantir l'unicité de name + language
  indexes: [{ key: { name: 1, language: 1 }, unique: true }]
});

module.exports = mongoose.model('Disease', diseaseSchema);