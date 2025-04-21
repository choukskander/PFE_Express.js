import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
//import { Helmet } from 'react-helmet';
import Navbar from './Navbar';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const SearchDoctors = () => {
  const [ville, setVille] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    let errors = {};
    const nameRegex = /^[a-zA-Z\s-]{2,50}$/;

    if (!ville) errors.ville = 'Ville est requise.';
    else if (!nameRegex.test(ville)) errors.ville = 'Ville doit contenir 2-50 lettres, espaces ou tirets.';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: Object.values(formErrors)[0],
        toast: true,
        position: 'top-end',
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/auth/search-doctors`, {
        params: { ville },
      });
      setDoctors(response.data);
      if (response.data.length === 0) {
        Swal.fire({
          icon: 'info',
          title: 'Aucun résultat',
          text: `Aucun médecin trouvé à ${ville}.`,
          toast: true,
          position: 'top-end',
          timer: 3000,
          timerProgressBar: true,
        });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Une erreur s\'est produite lors de la recherche.';
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: errorMessage,
        toast: true,
        position: 'top-end',
        timer: 3000,
        timerProgressBar: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Helmet>
        <title>Rechercher des Médecins - Plateforme Médicale Tunisie</title>
        <meta name="description" content="Recherchez des médecins par ville et consultez les informations de leur cabinet médical." />
      </Helmet> */}
      <Navbar />
      <div className="pt-20 pb-8 px-4">
        <h2 className="text-3xl font-bold text-blue-600 text-center mb-6">Rechercher des Médecins</h2>
        <form onSubmit={handleSearch} className="max-w-lg mx-auto mb-8">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label htmlFor="ville" className="block text-sm font-semibold text-gray-800">Ville</label>
              <input
                id="ville"
                type="text"
                placeholder="Entrez la ville (ex. Tunis)"
                value={ville}
                onChange={(e) => setVille(e.target.value)}
                className="mt-1 block w-full p-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                aria-describedby={formErrors.ville ? 'ville-error' : undefined}
              />
              {formErrors.ville && (
                <p id="ville-error" className="text-red-500 text-sm mt-1">{formErrors.ville}</p>
              )}
            </div>
            <button
              type="submit"
              className="mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400"
              disabled={isLoading}
            >
              {isLoading ? 'Recherche...' : 'Rechercher'}
            </button>
          </div>
        </form>
        <div className="max-w-5xl mx-auto">
          {doctors.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doctor) => (
                <div key={doctor._id} className="bg-white p-6 rounded-lg shadow-lg">
                  <img
                    src={doctor.profileImage || '/placeholder-profile-image.jpg'}
                    alt={`Photo de profil de ${doctor.prenom} ${doctor.nom}`}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                    loading="lazy"
                  />
                  <h3 className="text-xl font-semibold text-gray-800 text-center">
                    Dr. {doctor.prenom} ${doctor.nom}
                  </h3>
                  <p className="text-gray-600 text-center">{doctor.specialite}</p>
                  <p className="text-gray-600 text-center">Ville: ${doctor.ville}</p>
                  <p className="text-gray-600 text-center">Cabinet: ${doctor.localisation}</p>
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
    </div>
  );
};

export default SearchDoctors;