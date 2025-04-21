import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("user"));
    if (localUser) setUser(localUser);
  }, []);

  if (!user) return <p>Chargement...</p>;

  return (
    <div className="dashboard">
      <h2>Bienvenue, {user.name}</h2>
      <p>Votre rôle : {user.role}</p>
      <button onClick={() => { localStorage.removeItem("user"); window.location.href = "/login"; }}>
        Se déconnecter
      </button>
    </div>
  );
};

export default Dashboard;
