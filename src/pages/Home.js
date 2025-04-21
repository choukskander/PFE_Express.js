import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts';
import Navbar from './Navbar';
import Footer from './Footer';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [specialite, setSpecialite] = useState('');

  // Liste des spécialités prédéfinies
  const specialites = [
    { value: '', label: 'Sélectionner une spécialité' },
    { value: 'Cardiologue', label: 'Cardiologue' },
    { value: 'Dentiste', label: 'Dentiste' },
    { value: 'Dermatologue', label: 'Dermatologue' },
    { value: 'Généraliste', label: 'Généraliste' },
    { value: 'Pédiatre', label: 'Pédiatre' },
    // Ajoutez d'autres spécialités selon vos besoins
  ];

  useEffect(() => {
    const consultationsChart = echarts.init(document.getElementById('consultationsChart'));
    consultationsChart.setOption({
      title: { text: 'Consultations Mensuelles' },
      tooltip: {},
      xAxis: { data: ['Jan', 'Fév', 'Mars', 'Avr'] },
      yAxis: {},
      series: [{ type: 'bar', data: [50, 120, 90, 130] }],
    });

    const accuracyChart = echarts.init(document.getElementById('accuracyChart'));
    accuracyChart.setOption({
      title: { text: 'Précision IA (%)' },
      tooltip: {},
      xAxis: { data: ['2022', '2023', '2024'] },
      yAxis: {},
      series: [{ type: 'line', data: [87, 91, 95] }],
    });
  }, []);

  const validateQuery = () => {
    const cleanedQuery = searchQuery.trim();
    const nameRegex = /^[a-zA-Z\s-]{2,50}$/i;

    if (!specialite) return 'La spécialité est requise.';
    if (cleanedQuery && !nameRegex.test(cleanedQuery)) return 'Ville doit contenir 2-50 lettres, espaces ou tirets.';
    return null;
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    // Vérifier si l'utilisateur est connecté
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      Swal.fire({
        icon: 'warning',
        title: 'Connexion requise',
        text: 'Vous devez être connecté pour effectuer une recherche.',
        toast: true,
        position: 'top-end',
        timer: 3000,
        timerProgressBar: true,
        confirmButtonText: 'Se connecter',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      });
      return;
    }

    // Valider la requête de recherche
    const error = validateQuery();
    if (error) {
      console.log('Home - Erreur de validation:', error, 'specialite:', specialite, 'searchQuery:', searchQuery);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error,
        toast: true,
        position: 'top-end',
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }

    const cleanedQuery = searchQuery.trim();
    console.log('Home - Redirection avec:', { specialite, ville: cleanedQuery });

    // Rediriger avec spécialité et ville (si fournie)
    const queryParams = new URLSearchParams({ specialite });
    if (cleanedQuery) queryParams.append('ville', cleanedQuery);
    navigate(`/search-doctors?${queryParams.toString()}`);
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
            <div className="max-w-xl">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Votre santé, notre priorité
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                Prenez rendez-vous avec les meilleurs médecins en Tunisie en quelques clics. Service rapide, sécurisé et
                personnalisé.
              </p>

              <div className="bg-white p-4 rounded-lg shadow-lg">
                <form onSubmit={handleSearch} className="space-y-4">
                  <div>
                    <label htmlFor="specialite" className="block text-sm font-semibold text-gray-800">
                      Spécialité
                    </label>
                    <select
                      id="specialite"
                      value={specialite}
                      onChange={(e) => setSpecialite(e.target.value)}
                      className="mt-1 block w-full p-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {specialites.map((spec) => (
                        <option key={spec.value} value={spec.value}>
                          {spec.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="relative">
                    <label htmlFor="ville" className="block text-sm font-semibold text-gray-800">
                      Ville (facultatif)
                    </label>
                    <input
                      id="ville"
                      type="text"
                      placeholder="Entrez la ville (ex. Tunis)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="mt-1 block w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <i className="fas fa-search absolute left-3 top-1/2 transform translate-y-2 text-gray-400"></i>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700"
                  >
                    Rechercher
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Nos Services Principaux</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <i className="ri-stethoscope-line text-primary text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Espace Médecins</h3>
                <p className="text-gray-600">
                  Collaborez avec vos pairs, partagez des cas cliniques et accédez à des ressources médicales avancées.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <i className="ri-heart-pulse-line text-primary text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Espace Patients</h3>
                <p className="text-gray-600">
                  Accédez à vos diagnostics, consultez votre historique médical et trouvez un spécialiste près de chez
                  vous.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <i className="ri-robot-line text-primary text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Diagnostic IA</h3>
                <p className="text-gray-600">
                  Profitez des dernières avancées en intelligence artificielle pour un pré-diagnostic rapide et fiable.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-blue-50 to-blue-100 py-10 rounded-lg shadow mx-4 mb-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-lg font-semibold mb-4">Graphiques Statistiques</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div id="consultationsChart" style={{ width: '100%', height: '400px' }}></div>
              <div id="accuracyChart" style={{ width: '100%', height: '400px' }}></div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;