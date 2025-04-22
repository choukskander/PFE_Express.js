const mongoose = require('mongoose');
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cloudinary = require('cloudinary').v2;
const asyncHandler = require('express-async-handler');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

exports.register = asyncHandler(async (req, res) => {
  console.log("Register - Request body:", req.body, "Files:", req.files);

  const { nom, prenom, email, password, role, specialite } = req.body;
  const licenceProfessionnelle = req.files?.licenceProfessionnelle;

  if (!nom || !prenom || !email || !password || !role) {
    return res.status(400).json({ message: "Tous les champs sont requis." });
  }

  if (role === "internaute" && (!specialite || !licenceProfessionnelle)) {
    return res.status(400).json({
      message: "La spécialité et la licence professionnelle sont requises pour les internautes.",
    });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Un utilisateur avec cet email existe déjà." });
  }

  // Validate licenceProfessionnelle
  let licenceUrl;
  if (licenceProfessionnelle) {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(licenceProfessionnelle.mimetype)) {
      return res.status(400).json({ message: "Seuls les fichiers JPG, PNG et PDF sont autorisés pour la licence." });
    }
    if (licenceProfessionnelle.size > 5 * 1024 * 1024) {
      return res.status(400).json({ message: "La licence ne doit pas dépasser 5MB." });
    }

    try {
      const result = await cloudinary.uploader.upload(licenceProfessionnelle.tempFilePath, {
        folder: 'licences',
        resource_type: 'auto',
      });
      licenceUrl = result.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error (licence):', error);
      return res.status(500).json({ message: "Erreur lors du téléchargement de la licence." });
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    nom,
    prenom,
    email,
    password: hashedPassword,
    role,
    specialite: role === "internaute" ? specialite : undefined,
    licenceProfessionnelle: licenceUrl,
  });

  await newUser.save();

  const token = generateToken(newUser._id);

  res.status(201).json({
    message: "Inscription réussie.",
    token,
    user: {
      _id: newUser._id,
      nom: newUser.nom,
      prenom: newUser.prenom,
      email: newUser.email,
      role: newUser.role,
      specialite: newUser.specialite,
      licenceProfessionnelle: newUser.licenceProfessionnelle,
    },
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
      specialite: user.specialite,
      licenceProfessionnelle: user.licenceProfessionnelle,
      profileImage: user.profileImage,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: "Identifiants invalides" });
  }
});

exports.updateUserProfile = asyncHandler(async (req, res) => {
  console.log('Update Profile - Request body:', req.body, 'Files:', req.files);

  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' });
  }

  const { nom, prenom, email, password, specialite, ville, localisation } = req.body;
  const profileImage = req.files?.profileImage;

  // Validate email uniqueness
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }
  }

  // Update fields
  user.nom = nom || user.nom;
  user.prenom = prenom || user.prenom;
  user.email = email || user.email;
  if (user.role === 'internaute') {
    user.specialite = specialite || user.specialite;
    user.ville = ville || user.ville;
    user.localisation = localisation || user.localisation;
  }
  if (password && password.trim() !== '') {
    user.password = await bcrypt.hash(password, 10);
  }

  // Handle profile image
  if (profileImage) {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(profileImage.mimetype)) {
      return res.status(400).json({ message: "Seuls les fichiers JPG et PNG sont autorisés pour l'image de profil." });
    }
    if (profileImage.size > 5 * 1024 * 1024) {
      return res.status(400).json({ message: "L'image de profil ne doit pas dépasser 5MB." });
    }

    try {
      const result = await cloudinary.uploader.upload(profileImage.tempFilePath, {
        folder: 'user_profiles',
        resource_type: 'image',
      });
      user.profileImage = result.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error (profile):', error);
      return res.status(500).json({ message: "Erreur lors du téléchargement de l'image de profil." });
    }
  }

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    nom: updatedUser.nom,
    prenom: updatedUser.prenom,
    email: updatedUser.email,
    role: updatedUser.role,
    specialite: updatedUser.specialite,
    profileImage: updatedUser.profileImage,
    ville: updatedUser.ville,
    localisation: updatedUser.localisation,
  });
});

