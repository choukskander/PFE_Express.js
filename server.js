const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const fileUpload = require('express-fileupload');
const path = require("path");

dotenv.config();

const app = express();
app.use(express.json());
app.use(fileUpload({
  useTempFiles: true, // Store files on disk
  tempFileDir: path.join(__dirname, 'Uploads'), // Ensure folder exists
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  abortOnLimit: true
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

app.get("/", (req, res) => {
  res.send("Bienvenue sur la plateforme de prise de rendez-vous médicaux !");
});

// Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur en ligne sur le port ${PORT}`));