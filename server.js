const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const fileUpload = require('express-fileupload');
const path = require("path");
const notificationRoutes = require('./routes/notificationRoutes');

dotenv.config();

const app = express();
app.use(express.json());
app.use(fileUpload({
  useTempFiles: true, // Store files on disk
  tempFileDir: path.join(__dirname, 'Uploads'), // Ensure folder exists
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  abortOnLimit: true
}));
// CORS Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "Uploads")));

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("🟢 Connexion à MongoDB réussie"))
  .catch((err) => console.error("🔴 Erreur de connexion à MongoDB :", err));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));
app.use('/api/forum', require('./routes/forumRoutes'));
app.get('/test-email', async (req, res) => {
  try {
    const sendEmail = require('./utils/sendEmail');
    await sendEmail({
      to: 'choukskander1@gmail.com',
      subject: 'Test Email',
      text: 'This is a test email from your app!',
      html: '<p>This is a test email from your app!</p>',
    });
    res.status(200).json({ message: 'Test email sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send test email', error: error.message });
  }
});

app.use('/api/notifications', notificationRoutes);

app.get("/", (req, res) => {
  res.send("Bienvenue sur la plateforme de prise de rendez-vous médicaux !");
});

// Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur en ligne sur le port ${PORT}`));