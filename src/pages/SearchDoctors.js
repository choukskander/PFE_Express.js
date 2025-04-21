import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Navbar from './Navbar';
import { useLocation } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const SearchDoctors = () => {
  const location = useLocation();
  const [ville, setVille] = useState('');
  const [specialite, setSpecialite] = useState('');
  const [nom, setNom] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [specialites, setSpecialites] = useState([
    { value: '', label: 'Sélectionner une spécialité' },
  ]);

  // Charger les spécialités dynamiquement depuis le backend
  useEffect(() => {
    const fetchSpecialites = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/specialites`);
        setSpecialites(response.data);
      } catch (err) {
        console.error('Erreur lors de la récupération des spécialités:', err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de charger les spécialités. Veuillez réessayer plus tard.',
          toast: true,
          position: 'top-end',
          timer: 3000,
          timerProgressBar: true,
        });
      }
    };
    fetchSpecialites();
  }, []);

  // Extraire nom, spécialité et ville depuis l'URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const villeFromUrl = params.get('ville');
    const specialiteFromUrl = params.get('specialite');
    const nomFromUrl = params.get('nom');
    console.log('SearchDoctors - URL params:', { nomFromUrl, specialiteFromUrl, villeFromUrl });

    if (nomFromUrl) setNom(decodeURIComponent(nomFromUrl));
    if (specialiteFromUrl) setSpecialite(decodeURIComponent(specialiteFromUrl));
    if (villeFromUrl) setVille(decodeURIComponent(villeFromUrl));
  }, [location.search]);

  // Déclencher la recherche automatique si au moins un critère est présent
  useEffect(() => {
    if (nom || specialite || ville) {
      console.log('SearchDoctors - Déclenchement recherche automatique:', { nom, specialite, ville });
      handleSearch({ preventDefault: () => {} }, true);
    }
// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nom, specialite, ville]);

  const validateForm = (isAutoSearch = false) => {
    let errors = {};
    const cleanedVille = ville.trim();
    const cleanedSpecialite = specialite.trim();
    const cleanedNom = nom.trim();

    console.log('SearchDoctors - Validation:', { nom: cleanedNom, specialite: cleanedSpecialite, ville: cleanedVille });

    if (!cleanedNom && !cleanedSpecialite && !cleanedVille) {
      errors.general = 'Veuillez spécifier au moins un critère (nom, spécialité ou ville).';
    } else {
      const nameRegex = /^[a-zA-Z\s-]{2,50}$/i;
      if (cleanedNom && !isAutoSearch && !nameRegex.test(cleanedNom)) {
        errors.nom = 'Le nom doit contenir 2-50 lettres, espaces ou tirets.';
      }
      if (cleanedSpecialite && !isAutoSearch && !nameRegex.test(cleanedSpecialite)) {
        errors.specialite = 'La spécialité doit contenir 2-50 lettres, espaces ou tirets.';
      }
      if (cleanedVille && !isAutoSearch && !nameRegex.test(cleanedVille)) {
        errors.ville = 'La ville doit contenir 2-50 lettres, espaces ou tirets.';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSearch = async (e, isAutoSearch = false) => {
    e.preventDefault();
    const cleanedVille = ville.trim();
    const cleanedSpecialite = specialite.trim();
    const cleanedNom = nom.trim();
    console.log('SearchDoctors - Recherche avec:', { nom: cleanedNom, specialite: cleanedSpecialite, ville: cleanedVille });

    if (!validateForm(isAutoSearch)) {
      console.log('SearchDoctors - Erreurs de validation:', formErrors);
      if (!isAutoSearch) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: formErrors.general || Object.values(formErrors)[0],
          toast: true,
          position: 'top-end',
          timer: 3000,
          timerProgressBar: true,
        });
      }
      return;
    }

    setIsLoading(true);
    try {
      const params = {};
      if (cleanedNom) params.nom = cleanedNom;
      if (cleanedSpecialite) params.specialite = cleanedSpecialite;
      if (cleanedVille) params.ville = cleanedVille;

      const response = await axios.get(`${API_URL}/api/auth/search-doctors`, { params });
      console.log('SearchDoctors - Réponse du backend:', response.data);
      setDoctors(response.data.doctors || response.data);
      if ((response.data.doctors || response.data).length === 0) {
        Swal.fire({
          icon: 'info',
          title: 'Aucun résultat',
          text: `Aucun médecin trouvé pour les critères spécifiés.`,
          toast: true,
          position: 'top-end',
          timer: 3000,
          timerProgressBar: true,
        });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Une erreur s\'est produite lors de la recherche.';
      console.error('SearchDoctors - Erreur:', err);
      if (!isAutoSearch) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: errorMessage,
          toast: true,
          position: 'top-end',
          timer: 3000,
          timerProgressBar: true,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="pt-24">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://readdy.ai/api/search-image?query=A%20professional%20medical%20scene%20with%20a%20smiling%20doctor%20in%20white%20coat%20consulting%20with%20patients%20in%20a%20modern%20bright%20clinic%20with%20light%20blue%20accents%2C%20soft%20lighting%2C%20medical%20equipment%20visible%20in%20background%2C%20warm%20and%20welcoming%20atmosphere%2C%20high%20quality%20professional%20photography&width=1440&height=600&seq=hero1&orientation=landscape"
              alt="Médecin avec patients"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent"></div>
          </div>

          <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
            <h2 className="text-3xl font-bold text-blue-600 text-center mb-6">Rechercher des Médecins</h2>
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-4xl mx-auto">
              <form onSubmit={(e) => handleSearch(e, false)} className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1">
                  <label htmlFor="nom" className="block text-sm font-semibold text-gray-800 mb-1">
                    Nom du médecin
                  </label>
                  <div className="relative">
                    <input
                      id="nom"
                      type="text"
                      placeholder="   Entrez le nom"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      className="w-full p-3 pl-16 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
                      aria-describedby={formErrors.nom ? 'nom-error' : undefined}
                    />
                    <i className="fas fa-user-md absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300"></i>
                  </div>
                  {formErrors.nom && (
                    <p id="nom-error" className="text-red-500 text-sm mt-1">{formErrors.nom}</p>
                  )}
                </div>
                <div className="flex-1">
                  <label htmlFor="specialite" className="block text-sm font-semibold text-gray-800 mb-1">
                    Spécialité
                  </label>
                  <div className="relative">
                    <select
                      id="specialite"
                      value={specialite}
                      onChange={(e) => setSpecialite(e.target.value)}
                      className="w-full p-3 pl-16 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 appearance-none text-gray-500"
                      aria-describedby={formErrors.specialite ? 'specialite-error' : undefined}
                    >
                      {specialites.map((spec) => (
                        <option key={spec.value} value={spec.value}>
                          {spec.label}
                        </option>
                      ))}
                    </select>
                    
                  </div>
                  {formErrors.specialite && (
                    <p id="specialite-error" className="text-red-500 text-sm mt-1">{formErrors.specialite}</p>
                  )}
                </div>
                <div className="flex-1">
                  <label htmlFor="ville" className="block text-sm font-semibold text-gray-800 mb-1">
                    Ville
                  </label>
                  <div className="relative">
                    <input
                      id="ville"
                      type="text"
                      placeholder="  Entrez la ville"
                      value={ville}
                      onChange={(e) => setVille(e.target.value)}
                      className="w-full p-3 pl-16 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
                      aria-describedby={formErrors.ville ? 'ville-error' : undefined}
                    />
                    <i className="fas fa-map-marker-alt absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300"></i>
                  </div>
                  {formErrors.ville && (
                    <p id="ville-error" className="text-red-500 text-sm mt-1">{formErrors.ville}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="mt-4 md:mt-0 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                  disabled={isLoading}
                >
                  <i className="fas fa-search mr-2"></i>
                  {isLoading ? 'Recherche...' : 'Rechercher'}
                </button>
              </form>
            </div>
            <div className="max-w-5xl mx-auto mt-8">
              {doctors.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {doctors.map((doctor) => (
                    <div key={doctor._id} className="bg-white p-6 rounded-lg shadow-lg">
                           <img
            src={doctor.profileImage || '/placeholder-profile-image.jpg'}
            alt={`Profil du Dr. ${doctor.prenom} ${doctor.nom}`}
            className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
            loading="lazy"
          />
                      <h3 className="text-xl font-semibold text-gray-800 text-center">
                        Dr. {doctor.prenom} {doctor.nom}
                      </h3>
                      <p className="text-gray-600 text-center">{doctor.specialite}</p>
                      <p className="text-gray-600 text-center">Ville: {doctor.ville}</p>
                      <p className="text-gray-600 text-center">Cabinet: {doctor.localisation}</p>
                      <button
                        onClick={() => {
                          Swal.fire({
                            title: `Dr. ${doctor.prenom} ${doctor.nom}`,
                            html: `
                              <p><strong>Spécialité:</strong> ${doctor.specialite}</p>
                              <p><strong>Ville:</strong> ${doctor.ville}</p>
                              <p><strong>Localisation:</strong> ${doctor.localisation}</p>
                            `,
                            icon: 'info',
                            confirmButtonText: 'Fermer',
                          });
                        }}
                        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
                      >
                        Voir les détails
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SearchDoctors;