// Récupérer les spécialités uniques
exports.getSpecialites = asyncHandler(async (req, res) => {
  try {
    // Récupérer les spécialités uniques avec distinct
    const specialites = await User.distinct('specialite');
    // Ajouter une option par défaut
    const specialitesList = [
      { value: '', label: 'Sélectionner une spécialité' },
      ...specialites
        .filter(specialite => specialite) // Filtrer les valeurs nulles ou vides
        .map(specialite => ({ value: specialite, label: specialite }))
    ];
    res.json(specialitesList);
  } catch (err) {
    console.error('Erreur lors de la récupération des spécialités:', err);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des spécialités.' });
  }
});
exports.searchDoctorsByCity = asyncHandler(async (req, res) => {
  const { nom, specialite, ville } = req.query;
  console.log('searchDoctorsByCity - Requête reçue:', { nom, specialite, ville });

  // Vérifier qu'au moins un critère est fourni
  if (!nom && !specialite && !ville) {
    return res.status(400).json({ message: 'Au moins un critère de recherche (nom, spécialité ou ville) est requis.' });
  }

  // Construire la requête MongoDB
  const query = {
    role: 'internaute',
    validated: true,
  };

  // Ajouter le filtre par nom si fourni
  if (nom) {
    query.$or = [
      { nom: { $regex: nom, $options: 'i' } },
      { prenom: { $regex: nom, $options: 'i' } },
    ];
  }

  // Ajouter le filtre par spécialité si fourni
  if (specialite) {
    query.specialite = { $regex: specialite, $options: 'i' };
  }

  // Ajouter le filtre par ville si fourni
  if (ville) {
    query.ville = { $regex: ville, $options: 'i' };
  }

  try {
    const doctors = await User.find(query).select('nom prenom specialite ville localisation profileImage');
    console.log('searchDoctorsByCity - Résultat:', doctors);

    if (doctors.length === 0) {
      return res.json({
        message: `Aucun médecin trouvé pour les critères spécifiés.`,
        doctors: [],
      });
    }

    res.json(doctors);
  } catch (error) {
    console.error('searchDoctorsByCity - Erreur:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la recherche.' });
  }
});
// Mettre à jour les horaires du médecin
exports.updateDoctorSchedule = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Utilisateur non authentifié.' });
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'Utilisateur non trouvé.' });
  }
  if (user.role !== 'internaute') {
    return res.status(403).json({ message: 'Seuls les médecins peuvent mettre à jour leurs horaires.' });
  }

  const { horaires } = req.body;
  if (!horaires || typeof horaires !== 'object') {
    return res.status(400).json({ message: 'Les horaires doivent être fournis sous forme d\'objet.' });
  }

  // Valider les horaires
  const days = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
  for (const day of days) {
    if (horaires[day]) {
      const { ouverture, fermeture, ferme } = horaires[day];
      if (ferme === true) {
        horaires[day] = { ouverture: '', fermeture: '', ferme: true };
      } else {
        if (!ouverture || !fermeture || !/^\d{2}:\d{2}$/.test(ouverture) || !/^\d{2}:\d{2}$/.test(fermeture)) {
          return res.status(400).json({ message: `Format invalide pour les horaires du ${day}. Utilisez HH:MM.` });
        }
        horaires[day].ferme = false;
      }
    }
  }

  user.horaires = horaires;
  await user.save();

  res.json({ message: 'Horaires mis à jour avec succès.', horaires: user.horaires });
});

// Récupérer les horaires d'un médecin spécifique

exports.getDoctorSchedule = asyncHandler(async (req, res) => {
  const { doctorId } = req.params;
  console.log('Received request for doctorId:', doctorId);

  // Check if doctorId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(doctorId)) {
    console.log('Invalid doctorId format:', doctorId);
    return res.status(400).json({ message: 'ID de médecin invalide.' });
  }

  // Include 'role' in the select fields
  console.log('Querying database for user with ID:', doctorId);
  const doctor = await User.findById(doctorId).select('horaires nom prenom specialite role'); // Added 'role'
  if (!doctor) {
    console.log('Doctor not found for ID:', doctorId);
    return res.status(404).json({ message: 'Médecin non trouvé.' });
  }

  console.log('Doctor found:', doctor);
  if (doctor.role !== 'internaute') {
    console.log('User is not a doctor. Role:', doctor.role);
    return res.status(404).json({ message: 'Médecin non trouvé.' });
  }

  console.log('Returning schedule for doctor:', doctorId);
  res.json({ horaires: doctor.horaires, doctor: { nom: doctor.nom, prenom: doctor.prenom, specialite: doctor.specialite } });
});

