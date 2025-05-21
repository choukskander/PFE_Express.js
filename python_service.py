# from flask import Flask, request, jsonify
# import joblib
# import spacy
# from camel_tools.disambig.mle import MLEDisambiguator
# from camel_tools.tokenizers.word import simple_word_tokenize
# import os

# app = Flask(__name__)

# # Charger les modèles de classification
# classifiers = {lang: joblib.load(f"data/classifier_model_{lang}.joblib") for lang in ['en', 'fr', 'ar']}

# # Charger le modèle spaCy pour le français
# nlp_fr = spacy.load("fr_core_news_sm")

# # Charger le modèle camel-tools pour l'arabe
# mle = MLEDisambiguator.pretrained("calima-tun-0.2.0")

# # Charger les symptômes
# def load_symptoms(lang):
#     data_path = os.path.join(os.path.dirname(__file__), "../data")
#     if lang == "en":
#         path = os.path.join(data_path, "symptoms.txt")
#     else:
#         path = os.path.join(data_path, "translations", f"symptoms_{lang}.txt")
#     symptoms = []
#     with open(path, "r", encoding="utf-8") as f:
#         for line in f:
#             cleaned_line = line.strip().replace(",", "").replace("_", " ").lower()
#             if cleaned_line:
#                 symptoms.append(cleaned_line)
#     return symptoms

# SYMPTOMS = {lang: load_symptoms(lang) for lang in ["en", "fr", "ar"]}

# @app.route('/extract_symptoms', methods=['POST'])
# def extract_symptoms():
#     data = request.get_json()
#     text = data['text'].lower()
#     lang = data['lang']

#     if lang == "fr":
#         doc = nlp_fr(text)
#         symptoms = [token.text for token in doc if token.text in SYMPTOMS[lang]]
#     elif lang == "ar":
#         tokens = simple_word_tokenize(text)
#         disambig = mle.disambiguate(tokens)
#         symptoms = [word for word, _ in [(d.word, d) for d in disambig] if word in SYMPTOMS[lang]]
#     elif lang == "en":
#         words = text.split()
#         symptoms = [word for word in words if word in SYMPTOMS[lang]]
#     else:
#         symptoms = []

#     return jsonify({'symptoms': symptoms})

# @app.route('/predict_disease', methods=['POST'])
# def predict_disease():
#     data = request.get_json()
#     symptoms = data['symptoms']
#     lang = data['lang']

#     symptoms_str = " ".join([s.lower().replace(" ", "_") for s in symptoms])
#     classifier = classifiers[lang]
#     disease = classifier.predict([symptoms_str])[0]

#     return jsonify({'disease': disease})

# if __name__ == '__main__':
#     app.run(port=5001)
from flask import Flask, request, jsonify
import os

app = Flask(__name__)

# Charger les symptômes
def load_symptoms(lang):
    # Utiliser un chemin absolu basé sur l'emplacement du script
    base_dir = os.path.dirname(os.path.abspath(__file__))  # Répertoire du script
    data_path = os.path.join(base_dir, "data")  # Chemin vers le dossier data
    if lang == "en":
        path = os.path.join(data_path, "symptoms.txt")
    else:
        path = os.path.join(data_path, "translations", f"symptoms_{lang}.txt")
    
    # Vérifier si le fichier existe
    if not os.path.exists(path):
        raise FileNotFoundError(f"Le fichier {path} n'existe pas.")
    
    symptoms = []
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            cleaned_line = line.strip().replace(",", "").replace("_", " ").lower()
            if cleaned_line:
                symptoms.append(cleaned_line)
    return symptoms

# Charger les symptômes pour chaque langue
SYMPTOMS = {lang: load_symptoms(lang) for lang in ["en", "fr", "ar"]}

# Simulation de l'extraction des symptômes (NLP)
@app.route('/extract_symptoms', methods=['POST'])
def extract_symptoms():
    data = request.get_json()
    text = data['text'].lower()
    lang = data['lang']

    # Simulation simple : retourne les mots du texte qui correspondent aux symptômes
    words = text.split()
    symptoms = [word for word in words if word in SYMPTOMS[lang]]
    
    return jsonify({'symptoms': symptoms})

# Simulation de la prédiction de maladie
@app.route('/predict_disease', methods=['POST'])
def predict_disease():
    data = request.get_json()
    symptoms = data['symptoms']
    lang = data['lang']

    # Simulation : retourne une maladie basée sur le nombre de symptômes
    if len(symptoms) > 2:
        disease = "common_cold"  # Exemple
    elif len(symptoms) > 0:
        disease = "fever"  # Exemple
    else:
        disease = "no_disease"

    return jsonify({'disease': disease})

if __name__ == '__main__':
    app.run(port=5001)