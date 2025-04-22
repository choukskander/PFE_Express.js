const express = require('express');
const router = express.Router();
const { register, login, updateUserProfile, searchDoctorsByCity, getSpecialites, updateDoctorSchedule, getDoctorSchedule, bookAppointment, getDoctorScheduleForPatient } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.put('/profile', authMiddleware, updateUserProfile);
router.get('/search-doctors', searchDoctorsByCity);
router.get('/specialites', getSpecialites);
router.put('/schedule', authMiddleware, updateDoctorSchedule);
router.get('/schedule/:doctorId', authMiddleware, getDoctorSchedule); // Ensure authMiddleware is here
router.get('/schedule-for-patient/:doctorId', authMiddleware, getDoctorScheduleForPatient);
router.post('/appointment', authMiddleware, bookAppointment);

module.exports = router;