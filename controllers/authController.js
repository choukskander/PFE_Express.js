// const User = require("../models/User");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");

// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
// };

// exports.register = async (req, res) => {
//   try {
//     const { nom, prenom, email, password, role } = req.body;

//     console.log("📥 Données reçues :", req.body);

//     // Vérification des champs requis
//     if (!nom || !prenom || !email || !password || !role) {
//       return res.status(400).json({ message: "Tous les champs sont requis." });
//     }

//     // Vérification de l'unicité de l'email
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "Un utilisateur avec cet email existe déjà." });
//     }

//     // Hash du mot de passe
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Création de l'utilisateur
//     const newUser = new User({
//       nom,
//       prenom,
//       email,
//       password: hashedPassword,
//       role,
//     });

//     await newUser.save();

//     // Création du token
//     const token = generateToken(newUser._id);

//     res.status(201).json({
//       message: "Inscription réussie.",
//       token,
//       user: {
//         id: newUser._id,
//         nom: newUser.nom,
//         prenom: newUser.prenom,
//         email: newUser.email,
//         role: newUser.role,
//       },
//     });
//   } catch (error) {
//     console.error("❌ Erreur dans register :", error.message);
//     res.status(500).json({ message: "Erreur interne du serveur." });
//   }
// };

// exports.login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     if (user && (await bcrypt.compare(password, user.password))) {
//       res.json({
//         _id: user.id,
//         nom: user.nom,
//         prenom: user.prenom,
//         email: user.email,
//         role: user.role,
//         token: generateToken(user.id),
//       });
//     } else {
//       res.status(401).json({ message: "Identifiants invalides" });
//     }
//   } catch (error) {
//     console.error("Erreur login :", error);
//     res.status(500).json({ message: "Erreur du serveur" });
//   }
// };
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");

// Configuration de multer pour stocker les fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Seuls les fichiers JPG, JPEG, PNG et PDF sont autorisés."));
    }
  },
}).single("licenceProfessionnelle");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

exports.register = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const { nom, prenom, email, password, role, specialite } = req.body;

      console.log("Données reçues par le serveur :", req.body, "Fichier :", req.file);

      // Vérification des champs requis
      if (!nom || !prenom || !email || !password || !role) {
        return res.status(400).json({ message: "Tous les champs sont requis." });
      }

      // Vérification spécifique pour internaute
      if (role === "internaute" && (!specialite || !req.file)) {
        return res.status(400).json({
          message: "La spécialité et la licence professionnelle sont requises pour les internautes.",
        });
      }

      // Vérification de l'unicité de l'email
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Un utilisateur avec cet email existe déjà." });
      }

      // Hash du mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Création de l'utilisateur
      const newUser = new User({
        nom,
        prenom,
        email,
        password: hashedPassword,
        role,
        specialite: role === "internaute" ? specialite : undefined,
        licenceProfessionnelle: req.file ? `/uploads/${req.file.filename}` : undefined,
      });

      await newUser.save();

      // Création du token
      const token = generateToken(newUser._id);

      res.status(201).json({
        message: "Inscription réussie.",
        token,
        user: {
          id: newUser._id,
          nom: newUser.nom,
          prenom: newUser.prenom,
          email: newUser.email,
          role: newUser.role,
          specialite: newUser.specialite,
          licenceProfessionnelle: newUser.licenceProfessionnelle,
        },
      });
    } catch (error) {
      console.error("❌ Erreur dans register :", error.message);
      res.status(500).json({ message: "Erreur interne du serveur." });
    }
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role,
        specialite: user.specialite,
        licenceProfessionnelle: user.licenceProfessionnelle,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: "Identifiants invalides" });
    }
  } catch (error) {
    console.error("Erreur login :", error);
    res.status(500).json({ message: "Erreur du serveur" });
  }
};