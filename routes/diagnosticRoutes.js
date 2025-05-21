const express = require('express');
const router = express.Router();
const { getSymptoms, diagnose } = require('../controllers/diagnosticController');

router.get('/symptoms/:lang', getSymptoms);
router.post('/diagnostic', diagnose);

module.exports = router;