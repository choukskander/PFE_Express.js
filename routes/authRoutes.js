const express = require('express');
const router = express.Router();
const { register, login, updateUserProfile, getUserProfile, searchDoctorsByCity, getSpecialites, updateDoctorSchedule, getDoctorSchedule, bookAppointment, getDoctorScheduleForPatient } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const { getAllUsers, updateUser, deleteUser, validateDoctorLicense, getDoctorsBySpecialty } = require('../controllers/authController');
router.post('/register', register);
router.post('/login', login);
router.put('/profile', authMiddleware, updateUserProfile);
router.get('/profile', authMiddleware, getUserProfile);
router.get('/search-doctors', searchDoctorsByCity);
router.get('/specialites', getSpecialites);
router.put('/schedule', authMiddleware, updateDoctorSchedule);
router.get('/schedule/:doctorId', authMiddleware, getDoctorSchedule); // Ensure authMiddleware is here
router.get('/schedule-for-patient/:doctorId', authMiddleware, getDoctorScheduleForPatient);
router.post('/appointment', authMiddleware, bookAppointment);
router.get('/doctors-by-specialty', getDoctorsBySpecialty);

// Routes pour admin
router.get('/users', authMiddleware, adminMiddleware, getAllUsers); // Récupérer tous les comptes
router.put('/users/:userId', authMiddleware, adminMiddleware, updateUser); // Mettre à jour un compte
router.delete('/users/:userId', authMiddleware, adminMiddleware, deleteUser); // Supprimer un compte
router.put('/users/:userId/validate', authMiddleware, adminMiddleware, validateDoctorLicense); // Valider la licence d’un médecin

module.exports = router;