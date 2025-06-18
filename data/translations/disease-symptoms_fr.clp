(defrule est_ce_une_infection_fongique
   (has_symptom démangeaisons)
   (has_symptom éruption_cutanée)
   (or (has_symptom éruptions_nodales_de_la_peau)
       (has_symptom taches_décolorées))
   =>
   (assert (disease_is Infection_fongique)))

(defrule est_ce_une_allergie
   (has_symptom éternuements_continus)
   (has_symptom larmoiements)
   (or (has_symptom frissons)
       (has_symptom éruption_cutanée))
   =>
   (assert (disease_is Allergie)))

(defrule est_ce_un_RGO
   (has_symptom douleur_à_l_estomac)
   (has_symptom acidité)
   (or (has_symptom ulcères_sur_la_langue)
       (has_symptom vomissements))
   =>
   (assert (disease_is RGO)))

(defrule est_ce_une_cholestase_chronique
   (has_symptom peau_jaunâtre)
   (has_symptom nausées)
   (or (has_symptom démangeaisons)
       (has_symptom vomissements))
   =>
   (assert (disease_is Cholestase_chronique)))

(defrule est_ce_une_réaction_médicamenteuse
   (has_symptom démangeaisons)
   (has_symptom éruption_cutanée)
   (or (has_symptom douleur_à_l_estomac)
       (has_symptom brûlure_en_urinant))
   =>
   (assert (disease_is Réaction_médicamenteuse)))

(defrule est_ce_un_ulcère_gastrique
   (has_symptom douleur_abdominale)
   (has_symptom indigestion)
   (or (has_symptom vomissements)
       (has_symptom perte_d_appétit))
   =>
   (assert (disease_is Ulcère_gastrique)))

(defrule est_ce_le_SIDA
   (has_symptom atrophie_musculaire)
   (has_symptom perte_de_poids)
   (or (has_symptom taches_dans_la_gorge)
       (has_symptom fièvre_élevée))
   =>
   (assert (disease_is SIDA)))

(defrule est_ce_le_diabète
   (has_symptom perte_de_poids)
   (has_symptom fatigue)
   (or (has_symptom agitation)
       (has_symptom léthargie))
   =>
   (assert (disease_is Diabète)))

(defrule est_ce_une_gastroentérite
   (has_symptom vomissements)
   (has_symptom diarrhée)
   (or (has_symptom yeux_enfoncés)
       (has_symptom déshydratation))
   =>
   (assert (disease_is Gastroentérite)))

(defrule est_ce_un_asthme_bronchique
   (has_symptom essoufflement)
   (has_symptom toux)
   (or (has_symptom fatigue)
       (has_symptom fièvre_élevée))
   =>
   (assert (disease_is Asthme_bronchique)))

(defrule est_ce_une_hypertension
   (has_symptom mal_de_tête)
   (has_symptom douleur_thoracique)
   (or (has_symptom vertiges)
       (has_symptom perte_d_équilibre))
   =>
   (assert (disease_is Hypertension)))

(defrule est_ce_une_migraine
   (has_symptom mal_de_tête)
   (has_symptom vision_floue_et_déformée)
   (or (has_symptom acidité)
       (has_symptom indigestion))
   =>
   (assert (disease_is Migraine)))

(defrule est_ce_une_spondylose_cervicale
   (has_symptom douleur_cervicale)
   (has_symptom douleur_dans_le_dos)
   (or (has_symptom faiblesse_des_membres)
       (has_symptom vertiges))
   =>
   (assert (disease_is Spondylose_cervicale)))

(defrule est_ce_une_paralysie
   (has_symptom faiblesse_d_un_côté_du_corps)
   (has_symptom altération_de_la_conscience)
   (or (has_symptom vomissements)
       (has_symptom mal_de_tête))
   =>
   (assert (disease_is Paralysie)))

(defrule est_ce_une_jaunisse
   (has_symptom peau_jaunâtre)
   (has_symptom fatigue)
   (or (has_symptom démangeaisons)
       (has_symptom perte_de_poids))
   =>
   (assert (disease_is Jaunisse)))

(defrule est_ce_le_paludisme
   (has_symptom frissons)
   (has_symptom fièvre_élevée)
   (or (has_symptom vomissements)
       (has_symptom transpiration))
   =>
   (assert (disease_is Paludisme)))

(defrule est_ce_la_varicelle
   (has_symptom démangeaisons)
   (has_symptom éruption_cutanée)
   (or (has_symptom fatigue)
       (has_symptom léthargie))
   =>
   (assert (disease_is Varicelle)))

(defrule est_ce_le_dengue
   (has_symptom éruption_cutanée)
   (has_symptom douleur_articulaire)
   (or (has_symptom frissons)
       (has_symptom vomissements))
   =>
   (assert (disease_is Dengue)))

(defrule est_ce_la_typhoïde
   (has_symptom fièvre_élevée)
   (has_symptom fatigue)
   (or (has_symptom frissons)
       (has_symptom douleur_abdominale))
   =>
   (assert (disease_is Typhoïde)))

(defrule est_ce_l_hépatite_A
   (has_symptom peau_jaunâtre)
   (has_symptom urine_sombre)
   (or (has_symptom douleur_articulaire)
       (has_symptom vomissements))
   =>
   (assert (disease_is Hépatite_A)))

(defrule est_ce_l_hépatite_B
   (has_symptom peau_jaunâtre)
   (has_symptom démangeaisons)
   (or (has_symptom fatigue)
       (has_symptom léthargie))
   =>
   (assert (disease_is Hépatite_B)))

