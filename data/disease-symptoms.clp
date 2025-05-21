(defrule is_it_Fungal_infection
   (has_symptom itching)                        ; Clé
   (has_symptom skin_rash)                     ; Clé
   (or (has_symptom nodal_skin_eruptions)      ; Optionnel
       (has_symptom dischromic_patches))       ; Optionnel
   =>
   (assert (disease_is Fungal_infection)))

(defrule is_it_Allergy
   (has_symptom continuous_sneezing)           ; Clé
   (has_symptom watering_from_eyes)            ; Clé
   (or (has_symptom shivering)                 ; Optionnel
       (has_symptom chills))                   ; Optionnel
   =>
   (assert (disease_is Allergy)))

(defrule is_it_GERD
   (has_symptom stomach_pain)                  ; Clé
   (has_symptom acidity)                       ; Clé
   (or (has_symptom ulcers_on_tongue)          ; Optionnel
       (has_symptom vomiting))                 ; Optionnel
   =>
   (assert (disease_is GERD)))

(defrule is_it_Chronic_cholestasis
   (has_symptom yellowish_skin)                ; Clé
   (has_symptom nausea)                        ; Clé
   (or (has_symptom itching)                   ; Optionnel
       (has_symptom vomiting))                 ; Optionnel
   =>
   (assert (disease_is Chronic_cholestasis)))

(defrule is_it_Drug_Reaction
   (has_symptom itching)                       ; Clé
   (has_symptom skin_rash)                     ; Clé
   (or (has_symptom stomach_pain)              ; Optionnel
       (has_symptom burning_micturition))      ; Optionnel
   =>
   (assert (disease_is Drug_Reaction)))

(defrule is_it_Peptic_Ulcer_Disease
   (has_symptom abdominal_pain)                ; Clé
   (has_symptom indigestion)                   ; Clé
   (or (has_symptom vomiting)                  ; Optionnel
       (has_symptom loss_of_appetite))         ; Optionnel
   =>
   (assert (disease_is Peptic_Ulcer_Disease)))

(defrule is_it_AIDS
   (has_symptom muscle_wasting)                ; Clé
   (has_symptom extra_marital_contacts)        ; Clé
   (or (has_symptom patches_in_throat)         ; Optionnel
       (has_symptom high_fever))               ; Optionnel
   =>
   (assert (disease_is AIDS)))

(defrule is_it_Diabetes
   (has_symptom weight_loss)                   ; Clé
   (has_symptom fatigue)                       ; Clé
   (or (has_symptom restlessness)              ; Optionnel
       (has_symptom lethargy))                 ; Optionnel
   =>
   (assert (disease_is Diabetes)))

(defrule is_it_Gastroenteritis
   (has_symptom vomiting)                      ; Clé
   (has_symptom diarrhoea)                     ; Clé
   (or (has_symptom sunken_eyes)               ; Optionnel
       (has_symptom dehydration))              ; Optionnel
   =>
   (assert (disease_is Gastroenteritis)))

(defrule is_it_Bronchial_Asthma
   (has_symptom breathlessness)                ; Clé
   (has_symptom cough)                         ; Clé
   (or (has_symptom fatigue)                   ; Optionnel
       (has_symptom high_fever))               ; Optionnel
   =>
   (assert (disease_is Bronchial_Asthma)))

(defrule is_it_Hypertension
   (has_symptom headache)                      ; Clé
   (has_symptom chest_pain)                    ; Clé
   (or (has_symptom dizziness)                 ; Optionnel
       (has_symptom loss_of_balance))          ; Optionnel
   =>
   (assert (disease_is Hypertension)))

(defrule is_it_Migraine
   (has_symptom headache)                      ; Clé
   (has_symptom blurred_and_distorted_vision)  ; Clé
   (or (has_symptom acidity)                   ; Optionnel
       (has_symptom indigestion))              ; Optionnel
   =>
   (assert (disease_is Migraine)))

(defrule is_it_Cervical_spondylosis
   (has_symptom neck_pain)                     ; Clé
   (has_symptom back_pain)                     ; Clé
   (or (has_symptom weakness_in_limbs)         ; Optionnel
       (has_symptom dizziness))                ; Optionnel
   =>
   (assert (disease_is Cervical_spondylosis)))

(defrule is_it_Paralysis
   (has_symptom weakness_of_one_body_side)     ; Clé
   (has_symptom altered_sensorium)             ; Clé
   (or (has_symptom vomiting)                  ; Optionnel
       (has_symptom headache))                 ; Optionnel
   =>
   (assert (disease_is Paralysis)))

