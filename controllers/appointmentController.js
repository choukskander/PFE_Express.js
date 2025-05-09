const asyncHandler = require('express-async-handler');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail'); 
const Notification = require('../models/Notification');


// Créer un rendez-vous (pour les patients)
exports.bookAppointment = asyncHandler(async (req, res) => {
  const { doctorId, date, time, day } = req.body;

  // Vérifier que l'utilisateur est un patient
  if (req.user.role !== 'patient') {
    return res.status(403).json({ message: 'Accès refusé. Seuls les patients peuvent prendre un rendez-vous.' });
  }

  // Vérifier que le médecin existe et est un "internaute"
  const doctor = await User.findById(doctorId);
  if (!doctor || doctor.role !== 'internaute') {
    return res.status(404).json({ message: 'Médecin non trouvé.' });
  }

  // Vérifier que le créneau est valide (dans les horaires du médecin)
  const horaires = doctor.horaires.get(day.toLowerCase());
  if (horaires.ferme || time < horaires.ouverture || time > horaires.fermeture) {
    return res.status(400).json({ message: 'Créneau non disponible.' });
  }

  // Vérifier si le créneau est déjà pris
  const existingAppointment = await Appointment.findOne({
    doctorId,
    date,
    time,
    status: { $ne: 'cancelled' },
  });
  if (existingAppointment) {
    return res.status(400).json({ message: 'Ce créneau est déjà pris.' });
  }

  // Créer le rendez-vous
  const appointment = new Appointment({
    doctorId,
    patientId: req.user.id,
    date,
    time,
    day: day.toLowerCase(),
  });

  await appointment.save();

  // Créer une notification pour le médecin
  const patient = await User.findById(req.user.id);
  const notificationMessage = `Un nouveau rendez-vous a été pris par ${patient.prenom} ${patient.nom} pour le ${date} à ${time}.`;
  const notification = new Notification({
    recipientId: doctorId,
    message: notificationMessage,
    type: 'appointment_booked',
    appointmentId: appointment._id,
  });

  await notification.save();
  console.log(`Notification created for doctor ${doctorId}: ${notificationMessage}`);

  // Optionally, send an email to the doctor as well
  const doctorEmail = doctor.email;
  const doctorName = `${doctor.prenom} ${doctor.nom}`;
  const subject = 'Nouveau rendez-vous pris';
  const text = `Bonjour Dr. ${doctorName},\n\n${notificationMessage}\n\nCordialement,\nL'équipe de Rdv-Med`;
  const html = `
    <h2>Bonjour Dr. ${doctorName},</h2>
    <p>${notificationMessage}</p>
    <p>Cordialement,<br>L'équipe de Rdv-Med</p>
  `;

  try {
    await sendEmail({
      to: doctorEmail,
      subject,
      text,
      html,
    });
    console.log(`Email sent to ${doctorEmail}: ${notificationMessage}`);
  } catch (error) {
    console.error(`Failed to send email to ${doctorEmail}:`, error);
    // Note: We don't fail the request if the email fails; we just log the error
  }

  res.status(201).json({ message: 'Rendez-vous pris avec succès.', appointment });
});

// Récupérer les rendez-vous d’un médecin
exports.getDoctorAppointments = asyncHandler(async (req, res) => {
  const doctorId = req.user.id;

  // Vérifier que l'utilisateur est un médecin
  if (req.user.role !== 'internaute') {
    return res.status(403).json({ message: 'Accès refusé. Seuls les médecins peuvent voir leurs rendez-vous.' });
  }

  const appointments = await Appointment.find({ doctorId })
    .populate('patientId', 'nom prenom email')
    .sort({ date: -1, time: -1 });

  res.json(appointments);
});

