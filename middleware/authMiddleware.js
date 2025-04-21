const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Récupérer le token depuis les en-têtes de la requête
  const authHeader = req.header("Authorization");

  // Vérifier si le header Authorization existe et commence par "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Accès refusé. Token manquant ou incorrect." });
  }

  // Extraire le token du header
  const token = authHeader.split(" ")[1];

  try {
    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attacher les données décodées à l'objet de requête
    req.user = decoded;

    // Passer au middleware ou à la route suivante
    next();
  } catch (error) {
    // Gérer les erreurs de validation du token
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expiré. Veuillez vous reconnecter." });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(400).json({ error: "Token invalide." });
    }
    // Erreur inattendue
    return res.status(500).json({ error: "Erreur interne du serveur lors de la validation du token." });
  }
};

