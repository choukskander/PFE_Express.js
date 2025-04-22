const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  getDoctorAppointments,
  getPatientAppointments,
  cancelAppointment,
  updateAppointmentStatus,
} = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware');

// Route pour prendre un rendez-vous (patients uniquement)
router.post('/book', authMiddleware, bookAppointment);

// Route pour récupérer les rendez-vous d’un médecin (médecins uniquement)
router.get('/doctor', authMiddleware, getDoctorAppointments);

// Route pour récupérer les rendez-vous d’un patient (patients uniquement)
router.get('/patient', authMiddleware, getPatientAppointments);

// Route pour annuler un rendez-vous (patients ou médecins)
router.put('/cancel/:appointmentId', authMiddleware, cancelAppointment);
// Route pour modifier le statut d’un rendez-vous
router.put('/:appointmentId/status', authMiddleware, updateAppointmentStatus);

module.exports = router;