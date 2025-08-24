const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const path = require("path");
const notificationRoutes = require("./routes/notificationRoutes");

// ================================================================
// CONFIGURATION PROMETHEUS
// ================================================================
const client = require("prom-client");
const register = new client.Registry();
client.collectDefaultMetrics({ register });
// ================================================================

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "Uploads"),
    limits: { fileSize: 5 * 1024 * 1024 },
    abortOnLimit: true,
  })
);

// CORS : autorise ton frontend local + ton futur site déployé
app.use(
  cors({
    origin: [
      "http://localhost:3000", // développement local
      "https://rdv-med.netlify.app", // ton site Netlify/Vercel une fois déployé
    ],
    credentials: true,
  })
);

// Static files
app.use("/uploads", express.static(path.join(__dirname, "Uploads")));

// ================================================================
// CONNEXION MONGODB
// ================================================================
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("🟢 Connexion à MongoDB réussie"))
  .catch((err) => console.error("🔴 Erreur de connexion à MongoDB :", err));

// ================================================================
// ROUTE /metrics POUR PROMETHEUS
// ================================================================
app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

// ================================================================
// ROUTES API
// ================================================================
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));
app.use("/api/forum", require("./routes/forumRoutes"));
app.use("/api/notifications", notificationRoutes);
app.use("/api", require("./routes/diagnosticRoutes"));

// Test routes
app.get("/test-email", async (req, res) => {
  res.send("📧 Test email OK (mock)");
});

app.get("/", (req, res) => {
  res.send("🚀 API Express en ligne !");
});

// ================================================================
// DEMARRAGE SERVEUR
// ================================================================
const PORT = process.env.PORT || 5000;

// ⚠️ Important : écouter sur 0.0.0.0 pour Render
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Serveur en ligne sur le port ${PORT}`);
});
