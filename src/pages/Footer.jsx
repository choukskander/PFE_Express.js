// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">À propos</h3>
            <p className="text-gray-400">
              Plateforme médicale innovante combinant expertise médicale et intelligence artificielle.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Accueil</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Services</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Légal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Conditions d'utilisation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Politique de confidentialité</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Mentions légales</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-400">
                <i className="ri-map-pin-line mr-2"></i>
                123 Rue de la Médecine, Tunis
              </li>
              <li className="flex items-center text-gray-400">
                <i className="ri-phone-line mr-2"></i>
                +33 1 23 45 67 89
              </li>
              <li className="flex items-center text-gray-400">
                <i className="ri-mail-line mr-2"></i>
                contact@plateforme-medicale.tn
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Rdv-Med. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