// Récupérer les rendez-vous d’un patient
exports.getPatientAppointments = asyncHandler(async (req, res) => {
  const patientId = req.user.id; // ID du patient authentifié (via authMiddleware)
  console.log('Patient requesting appointments for patientId:', patientId);

  // Vérifier que l'utilisateur est un patient (rôle: 'patient')
  if (req.user.role !== 'patient') {
    console.log('Access denied. User role:', req.user.role);
    return res.status(403).json({ message: 'Accès refusé. Seuls les patients peuvent voir leurs rendez-vous.' });
  }

  // Récupérer les rendez-vous associés au patient
  const appointments = await Appointment.find({ patientId })
    .populate('doctorId', 'nom prenom email specialite') // Inclure les informations du médecin
    .sort({ date: -1, time: -1 }); // Trier par date et heure

  if (!appointments || appointments.length === 0) {
    console.log('No appointments found for patientId:', patientId);
    return res.status(200).json({ message: 'Aucun rendez-vous trouvé.', appointments: [] });
  }

  console.log('Appointments found:', appointments);
  res.status(200).json({ appointments });
});

// Annuler un rendez-vous (pour les patients ou médecins)
exports.cancelAppointment = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;

  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) {
    return res.status(404).json({ message: 'Rendez-vous non trouvé.' });
  }

  // Vérifier que l'utilisateur est soit le patient, soit le médecin concerné
  if (
    appointment.patientId.toString() !== req.user.id &&
    appointment.doctorId.toString() !== req.user.id
  ) {
    return res.status(403).json({ message: 'Accès refusé.' });
  }

  appointment.status = 'cancelled';
  await appointment.save();

  res.json({ message: 'Rendez-vous annulé avec succès.' });
});


// Mettre à jour le statut d’un rendez-vous
exports.updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;
  const { status } = req.body;
  const doctorId = req.user.id; // ID du médecin authentifié

  console.log('Doctor updating appointment status:', { appointmentId, status, doctorId });

  // Vérifier que l'utilisateur est un médecin (rôle: 'internaute')
  if (req.user.role !== 'internaute') {
    console.log('Access denied. User role:', req.user.role);
    return res.status(403).json({ message: 'Accès refusé. Seuls les médecins peuvent modifier les rendez-vous.' });
  }

  // Vérifier que le statut est valide
  if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
    console.log('Invalid status:', status);
    return res.status(400).json({ message: 'Statut invalide. Les valeurs possibles sont : pending, confirmed, cancelled.' });
  }

  // Rechercher le rendez-vous et peupler les informations du patient
  const appointment = await Appointment.findById(appointmentId).populate('patientId', 'nom prenom email');
  if (!appointment) {
    console.log('Appointment not found for ID:', appointmentId);
    return res.status(404).json({ message: 'Rendez-vous non trouvé.' });
  }

  // Vérifier que le rendez-vous appartient au médecin authentifié
  if (appointment.doctorId.toString() !== doctorId) {
    console.log('Appointment does not belong to doctor:', { appointmentDoctorId: appointment.doctorId, doctorId });
    return res.status(403).json({ message: 'Accès refusé. Vous ne pouvez modifier que vos propres rendez-vous.' });
  }

  // Mettre à jour le statut
  appointment.status = status;
  await appointment.save();

  // Envoyer un email au patient si le statut est "confirmed" ou "cancelled"
  if (['confirmed', 'cancelled'].includes(status)) {
    const patientEmail = appointment.patientId.email;
    const patientName = `${appointment.patientId.prenom} ${appointment.patientId.nom}`;
    const statusText = status === 'confirmed' ? 'confirmé' : 'annulé';
    const subject = `Mise à jour de votre rendez-vous - Statut : ${statusText}`;
    const text = `Bonjour ${patientName},\n\nVotre rendez-vous du ${appointment.date} à ${appointment.time} a été ${statusText} par le médecin.\n\nCordialement,\nL'équipe de la plateforme médicale`;
    const html = `
      <h2>Bonjour ${patientName},</h2>
      <p>Votre rendez-vous du <strong>${appointment.date}</strong> à <strong>${appointment.time}</strong> a été <strong>${statusText}</strong> par le médecin.</p>
      <p>Cordialement,<br>L'équipe de la plateforme médicale</p>
    `;

    try {
      await sendEmail({
        to: patientEmail,
        subject,
        text,
        html,
      });
      console.log(`Email sent to ${patientEmail} for status update: ${status}`);
    } catch (error) {
      console.error(`Failed to send email to ${patientEmail}:`, error);
      // Note: We don't fail the request if the email fails; we just log the error
    }
  }

  console.log('Appointment status updated:', appointment);
  res.status(200).json({ message: 'Statut du rendez-vous mis à jour avec succès.', appointment });
});

