import json
import sys
import os
import csv
import unicodedata

# Définir les chemins de base
script_dir = os.path.dirname(os.path.abspath(__file__))
data_path = os.path.join(script_dir, 'data')
translations_path = os.path.join(data_path, 'translations')

# Fonction pour normaliser les chaînes (supprimer les accents et remplacer les espaces)
def normalize_string(s):
    if any('\u0600' <= c <= '\u06FF' for c in s):  # Detect Arabic characters
        return s.strip().replace(" ", "_").lower()
    return unicodedata.normalize('NFD', s).encode('ASCII', 'ignore').decode('ASCII').strip().replace(" ", "_").lower()

def load_disease_info(lang):
    if lang == 'en':
        desc_path = os.path.join(data_path, 'disease-description.csv')
        prec_path = os.path.join(data_path, 'disease-precaution.csv')
    else:
        desc_path = os.path.join(translations_path, f'disease-description_{lang}.csv')
        prec_path = os.path.join(translations_path, f'disease-precaution_{lang}.csv')

    descriptions = {}
    precautions = {}
    print(f"Loading disease info for lang: {lang}", file=sys.stderr)

    try:
        with open(desc_path, "r", encoding='utf-8-sig') as f:
            reader = csv.DictReader(f)
            disease_col = next((col for col in reader.fieldnames if col.lower() in ['disease', 'maladie', 'مرض']), None)
            if not disease_col:
                raise KeyError(f"La colonne 'disease' ou équivalent est manquante dans {desc_path}. En-têtes trouvés : {reader.fieldnames}")
            for row in reader:
                disease_key = normalize_string(row[disease_col])
                descriptions[disease_key] = row.get('description', "Description non disponible.").strip()
                print(f"Loaded description for {disease_key}", file=sys.stderr)
        
        with open(prec_path, "r", encoding='utf-8-sig') as f:
            reader = csv.DictReader(f)
            disease_col = next((col for col in reader.fieldnames if col.lower() in ['disease', 'maladie', 'مرض']), None)
            if not disease_col:
                raise KeyError(f"La colonne 'disease' ou équivalent est manquante dans {prec_path}. En-têtes trouvés : {reader.fieldnames}")
            for row in reader:
                disease_key = normalize_string(row[disease_col])
                precs = [row.get(f'precaution_{i}', '').strip().capitalize() for i in range(1, 5) if row.get(f'precaution_{i}', '').strip()]
                precautions[disease_key] = precs if precs else ["Précaution non disponible."]
                print(f"Loaded precautions for {disease_key}", file=sys.stderr)
    except Exception as e:
        print(json.dumps({"status": "error", "message": f"Erreur lors du chargement des fichiers CSV : {str(e)}"}), file=sys.stderr)
        sys.exit(1)

    return descriptions, precautions

