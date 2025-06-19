const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['internaute', 'patient', 'admin'], required: true },
  specialite: { type: String },
  licenceProfessionnelle: { type: String },
  validated: { type: Boolean, default: false },
  profileImage: { type: String },
  localisation: { type: String },
  ville: { type: String },
  horaires: {
    type: Map,
    of: new mongoose.Schema({
      ouverture: { type: String },
      fermeture: { type: String },
      ferme: { type: Boolean, default: false },
    }),
    default: {
      lundi: { ouverture: '09:00', fermeture: '19:00', ferme: false },
      mardi: { ouverture: '09:00', fermeture: '19:00', ferme: false },
      mercredi: { ouverture: '09:00', fermeture: '19:00', ferme: false },
      jeudi: { ouverture: '09:00', fermeture: '19:00', ferme: false },
      vendredi: { ouverture: '09:00', fermeture: '19:00', ferme: false },
      samedi: { ouverture: '09:00', fermeture: '13:00', ferme: false },
      dimanche: { ouverture: '', fermeture: '', ferme: true },
    },
  },
  twoFactorCode: { type: String }, // New field for 2FA code
  twoFactorExpires: { type: Number }, // New field for 2FA code expiration
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);