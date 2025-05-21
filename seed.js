const mongoose = require('mongoose');
const Symptom = require('./models/Symptom');
const fs = require('fs');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const languages = ['en', 'fr', 'ar'];
const importData = async () => {
  try {
    await Symptom.deleteMany({});
    console.log('Base de données MongoDB réinitialisée.');

    for (const lang of languages) {
      try {
        const symptomsPath = lang === 'en' ? 'data/symptoms.txt' : `data/translations/symptoms_${lang}.txt`;
        console.log(`Tentative de lecture du fichier des symptômes pour ${lang} : ${symptomsPath}`);
        
        if (!fs.existsSync(symptomsPath)) {
          console.error(`Fichier non trouvé : ${symptomsPath}`);
          continue;
        }

        const symptomsData = fs.readFileSync(symptomsPath, 'utf-8')
          .split('\n')
          .map(line => line.trim().replace(',', '').replace('_', ' ').toLowerCase())
          .filter(line => line);

        console.log(`Symptômes lus pour ${lang} :`, symptomsData);

        for (const symptom of symptomsData) {
          console.log(`Insertion/MAJ du symptôme : ${symptom} (${lang})`);
          await Symptom.findOneAndUpdate(
            { name: symptom, language: lang },
            { name: symptom, language: lang },
            { upsert: true }
          );
        }
      } catch (error) {
        console.error(`Erreur lors de l'importation pour ${lang} :`, error);
      }
    }
    console.log('Data imported successfully');
  } catch (error) {
    console.error('Erreur générale lors de l\'importation :', error);
  } finally {
    mongoose.connection.close();
  }
};

importData();