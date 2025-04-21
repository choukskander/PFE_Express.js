// src/context/UserContext.js
import React, { createContext, useState, useContext } from 'react';

// Créer le contexte
const UserContext = createContext();

// Création d'un provider pour fournir l'utilisateur dans l'application
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // L'état de l'utilisateur

  // Logique pour récupérer ou définir l'utilisateur (ajoute ta logique ici)
  const setUserData = (data) => {
    setUser(data); // Par exemple : stocker un utilisateur après la connexion
  };

  return (
    <UserContext.Provider value={{ user, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook pour accéder facilement au contexte de l'utilisateur
export const useUser = () => {
  return useContext(UserContext);
};
