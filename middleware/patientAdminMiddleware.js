const asyncHandler = require('express-async-handler');

const patientAdminMiddleware = asyncHandler(async (req, res, next) => {
  if (!['patient', 'admin', 'internaute'].includes(req.user.role)) {
    console.log('Access denied. User role:', req.user.role);
    return res.status(403).json({ message: 'Accès refusé. Seuls les patients, administrateurs et médecins peuvent effectuer cette action.' });
  }
  next();
});

module.exports = patientAdminMiddleware;