(defrule is_it_Jaundice
   (has_symptom yellowish_skin)                ; Clé
   (has_symptom fatigue)                       ; Clé
   (or (has_symptom itching)                   ; Optionnel
       (has_symptom weight_loss))              ; Optionnel
   =>
   (assert (disease_is Jaundice)))

(defrule is_it_Malaria
   (has_symptom chills)                        ; Clé
   (has_symptom high_fever)                    ; Clé
   (or (has_symptom vomiting)                  ; Optionnel
       (has_symptom sweating))                 ; Optionnel
   =>
   (assert (disease_is Malaria)))

(defrule is_it_Chicken_pox
   (has_symptom itching)                       ; Clé
   (has_symptom skin_rash)                     ; Clé
   (or (has_symptom fatigue)                   ; Optionnel
       (has_symptom lethargy))                 ; Optionnel
   =>
   (assert (disease_is Chicken_pox)))

(defrule is_it_Dengue
   (has_symptom skin_rash)                     ; Clé
   (has_symptom joint_pain)                    ; Clé
   (or (has_symptom chills)                    ; Optionnel
       (has_symptom vomiting))                 ; Optionnel
   =>
   (assert (disease_is Dengue)))

(defrule is_it_Typhoid
   (has_symptom high_fever)                    ; Clé
   (has_symptom fatigue)                       ; Clé
   (or (has_symptom chills)                    ; Optionnel
       (has_symptom vomiting))                 ; Optionnel
   =>
   (assert (disease_is Typhoid)))

(defrule is_it_hepatitis_A
   (has_symptom yellowish_skin)                ; Clé
   (has_symptom dark_urine)                    ; Clé
   (or (has_symptom joint_pain)                ; Optionnel
       (has_symptom vomiting))                 ; Optionnel
   =>
   (assert (disease_is hepatitis_A)))

(defrule is_it_Hepatitis_B
   (has_symptom yellowish_skin)                ; Clé
   (has_symptom fatigue)                       ; Clé
   (or (has_symptom itching)                   ; Optionnel
       (has_symptom lethargy))                 ; Optionnel
   =>
   (assert (disease_is Hepatitis_B)))

(defrule is_it_Hepatitis_C
   (has_symptom yellowish_skin)                ; Clé
   (has_symptom loss_of_appetite)              ; Clé
   (or (has_symptom fatigue)                   ; Optionnel
       (has_symptom nausea))                   ; Optionnel
   =>
   (assert (disease_is Hepatitis_C)))

(defrule is_it_Hepatitis_D
   (has_symptom yellowish_skin)                ; Clé
   (has_symptom fatigue)                       ; Clé
   (or (has_symptom joint_pain)                ; Optionnel
       (has_symptom vomiting))                 ; Optionnel
   =>
   (assert (disease_is Hepatitis_D)))

(defrule is_it_Hepatitis_E
   (has_symptom yellowish_skin)                ; Clé
   (has_symptom high_fever)                    ; Clé
   (or (has_symptom joint_pain)                ; Optionnel
       (has_symptom vomiting))                 ; Optionnel
   =>
   (assert (disease_is Hepatitis_E)))

(defrule is_it_Alcoholic_hepatitis
   (has_symptom yellowish_skin)                ; Clé
   (has_symptom abdominal_pain)                ; Clé
   (or (has_symptom vomiting)                  ; Optionnel
       (has_symptom swelling_of_stomach))      ; Optionnel
   =>
   (assert (disease_is Alcoholic_hepatitis)))

(defrule is_it_Tuberculosis
   (has_symptom weight_loss)                   ; Clé
   (has_symptom fatigue)                       ; Clé
   (or (has_symptom chills)                    ; Optionnel
       (has_symptom vomiting))                 ; Optionnel
   =>
   (assert (disease_is Tuberculosis)))

(defrule is_it_Common_Cold
   (has_symptom continuous_sneezing)           ; Clé
   (has_symptom cough)                         ; Clé
   (or (has_symptom chills)                    ; Optionnel
       (has_symptom fatigue))                  ; Optionnel
   =>
   (assert (disease_is Common_Cold)))

(defrule is_it_Pneumonia
   (has_symptom cough)                         ; Clé
   (has_symptom high_fever)                    ; Clé
   (or (has_symptom chills)                    ; Optionnel
       (has_symptom fatigue))                  ; Optionnel
   =>
   (assert (disease_is Pneumonia)))

