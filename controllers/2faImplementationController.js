const mongoose = require('mongoose');
const User = require("../models/User");
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

// Generate a 6-digit 2FA code
const generate2FACode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate temporary token for 2FA verification
const generateTempToken = (id) => {
  return jwt.sign({ id, temp: true }, process.env.JWT_SECRET, { expiresIn: '10m' });
};

// Send 2FA code via email
exports.send2FACode = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'Utilisateur non trouvé.' });
  }

  const code = generate2FACode();
  user.twoFactorCode = code;
  user.twoFactorExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();

  const subject = 'Votre code de vérification à deux facteurs';
  const text = `Bonjour ${user.prenom} ${user.nom},\n\nVotre code de vérification à deux facteurs est : ${code}\nCe code expire dans 10 minutes.\n\nCordialement,\nL'équipe Rdv-Med`;
  const html = `
    <h2>Bonjour ${user.prenom} ${user.nom},</h2>
    <p>Votre code de vérification à deux facteurs est : <strong>${code}</strong></p>
    <p>Ce code expire dans 10 minutes.</p>
    <p>Cordialement,<br>L'équipe Rdv-Med</p>
  `;

  try {
    await sendEmail({ to: user.email, subject, text, html });
    const tempToken = generateTempToken(user._id);
    res.status(200).json({ message: 'Code 2FA envoyé.', tempToken });
  } catch (error) {
    console.error('Erreur lors de l\'envoi du code 2FA:', error);
    res.status(500).json({ message: 'Erreur lors de l\'envoi du code 2FA.' });
  }
});

// Verify 2FA code
exports.verify2FACode = asyncHandler(async (req, res) => {
  const { tempToken, code } = req.body;

  try {
    const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
    if (!decoded.temp) {
      return res.status(401).json({ message: 'Token temporaire invalide.' });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    if (user.twoFactorCode !== code || user.twoFactorExpires < Date.now()) {
      return res.status(400).json({ message: 'Code 2FA invalide ou expiré.' });
    }

    // Clear 2FA code after successful verification
    user.twoFactorCode = undefined;
    user.twoFactorExpires = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      _id: user._id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
      specialite: user.specialite,
      licenceProfessionnelle: user.licenceProfessionnelle,
      profileImage: user.profileImage,
      token,
    });
  } catch (error) {
    console.error('Erreur lors de la vérification du code 2FA:', error);
    res.status(401).json({ message: 'Non autorisé, token ou code invalide.' });
  }
});