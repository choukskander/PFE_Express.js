const asyncHandler = require('express-async-handler');

const adminMiddleware = asyncHandler(async (req, res, next) => {
  if (req.user.role !== 'admin') {
    console.log('Access denied. User role:', req.user.role);
    return res.status(403).json({ message: 'Accès refusé. Seuls les administrateurs peuvent effectuer cette action.' });
  }
  next();
});

module.exports = adminMiddleware;