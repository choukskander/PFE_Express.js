// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   nom: { type: String, required: true },
//   prenom: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: {
//     type: String,
//     enum: ["patient", "internaute"],
//     required: true,
//   },
//   validated: {
//     type: Boolean,
//     default: false,
//   },
// });

// module.exports = mongoose.model("User", userSchema);
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['patient', 'internaute'],
    required: true,
  },
  specialite: { type: String }, // Champ pour les internautes
  licenceProfessionnelle: { type: String }, // URL du fichier uploadé
  validated: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('User', userSchema);