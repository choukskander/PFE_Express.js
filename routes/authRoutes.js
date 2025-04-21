const express = require('express');
const router = express.Router();
const { register, login, updateUserProfile, searchDoctorsByCity, getSpecialites } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.put('/profile', authMiddleware, updateUserProfile);
router.get('/search-doctors', searchDoctorsByCity);
router.get('/specialites', getSpecialites); // Nouvelle route pour les spécialités

module.exports = router;