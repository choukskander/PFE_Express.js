const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require("../models/User");
const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;

  // Vérifier la présence du token dans les en-têtes
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log('Token reçu:', token);

      // Décoder le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token décodé:', decoded);

      // Récupérer l'utilisateur depuis la base de données
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        console.log('Utilisateur non trouvé pour ID:', decoded.id);
        return res.status(401).json({ message: 'Utilisateur non trouvé.' });
      }

      // Assigner les informations de l'utilisateur à req.user
      req.user = user;
      console.log('Utilisateur authentifié:', req.user); // Confirmer les données de l'utilisateur

      next();
    } catch (error) {
      console.error('Erreur dans authMiddleware:', error.message);
      return res.status(401).json({ message: 'Non autorisé, token invalide.' });
    }
  } else {
    console.log('Aucun token fourni dans les en-têtes');
    return res.status(401).json({ message: 'Non autorisé, aucun token fourni.' });
  }
});

module.exports = authMiddleware;