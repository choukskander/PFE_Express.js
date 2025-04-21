import React, { useEffect } from 'react';
import * as echarts from 'echarts';
import Navbar from './Navbar';
import Footer from './Footer';


const Home = () => {
  useEffect(() => {
    const consultationsChart = echarts.init(document.getElementById('consultationsChart'));
    consultationsChart.setOption({
      title: { text: 'Consultations Mensuelles' },
      tooltip: {},
      xAxis: { data: ['Jan', 'Fév', 'Mars', 'Avr'] },
      yAxis: {},
      series: [{ type: 'bar', data: [50, 120, 90, 130] }]
    });

    const accuracyChart = echarts.init(document.getElementById('accuracyChart'));
    accuracyChart.setOption({
      title: { text: 'Précision IA (%)' },
      tooltip: {},
      xAxis: { data: ['2022', '2023', '2024'] },
      yAxis: {},
      series: [{ type: 'line', data: [87, 91, 95] }]
    });
  }, []);

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
              Prenez rendez-vous avec les meilleurs médecins en Tunisie en
              quelques clics. Service rapide, sécurisé et personnalisé.
            </p>

            <div className="bg-white p-4 rounded-lg shadow-lg">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Chercher un médecin par spécialité ou région"
                  className="w-full pl-10 pr-4 py-3 border-none rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-2 !rounded-button whitespace-nowrap cursor-pointer hover:bg-blue-700 transition text-sm">
                  Rechercher
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>


        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Nos Services Principaux
            </h2>
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
                  Accédez à vos diagnostics, consultez votre historique médical et trouvez un spécialiste près de chez vous.
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