(defrule est_ce_l_hépatite_C
   (has_symptom peau_jaunâtre)
   (has_symptom perte_d_appétit)
   (or (has_symptom fatigue)
       (has_symptom nausées))
   =>
   (assert (disease_is Hépatite_C)))

(defrule est_ce_l_hépatite_D
   (has_symptom peau_jaunâtre)
   (has_symptom douleur_articulaire)
   (or (has_symptom fatigue)
       (has_symptom vomissements))
   =>
   (assert (disease_is Hépatite_D)))

(defrule est_ce_l_hépatite_E
   (has_symptom peau_jaunâtre)
   (has_symptom fièvre_élevée)
   (or (has_symptom douleur_articulaire)
       (has_symptom vomissements))
   =>
   (assert (disease_is Hépatite_E)))

(defrule est_ce_l_hépatite_alcoolique
   (has_symptom peau_jaunâtre)
   (has_symptom douleur_abdominale)
   (or (has_symptom vomissements)
       (has_symptom gonflement_de_l_estomac))
   =>
   (assert (disease_is Hépatite_alcoolique)))

(defrule est_ce_la_tuberculose
   (has_symptom perte_de_poids)
   (has_symptom toux)
   (or (has_symptom frissons)
       (has_symptom fatigue))
   =>
   (assert (disease_is Tuberculose)))

(defrule est_ce_le_rhume_commun
   (has_symptom éternuements_continus)
   (has_symptom toux)
   (or (has_symptom frissons)
       (has_symptom fatigue))
   =>
   (assert (disease_is Rhume_commun)))

(defrule est_ce_une_pneumonie
   (has_symptom toux)
   (has_symptom fièvre_élevée)
   (or (has_symptom frissons)
       (has_symptom fatigue))
   =>
   (assert (disease_is Pneumonie)))

(defrule est_ce_les_hémorroïdes_dimorphiques
   (has_symptom douleur_dans_la_région_anale)
   (has_symptom selles_sanglantes)
   (or (has_symptom constipation)
       (has_symptom douleur_pendant_les_selles))
   =>
   (assert (disease_is Hémorroïdes_dimorphiques)))

(defrule est_ce_une_crise_cardiaque
   (has_symptom douleur_thoracique)
   (has_symptom essoufflement)
   (or (has_symptom vomissements)
       (has_symptom transpiration))
   =>
   (assert (disease_is Crise_cardiaque)))

(defrule est_ce_les_varices
   (has_symptom ecchymoses)
   (has_symptom obésité)
   (or (has_symptom fatigue)
       (has_symptom crampes))
   =>
   (assert (disease_is Varices)))

(defrule est_ce_l_hypothyroïdie
   (has_symptom gain_de_poids)
   (has_symptom fatigue)
   (or (has_symptom mains_et_pieds_froids)
       (has_symptom changements_d_humeur))
   =>
   (assert (disease_is Hypothyroïdie)))

(defrule est_ce_l_hyperthyroïdie
   (has_symptom perte_de_poids)
   (has_symptom agitation)
   (or (has_symptom fatigue)
       (has_symptom changements_d_humeur))
   =>
   (assert (disease_is Hyperthyroïdie)))

(defrule est_ce_l_hypoglycémie
   (has_symptom transpiration)
   (has_symptom anxiété)
   (or (has_symptom vomissements)
       (has_symptom fatigue))
   =>
   (assert (disease_is Hypoglycémie)))

(defrule est_ce_l_ostéoarthrite
   (has_symptom douleur_articulaire)
   (has_symptom douleur_au_genou)
   (or (has_symptom douleur_cervicale)
       (has_symptom douleur_à_la_hanche))
   =>
   (assert (disease_is Ostéoarthrite)))

(defrule est_ce_l_arthrite
   (has_symptom gonflement_des_articulations)
   (has_symptom raideur_des_mouvements)
   (or (has_symptom faiblesse_musculaire)
       (has_symptom raideur_de_la_nuque))
   =>
   (assert (disease_is Arthrite)))

(defrule est_ce_le_vertige_positionnel_paroxystique
   (has_symptom mouvements_de_rotation)
   (has_symptom nausées)
   (or (has_symptom vomissements)
       (has_symptom mal_de_tête))
   =>
   (assert (disease_is Vertige_positionnel_paroxystique)))

(defrule est_ce_l_acné
   (has_symptom pustules)
   (has_symptom points_noirs)
   (or (has_symptom éruption_cutanée)
       (has_symptom desquamation))
   =>
   (assert (disease_is Acné)))

(defrule est_ce_une_infection_urinaire
   (has_symptom brûlure_en_urinant)
   (has_symptom sensation_continue_d_uriner)
   (or (has_symptom inconfort_de_la_vessie)
       (has_symptom odeur_fétide_de_l_urine))
   =>
   (assert (disease_is Infection_urinaire)))

(defrule est_ce_le_psoriasis
   (has_symptom pellicule_de_peau)
   (has_symptom poussière_argentée)
   (or (has_symptom éruption_cutanée)
       (has_symptom douleur_articulaire))
   =>
   (assert (disease_is Psoriasis)))

(defrule est_ce_l_impétigo
   (has_symptom plaie_rouge_autour_du_nez)
   (has_symptom vésicule)
   (or (has_symptom éruption_cutanée)
       (has_symptom fièvre_élevée))
   =>
   (assert (disease_is Impétigo)))