def load_symptom_disease_mapping(lang):
    symptom_disease_map = {}
    if lang == 'en':
        mapping_path = os.path.join(data_path, 'disease-symptoms.csv')
    else:
        mapping_path = os.path.join(translations_path, f'disease-symptoms_{lang}.csv')

    print(f"Loading symptom mapping for lang: {lang}, path: {mapping_path}", file=sys.stderr)
    try:
        with open(mapping_path, "r", encoding='utf-8-sig', errors='replace') as f:
            reader = csv.DictReader(f)
            disease_col = next((col for col in reader.fieldnames if col.lower() in ['disease', 'maladie', 'مرض']), None)
            if not disease_col:
                raise KeyError(f"Colonnes 'disease' ou équivalent manquantes dans {mapping_path}. En-têtes trouvés : {reader.fieldnames}")
            print(f"CSV headers: {reader.fieldnames}", file=sys.stderr)
            for i, row in enumerate(reader, 1):
                # Ignorer les lignes vides ou sans maladie
                if not row or not row[disease_col]:
                    print(f"Skipping empty or invalid row {i}: {row}", file=sys.stderr)
                    continue
                disease = normalize_string(row[disease_col])
                if not disease:
                    print(f"Skipping row {i} with invalid disease name: {row}", file=sys.stderr)
                    continue
                symptom_prefix = 'الأعراض_' if lang == 'ar' else 'Symptom_' if lang == 'en' else 'Symptome_'
                symptoms = []
                for j in range(1, 18):
                    symptom_key = f'{symptom_prefix}{j}'
                    symptom_value = row.get(symptom_key, None)
                    if symptom_value is not None:
                        try:
                            normalized = normalize_string(symptom_value)
                            if normalized:
                                symptoms.append(normalized)
                        except Exception as e:
                            print(f"Error normalizing symptom '{symptom_value}' in row {i}, col {symptom_key}: {str(e)}", file=sys.stderr)
                    else:
                        print(f"Missing or None value for {symptom_key} in row {i}: {row}", file=sys.stderr)
                if len(symptoms) < 2:
                    print(f"Warning: Not enough symptoms for {disease} in row {i} (found {symptoms}), skipping.", file=sys.stderr)
                    continue
                key_symptoms = symptoms[:2]
                optional_symptoms = symptoms[2:] if len(symptoms) > 2 else []
                symptom_disease_map[disease] = {'key': key_symptoms, 'optional': optional_symptoms}
                print(f"Loaded symptoms for {disease} in row {i}: key={key_symptoms}, optional={optional_symptoms}", file=sys.stderr)
    except Exception as e:
        print(json.dumps({"status": "error", "message": f"Erreur lors du chargement du mapping : {str(e)}"}), file=sys.stderr)
        sys.exit(1)

    return symptom_disease_map

def diagnose(symptoms, lang):
    # Normaliser les symptômes saisis
    symptoms = [normalize_string(s) for s in symptoms]
    print(f"Diagnosing with symptoms: {symptoms}, lang: {lang}", file=sys.stderr)
    descriptions, precautions = load_disease_info(lang)
    symptom_disease_map = load_symptom_disease_mapping(lang)

    best_match = None
    best_score = -1

    for disease, symptom_rules in symptom_disease_map.items():
        key_symptoms = set(symptom_rules['key'])
        optional_symptoms = set(symptom_rules['optional'])
        input_symptoms = set(symptoms)

        # Vérifier si tous les symptômes clés sont présents (comme dans CLIPS)
        if key_symptoms and key_symptoms.issubset(input_symptoms):
            # Bonus pour les symptômes optionnels correspondants
            matched_optional = len(optional_symptoms & input_symptoms)
            total_optional = len(optional_symptoms)
            score = 1.0 + (matched_optional / (total_optional + 1) if total_optional > 0 else 0)
            print(f"Matched {disease} with score: {score}, key={key_symptoms}, optional={matched_optional}/{total_optional}", file=sys.stderr)
            if score > best_score:
                best_score = score
                best_match = disease
        else:
            print(f"No match for {disease}: Required keys {key_symptoms} not in {input_symptoms}", file=sys.stderr)

    result = []
    if best_match:
        disease_name = best_match.replace("_", " ").title()
        disease_key = best_match
        result.append({
            "name": disease_name,
            "description": descriptions.get(disease_key, "Description not available."),
            "precautions": precautions.get(disease_key, ["Precaution not available."])
        })
        print(f"Added to result: {disease_name}", file=sys.stderr)

    return {"status": "success", "diseases": result} if result else {"status": "success", "diseases": []}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"status": "error", "message": "No input data provided"}), file=sys.stderr)
        sys.exit(1)

    input_data = sys.argv[1]
    print(f"Entrée brute reçue via sys.argv : {input_data}", file=sys.stderr)

    try:
        data = json.loads(input_data)
        symptoms = data.get("symptoms", [])
        lang = data.get("lang", "en")
    except json.JSONDecodeError as e:
        print(f"Erreur JSON : {str(e)}", file=sys.stderr)
        print(json.dumps({"status": "error", "message": f"Invalid JSON input: {str(e)}"}), file=sys.stderr)
        sys.exit(1)

    result = diagnose(symptoms, lang)
    print(json.dumps(result))