// Récupérer les horaires d'un médecin pour les patients
exports.getDoctorScheduleForPatient = asyncHandler(async (req, res) => {
  const { doctorId } = req.params;
  console.log('Patient requesting schedule for doctorId:', doctorId);
  console.log('Utilisateur authentifié dans getDoctorScheduleForPatient:', req.user); // Ajouter ce log

  if (!mongoose.Types.ObjectId.isValid(doctorId)) {
    console.log('Invalid doctorId format:', doctorId);
    return res.status(400).json({ message: 'ID de médecin invalide.' });
  }

  // Vérifier que l'utilisateur authentifié est un patient
  console.log('Rôle de l\'utilisateur:', req.user.role); // Ajouter ce log
  if (req.user.role !== 'patient') {
    console.log('Access denied. User role:', req.user.role);
    return res.status(403).json({ message: 'Accès refusé. Seuls les patients peuvent consulter les horaires.' });
  }

  console.log('Querying database for user with ID:', doctorId);
  const doctor = await User.findById(doctorId).select('horaires nom prenom specialite role');
  if (!doctor) {
    console.log('Doctor not found for ID:', doctorId);
    return res.status(404).json({ message: 'Médecin non trouvé.' });
  }

  console.log('Doctor found:', doctor);
  if (doctor.role !== 'internaute') {
    console.log('User is not a doctor. Role:', doctor.role);
    return res.status(404).json({ message: 'Médecin non trouvé.' });
  }

  console.log('Returning schedule for doctor:', doctorId);
  res.json({ horaires: doctor.horaires, doctor: { nom: doctor.nom, prenom: doctor.prenom, specialite: doctor.specialite } });
});

// Prendre un rendez-vous
exports.bookAppointment = asyncHandler(async (req, res) => {
  const { doctorId, date } = req.body;
  const patientId = req.user.id;

  const doctor = await User.findById(doctorId);
  if (!doctor || doctor.role !== 'internaute') {
    return res.status(404).json({ message: 'Médecin non trouvé.' });
  }

  const patient = await User.findById(patientId);
  if (!patient || patient.role !== 'patient') {
    return res.status(403).json({ message: 'Seuls les patients peuvent prendre des rendez-vous.' });
  }

  // Vérifier si le créneau est disponible
  const appointmentDate = new Date(date);
  const dayName = appointmentDate.toLocaleString('fr-FR', { weekday: 'long' }).toLowerCase();
  const horaires = doctor.horaires.get(dayName);

  if (horaires.ferme) {
    return res.status(400).json({ message: `Le médecin est fermé le ${dayName}.` });
  }

  const [openHour, openMinute] = horaires.ouverture.split(':').map(Number);
  const [closeHour, closeMinute] = horaires.fermeture.split(':').map(Number);
  const appointmentHour = appointmentDate.getHours();
  const appointmentMinute = appointmentDate.getMinutes();

  const openTime = openHour * 60 + openMinute;
  const closeTime = closeHour * 60 + closeMinute;
  const appointmentTime = appointmentHour * 60 + appointmentMinute;

  if (appointmentTime < openTime || appointmentTime >= closeTime) {
    return res.status(400).json({ message: 'Le créneau horaire est en dehors des heures d\'ouverture.' });
  }

  // Vérifier si un rendez-vous existe déjà à ce créneau (par exemple, intervalle de 30 minutes)
  const existingAppointment = await Appointment.findOne({
    doctorId,
    date: {
      $gte: new Date(appointmentDate.getTime() - 15 * 60 * 1000), // 15 minutes avant
      $lte: new Date(appointmentDate.getTime() + 15 * 60 * 1000), // 15 minutes après
    },
  });

  if (existingAppointment) {
    return res.status(400).json({ message: 'Ce créneau est déjà pris.' });
  }

  const newAppointment = new Appointment({
    doctorId,
    patientId,
    date: appointmentDate,
  });

  await newAppointment.save();

  res.status(201).json({ message: 'Rendez-vous pris avec succès.', appointment: newAppointment });
});