const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware'); // Assurez-vous d'avoir ce middleware
const {
  getDoctorNotifications,
  getAdminNotifications,
  markNotificationAsRead,
} = require('../controllers/notificationController');

// Routes pour les médecins (internaute)
router.get('/doctor', authMiddleware, getDoctorNotifications);
router.put('/doctor/:notificationId/read', authMiddleware, markNotificationAsRead);

// Routes pour les admins
router.get('/admin', [authMiddleware, adminMiddleware], getAdminNotifications);
router.put('/admin/:notificationId/read', [authMiddleware, adminMiddleware], markNotificationAsRead);

module.exports = router;