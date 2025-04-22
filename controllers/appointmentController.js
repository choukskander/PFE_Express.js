const asyncHandler = require('express-async-handler');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

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
    .sort({ date: 1, time: 1 });

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
    .sort({ date: 1, time: 1 }); // Trier par date et heure

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

  // Rechercher le rendez-vous
  const appointment = await Appointment.findById(appointmentId);
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

  console.log('Appointment status updated:', appointment);
  res.status(200).json({ message: 'Statut du rendez-vous mis à jour avec succès.', appointment });
});