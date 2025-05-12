const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');

// Récupérer les notifications d’un médecin
exports.getDoctorNotifications = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Vérifier que l'utilisateur est un médecin
  if (req.user.role !== 'internaute') {
    return res.status(403).json({ message: 'Accès refusé. Seuls les médecins peuvent voir leurs notifications.' });
  }

  const notifications = await Notification.find({ 
    recipientId: userId,
    type: { $in: ['appointment_booked', 'status_updated', 'meeting_link'] }
  })
    .populate('appointmentId', 'date time patientId')
    .populate('appointmentId.patientId', 'nom prenom')
    .sort({ createdAt: -1 });

  res.status(200).json(notifications);
});

// Récupérer les notifications d’un admin
exports.getAdminNotifications = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Vérifier que l'utilisateur est un admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès refusé. Seuls les admins peuvent voir leurs notifications.' });
  }

  const notifications = await Notification.find({ 
    recipientId: userId,
    type: 'doctor_validation'
  })
    .populate('doctorId', 'nom prenom email')
    .sort({ createdAt: -1 });

  res.status(200).json(notifications);
});

// Marquer une notification comme lue (utilisé par les médecins et les admins)
exports.markNotificationAsRead = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;
  const userId = req.user.id;

  // Vérifier que l'utilisateur est un médecin ou un admin
  if (!['internaute', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Accès refusé. Vous n’êtes pas autorisé à modifier les notifications.' });
  }

  const notification = await Notification.findById(notificationId);
  if (!notification) {
    return res.status(404).json({ message: 'Notification non trouvée.' });
  }

  // Vérifier que la notification appartient à l'utilisateur
  if (notification.recipientId.toString() !== userId) {
    return res.status(403).json({ message: 'Accès refusé. Cette notification ne vous appartient pas.' });
  }

  notification.read = true;
  await notification.save();

  res.status(200).json({ message: 'Notification marquée comme lue.', notification });
});