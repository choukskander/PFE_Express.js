const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');
const mongoose = require('mongoose');

// Récupérer les notifications d’un médecin
exports.getDoctorNotifications = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  if (req.user.role !== 'internaute') {
    return res.status(403).json({ message: 'Accès refusé. Seuls les médecins peuvent voir leurs notifications.' });
  }
  try {
    // Validate userId before creating ObjectId
    if (!mongoose.isValidObjectId(userId)) {
      console.warn('Invalid userId provided:', { userId });
      return res.status(400).json({ message: 'ID utilisateur invalide.' });
    }
    const objectId = new mongoose.Types.ObjectId(userId); // Added 'new'
    let notifications = await Notification.find({
      recipientId: objectId,
      type: { $in: ['appointment_booked', 'status_updated', 'meeting_link'] }
    })
      .sort({ createdAt: -1 })
      .lean();
    notifications = await Promise.all(notifications.map(async (notif) => {
      if (notif.appointmentId) {
        try {
          const appointment = await mongoose.model('Appointment').findById(notif.appointmentId)
            .select('date time patientId')
            .lean();
          if (appointment && appointment.patientId) {
            const patient = await mongoose.model('User').findById(appointment.patientId)
              .select('nom prenom')
              .lean();
            notif.appointmentId = { ...appointment, patientId: patient || null };
          } else {
            console.warn('Appointment ou patient non trouvé:', {
              notificationId: notif._id,
              appointmentId: notif.appointmentId,
            });
            notif.appointmentId = null;
          }
        } catch (err) {
          console.error('Erreur lors de la population de appointmentId:', {
            notificationId: notif._id,
            appointmentId: notif.appointmentId,
            error: err.message,
          });
          notif.appointmentId = null;
        }
      }
      return notif;
    }));
    res.status(200).json(notifications || []);
  } catch (err) {
    console.error('Erreur dans getDoctorNotifications:', {
      message: err.message,
      stack: err.stack,
      userId,
    });
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// Récupérer les notifications d’un admin (unchanged)
exports.getAdminNotifications = asyncHandler(async (req, res) => {
  const userId = req.user.id;
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

// Marquer une notification comme lue (unchanged)
exports.markNotificationAsRead = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;
  const userId = req.user.id;
  if (!['internaute', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Accès refusé. Vous n’êtes pas autorisé à modifier les notifications.' });
  }
  const notification = await Notification.findById(notificationId);
  if (!notification) {
    return res.status(404).json({ message: 'Notification non trouvée.' });
  }
  if (notification.recipientId.toString() !== userId) {
    return res.status(403).json({ message: 'Accès refusé. Cette notification ne vous appartient pas.' });
  }
  notification.read = true;
  await notification.save();
  res.status(200).json({ message: 'Notification marquée comme lue.', notification });
});