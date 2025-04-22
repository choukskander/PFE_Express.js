// const jwt = require('jsonwebtoken');

// module.exports = (req, res, next) => {
//   // Récupérer le token depuis les en-têtes de la requête
//   const authHeader = req.header('Authorization');

//   // Vérifier si le header Authorization existe et commence par "Bearer "
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ error: 'Accès refusé. Token manquant ou incorrect.' });
//   }

//   // Extraire le token du header
//   const token = authHeader.split(' ')[1];

//   try {
//     // Vérifier et décoder le token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Vérifier que le token contient un ID utilisateur
//     if (!decoded.id) {
//       return res.status(400).json({ error: 'Token invalide : ID utilisateur manquant.' });
//     }

//     // Attacher les données décodées à l'objet de requête
//     req.user = decoded;

//     // Passer au middleware ou à la route suivante
//     next();
//   } catch (error) {
//     // Gérer les erreurs de validation du token
//     if (error.name === 'TokenExpiredError') {
//       return res.status(401).json({ error: 'Token expiré. Veuillez vous reconnecter.' });
//     }
//     if (error.name === 'JsonWebTokenError') {
//       return res.status(400).json({ error: 'Token invalide.' });
//     }
//     // Erreur inattendue
//     return res.status(500).json({ error: 'Erreur interne du serveur lors de la validation du token.' });
//   }
// };
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