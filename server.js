// const express = require("express");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const fileUpload = require('express-fileupload');
// const path = require("path");
// const notificationRoutes = require('./routes/notificationRoutes');

// dotenv.config();

// const app = express();
// app.use(express.json());
// app.use(fileUpload({
//   useTempFiles: true,
//   tempFileDir: path.join(__dirname, 'Uploads'),
//   limits: { fileSize: 5 * 1024 * 1024 },
//   abortOnLimit: true
// }));
// app.use(cors({
//   origin: 'http://localhost:3000',
//   credentials: true,
// }));
// app.use(cors());
// app.use("/uploads", express.static(path.join(__dirname, "Uploads")));

// // Connexion à MongoDB
// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => console.log("🟢 Connexion à MongoDB réussie"))
//   .catch((err) => console.error("🔴 Erreur de connexion à MongoDB :", err));

// // Routes
// app.use("/api/auth", require("./routes/authRoutes"));
// app.use("/api/appointments", require("./routes/appointmentRoutes"));
// app.use('/api/forum', require('./routes/forumRoutes'));
// app.use('/api/notifications', notificationRoutes);
// app.use("/api", require("./routes/diagnosticRoutes")); // Ajout des routes de diagnostic

// app.get('/test-email', async (req, res) => {
//   try {
//     const sendEmail = require('./utils/sendEmail');
//     await sendEmail({
//       to: 'choukskander1@gmail.com',
//       subject: 'Test Email',
//       text: 'This is a test email from your app!',
//       html: '<p>This is a test email from your app!</p>',
//     });
//     res.status(200).json({ message: 'Test email sent successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to send test email', error: error.message });
//   }
// });

// app.get("/", (req, res) => {
//   res.send("Bienvenue sur la plateforme de prise de rendez-vous médicaux !");
// });

// // Lancement du serveur
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Serveur en ligne sur le port ${PORT} à ${new Date().toLocaleString('fr-FR', { timeZone: 'CET' })}`));
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const fileUpload = require('express-fileupload');
const path = require("path");
const notificationRoutes = require('./routes/notificationRoutes');
const client = require('prom-client'); // AJOUT 1/2

dotenv.config();

const app = express();

// AJOUT 2/2 : Configuration de Prometheus
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ prefix: 'pfe_backend_' }); // On ajoute un préfixe pour identifier les métriques

app.use(express.json());
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: path.join(__dirname, 'Uploads'),
  limits: { fileSize: 5 * 1024 * 1024 },
  abortOnLimit: true
}));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "Uploads")));


mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("🟢 Connexion à MongoDB réussie"))
  .catch((err) => console.error("🔴 Erreur de connexion à MongoDB :", err));

// Route pour exposer les métriques à Prometheus
// On la place AVANT les autres routes pour s'assurer qu'elle soit toujours accessible.
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));
app.use('/api/forum', require('./routes/forumRoutes'));
app.use('/api/notifications', notificationRoutes);
app.use("/api", require("./routes/diagnosticRoutes"));

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

app.get("/", (req, res) => {
  res.send("Bienvenue sur la plateforme de prise de rendez-vous médicaux !");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur en ligne sur le port ${PORT} à ${new Date().toLocaleString('fr-FR', { timeZone: 'CET' })}`));