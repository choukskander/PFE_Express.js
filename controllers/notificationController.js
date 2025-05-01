const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');

// Récupérer les notifications d’un médecin
exports.getNotifications = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Vérifier que l'utilisateur est un médecin
  if (req.user.role !== 'internaute') {
    return res.status(403).json({ message: 'Accès refusé. Seuls les médecins peuvent voir leurs notifications.' });
  }

  const notifications = await Notification.find({ recipientId: userId })
    .populate('appointmentId', 'date time patientId')
    .populate('appointmentId.patientId', 'nom prenom')
    .sort({ createdAt: -1 });

  res.status(200).json(notifications);
});

// Marquer une notification comme lue
exports.markNotificationAsRead = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;
  const userId = req.user.id;

  // Vérifier que l'utilisateur est un médecin
  if (req.user.role !== 'internaute') {
    return res.status(403).json({ message: 'Accès refusé. Seuls les médecins peuvent modifier leurs notifications.' });
  }

  const notification = await Notification.findById(notificationId);
  if (!notification) {
    return res.status(404).json({ message: 'Notification non trouvée.' });
  }

  // Vérifier que la notification appartient au médecin
  if (notification.recipientId.toString() !== userId) {
    return res.status(403).json({ message: 'Accès refusé. Cette notification ne vous appartient pas.' });
  }

  notification.read = true;
  await notification.save();

  res.status(200).json({ message: 'Notification marquée comme lue.', notification });
});