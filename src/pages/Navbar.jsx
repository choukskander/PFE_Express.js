import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isDoctorDropdownOpen, setIsDoctorDropdownOpen] = useState(false);
  const [isPatientDropdownOpen, setIsPatientDropdownOpen] = useState(false);
  const navigate = useNavigate();
 
  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsUserDropdownOpen(false); // Close dropdown on logout
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: 'success',
      title: 'Déconnexion réussie !',
    });
    navigate('/login');
  };

  // Toggle dropdowns
  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
    setIsDoctorDropdownOpen(false); // Close other dropdowns
    setIsPatientDropdownOpen(false);
  };

  const toggleDoctorDropdown = () => {
    setIsDoctorDropdownOpen(!isDoctorDropdownOpen);
    setIsUserDropdownOpen(false);
    setIsPatientDropdownOpen(false);
  };

  const togglePatientDropdown = () => {
    setIsPatientDropdownOpen(!isPatientDropdownOpen);
    setIsUserDropdownOpen(false);
    setIsDoctorDropdownOpen(false);
  };

  // Close dropdown when clicking a link
  const handleLinkClick = () => {
    setIsUserDropdownOpen(false);
    setIsDoctorDropdownOpen(false);
    setIsPatientDropdownOpen(false);
  };

  return (
    <>
      {/* Embedded CSS */}
      <style>
        {`
          .dropdown {
            position: relative;
          }

          .dropdown-content {
            display: none;
            position: absolute;
            background-color: white;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
            border-radius: 0.375rem;
            min-width: 160px;
            z-index: 10;
          }

          .dropdown-content.open {
            display: block;
          }
        `}
      </style>

      <header className="bg-white shadow-sm fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <img src="/SmallSquareLogoJpg.jpg" alt="Logo" className="h-16 w-auto" />
              </Link>
            </div>

            <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
             className="no-underline hover:no-underline focus:no-underline text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
            >
             Accueil
            </Link>

              <div className="dropdown relative">
                <button
                  onClick={toggleDoctorDropdown}
                  className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  Espace Médecin <i className="ri-arrow-down-s-line ml-1"></i>
                </button>
                <div className={`dropdown-content rounded-md mt-2 ${isDoctorDropdownOpen ? 'open' : ''}`}>
                  <Link
                    to="/forum"
                    onClick={handleLinkClick}
                    className="no-underline block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Forum Médical
                  </Link>
                  <Link
                    to="/dossiers"
                    onClick={handleLinkClick}
                    className="no-underline block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Partage de Dossiers
                  </Link>
                  <Link
                    to="/recherche-ia"
                    onClick={handleLinkClick}
                    className="no-underline block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Recherche IA
                  </Link>
                </div>
              </div>

              <div className="dropdown relative">
                <button
                  onClick={togglePatientDropdown}
                  className="no-underline text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  Espace Patient <i className="ri-arrow-down-s-line ml-1"></i>
                </button>
                <div className={`dropdown-content rounded-md mt-2 ${isPatientDropdownOpen ? 'open' : ''}`}>
                  <Link
                    to="/diagnostic-ia"
                    onClick={handleLinkClick}
                    className="no-underline block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Diagnostic IA
                  </Link>
                  <Link
                    to="/historique"
                    onClick={handleLinkClick}
                    className="no-underline block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Historique
                  </Link>
                  

{user && user.role === 'patient' && (
  <Link to="/search-doctors" className="no-underline block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
    Rechercher des Médecins
  </Link>
)}
                </div>
              </div>
            </nav>

            <div className="flex items-center space-x-4">
              {user ? (
                <div className="dropdown relative">
                  <button
                    onClick={toggleUserDropdown}
                    className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    {user.prenom} {user.nom} <i className="ri-arrow-down-s-line ml-1"></i>
                  </button>
                  <div className={`dropdown-content rounded-md mt-2 ${isUserDropdownOpen ? 'open' : ''}`}>
                    <Link
                      to="/ProfileScreen"
                      onClick={handleLinkClick}
                      className="no-underline block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profil
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        handleLinkClick();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Déconnexion
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="bg-white text-primary border border-primary px-4 py-2 rounded-button text-sm font-medium hover:bg-primary hover:text-white transition-colors whitespace-nowrap"
                  >
                    Se connecter
                  </Link>
                  <Link
                    to="/register"
                    className="bg-primary text-white px-4 py-2 rounded-button text-sm font-medium hover:bg-blue-600 transition-colors whitespace-nowrap"
                  >
                    S'inscrire
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;