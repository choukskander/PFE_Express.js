const express = require("express");
const { createAppointment, getAppointments } = require("../controllers/appointmentController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, createAppointment);
router.get("/", authMiddleware, getAppointments);

module.exports = router;