(defrule is_it_Dimorphic_Hemorrhoids
   (has_symptom pain_in_anal_region)           ; Clé
   (has_symptom bloody_stool)                  ; Clé
   (or (has_symptom constipation)              ; Optionnel
       (has_symptom pain_during_bowel_movements)) ; Optionnel
   =>
   (assert (disease_is Dimorphic_Hemorrhoids)))

(defrule is_it_Heart_attack
   (has_symptom chest_pain)                    ; Clé
   (has_symptom breathlessness)                ; Clé
   (or (has_symptom vomiting)                  ; Optionnel
       (has_symptom sweating))                 ; Optionnel
   =>
   (assert (disease_is Heart_attack)))

(defrule is_it_Varicose_veins
   (has_symptom bruising)                      ; Clé
   (has_symptom obesity)                       ; Clé
   (or (has_symptom fatigue)                   ; Optionnel
       (has_symptom cramps))                   ; Optionnel
   =>
   (assert (disease_is Varicose_veins)))

(defrule is_it_Hypothyroidism
   (has_symptom weight_gain)                   ; Clé
   (has_symptom fatigue)                       ; Clé
   (or (has_symptom cold_hands_and_feets)      ; Optionnel
       (has_symptom mood_swings))              ; Optionnel
   =>
   (assert (disease_is Hypothyroidism)))

(defrule is_it_Hyperthyroidism
   (has_symptom weight_loss)                   ; Clé
   (has_symptom restlessness)                  ; Clé
   (or (has_symptom fatigue)                   ; Optionnel
       (has_symptom mood_swings))              ; Optionnel
   =>
   (assert (disease_is Hyperthyroidism)))

(defrule is_it_Hypoglycemia
   (has_symptom sweating)                      ; Clé
   (has_symptom anxiety)                       ; Clé
   (or (has_symptom vomiting)                  ; Optionnel
       (has_symptom fatigue))                  ; Optionnel
   =>
   (assert (disease_is Hypoglycemia)))

(defrule is_it_Osteoarthritis
   (has_symptom joint_pain)                    ; Clé
   (has_symptom knee_pain)                     ; Clé
   (or (has_symptom neck_pain)                 ; Optionnel
       (has_symptom hip_joint_pain))           ; Optionnel
   =>
   (assert (disease_is Osteoarthritis)))

(defrule is_it_Arthritis
   (has_symptom swelling_joints)               ; Clé
   (has_symptom movement_stiffness)            ; Clé
   (or (has_symptom muscle_weakness)           ; Optionnel
       (has_symptom stiff_neck))               ; Optionnel
   =>
   (assert (disease_is Arthritis)))

(defrule is_it_Paroxysmal_Positional_Vertigo
   (has_symptom spinning_movements)            ; Clé
   (has_symptom nausea)                        ; Clé
   (or (has_symptom vomiting)                  ; Optionnel
       (has_symptom headache))                 ; Optionnel
   =>
   (assert (disease_is Paroxysmal_Positional_Vertigo)))

(defrule is_it_Acne
   (has_symptom pus_filled_pimples)            ; Clé
   (has_symptom blackheads)                    ; Clé
   (or (has_symptom skin_rash)                 ; Optionnel
       (has_symptom scurring))                 ; Optionnel
   =>
   (assert (disease_is Acne)))

(defrule is_it_Urinary_tract_infection
   (has_symptom burning_micturition)           ; Clé
   (has_symptom continuous_feel_of_urine)      ; Clé
   (or (has_symptom bladder_discomfort)        ; Optionnel
       (has_symptom foul_smell_of_urine))      ; Optionnel
   =>
   (assert (disease_is Urinary_tract_infection)))

(defrule is_it_Psoriasis
   (has_symptom skin_peeling)                  ; Clé
   (has_symptom silver_like_dusting)           ; Clé
   (or (has_symptom skin_rash)                 ; Optionnel
       (has_symptom joint_pain))               ; Optionnel
   =>
   (assert (disease_is Psoriasis)))

(defrule is_it_Impetigo
   (has_symptom red_sore_around_nose)          ; Clé
   (has_symptom blister)                       ; Clé
   (or (has_symptom skin_rash)                 ; Optionnel
       (has_symptom high_fever))               ; Optionnel
   =>
   (assert (disease_is Impetigo)))