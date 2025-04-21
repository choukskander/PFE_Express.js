const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Appointment = require('../models/Appointment');
const Slot = require('../models/Slot');
const User = require('../models/User');

// Get patient appointments
router.get('/patient', authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user.id })
      .populate('doctorId', 'nom prenom specialite');
    res.json(appointments.map((appt) => ({
      _id: appt._id,
      doctorName: `${appt.doctorId.nom} ${appt.doctorId.prenom}`,
      slot: appt.slot,
      status: appt.status,
    })));
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Get doctor appointments
router.get('/doctor', authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.user.id })
      .populate('patientId', 'nom prenom');
    res.json(appointments.map((appt) => ({
      _id: appt._id,
      patientName: `${appt.patientId.nom} ${appt.patientId.prenom}`,
      slot: appt.slot,
      status: appt.status,
      zoomLink: appt.zoomLink,
    })));
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Book appointment
router.post('/', authMiddleware, async (req, res) => {
  const { doctorId, patientId, slot } = req.body;
  try {
    const appointment = new Appointment({ doctorId, patientId, slot });
    await appointment.save();
    await Slot.updateOne({ doctorId, start: slot }, { status: 'booked' });
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la réservation.' });
  }
});

// Search doctors
router.get('/doctors/search', authMiddleware, async (req, res) => {
  const { specialty, city, date } = req.query;
  try {
    const query = { role: 'internaute' };
    if (specialty) query.specialite = specialty;
    if (city) query.ville = city; // Add ville to User schema
    const doctors = await User.find(query);
    // Filter by availability if date provided
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: 'Erreur de recherche.' });
  }
});

// Get doctor slots
router.get('/slots', authMiddleware, async (req, res) => {
  try {
    const slots = await Slot.find({ doctorId: req.user.id, status: 'available' });
    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Add doctor slot
router.post('/slots', authMiddleware, async (req, res) => {
  const { doctorId, start, end } = req.body;
  try {
    const slot = new Slot({ doctorId, start, end });
    await slot.save();
    res.status(201).json(slot);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l’ajout.' });
  }
});

module.exports = router;