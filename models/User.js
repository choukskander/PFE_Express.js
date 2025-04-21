// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   nom: { type: String, required: true },
//   prenom: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: {
//     type: String,
//     enum: ['patient', 'internaute'],
//     required: true,
//   },
//   profileImage: { type: String },
//   specialite: { type: String }, // Champ pour les internautes
//   licenceProfessionnelle: { type: String }, // URL du fichier uploadé
//   validated: {
//     type: Boolean,
//     default: false,
//   },
// });

// module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true, trim: true },
    prenom: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['patient', 'internaute'], required: true },
    specialite: { type: String, trim: true },
    licenceProfessionnelle: { type: String },
    profileImage: { type: String },
    ville: { type: String, trim: true },
    localisation: { type: String, trim: true },
    validated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);