// Récupérer tous les rendez-vous (pour les admins)
exports.getAllAppointments = asyncHandler(async (req, res) => {
  // Vérifier que l'utilisateur est un admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès refusé. Seuls les admins peuvent voir tous les rendez-vous.' });
  }

  // Récupérer tous les rendez-vous
  const appointments = await Appointment.find()
    .populate('doctorId', 'nom prenom email specialite') // Inclure les informations du médecin
    .populate('patientId', 'nom prenom email') // Inclure les informations du patient
    .sort({ date: 1, time: 1 }); // Trier par date et heure

  res.status(200).json(appointments);
});

// Envoyer un lien de réunion au patient
exports.sendMeetingLink = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;
  const { roomName } = req.body;
  const doctorId = req.user.id;

  // Vérifier que l'utilisateur est un médecin (rôle: 'internaute')
  if (req.user.role !== 'internaute') {
    return res.status(403).json({ message: 'Accès refusé. Seuls les médecins peuvent envoyer des liens de réunion.' });
  }

  // Rechercher le rendez-vous et peupler les informations du patient
  const appointment = await Appointment.findById(appointmentId).populate('patientId', 'nom prenom email');
  if (!appointment) {
    return res.status(404).json({ message: 'Rendez-vous non trouvé.' });
  }

  // Vérifier que le rendez-vous appartient au médecin authentifié
  if (appointment.doctorId.toString() !== doctorId) {
    return res.status(403).json({ message: 'Accès refusé. Vous ne pouvez envoyer des liens que pour vos propres rendez-vous.' });
  }

  // Vérifier que le rendez-vous est confirmé
  if (appointment.status !== 'confirmed') {
    return res.status(400).json({ message: 'Le rendez-vous doit être confirmé pour envoyer un lien de réunion.' });
  }

  // Construire le lien de la réunion
  const meetingLink = `https://meet.jit.si/${roomName}`;
  const patientEmail = appointment.patientId.email;
  const patientName = `${appointment.patientId.prenom} ${appointment.patientId.nom}`;
  const subject = 'Lien de votre réunion médicale';
  const text = `Bonjour ${patientName},\n\nVotre médecin a créé une réunion pour votre rendez-vous du ${appointment.date} à ${appointment.time}.\nRejoignez la réunion en utilisant le lien suivant :\n${meetingLink}\n\nCordialement,\nL'équipe de la plateforme médicale`;
  const html = `
    <h2>Bonjour ${patientName},</h2>
    <p>Votre médecin a créé une réunion pour votre rendez-vous du <strong>${appointment.date}</strong> à <strong>${appointment.time}</strong>.</p>
    <p>Rejoignez la réunion en utilisant le lien suivant : <a href="${meetingLink}">${meetingLink}</a></p>
    <p>Cordialement,<br>L'équipe de la plateforme médicale</p>
  `;

  // Envoyer l'email
  try {
    await sendEmail({
      to: patientEmail,
      subject,
      text,
      html,
    });
    console.log(`Meeting link email sent to ${patientEmail}: ${meetingLink}`);
    res.status(200).json({ message: 'Lien de réunion envoyé au patient avec succès.' });
  } catch (error) {
    console.error(`Failed to send meeting link email to ${patientEmail}:`, error);
    res.status(500).json({ message: 'Échec de l’envoi du lien de réunion au patient.' });
  }
});

exports.getAppointmentsPerDay = asyncHandler(async (req, res) => {
  try {
    // Aggregate appointments by day, excluding cancelled ones
    const appointments = await Appointment.aggregate([
      {
        $match: {
          status: { $ne: 'cancelled' },
        },
      },
      {
        $group: {
          _id: '$day', // Group by the day field (e.g., 'lundi')
          count: { $sum: 1 },
        },
      },
    ]);

    // Map the results to the order of days we want (Lundi to Dimanche)
    const daysOrder = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
    const result = daysOrder.map((day) => {
      const found = appointments.find((appt) => appt._id.toLowerCase() === day);
      return found ? found.count : 0;
    });

    res.json(result);
  } catch (error) {
    console.error('Error fetching appointments per day:', error.message, error.stack);
    res.status(500).json({ message: 'Erreur lors de la récupération des données.' });
  }
});