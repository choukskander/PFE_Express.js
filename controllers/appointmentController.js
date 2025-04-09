const Appointment = require("../models/Appointment");

exports.createAppointment = async (req, res) => {
  const { doctor, date } = req.body;
  try {
    const appointment = new Appointment({ patient: req.user.userId, doctor, date });
    await appointment.save();
    res.status(201).json({ message: "Rendez-vous créé avec succès !" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la prise de rendez-vous" });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.userId }).populate("doctor", "name email");
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des rendez-vous" });
  }
};
