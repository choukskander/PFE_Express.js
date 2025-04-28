// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Swal from 'sweetalert2';
// import Navbar from './Navbar';
// import { useNavigate } from 'react-router-dom';

// const DoctorAppointments = () => {
//   const navigate = useNavigate();
//   const [appointments, setAppointments] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchAppointments = async () => {
//       const token = localStorage.getItem('token');
//       const user = JSON.parse(localStorage.getItem('user'));

//       if (!user || user.role !== 'internaute') {
//         Swal.fire({
//           icon: 'warning',
//           title: 'Connexion requise',
//           text: 'Vous devez être connecté en tant que médecin pour voir vos rendez-vous.',
//           toast: true,
//           position: 'top-end',
//           timer: 3000,
//           timerProgressBar: true,
//         });
//         navigate('/login');
//         return;
//       }

//       if (!token) {
//         Swal.fire({
//           icon: 'warning',
//           title: 'Session expirée',
//           text: 'Votre session a expiré. Veuillez vous reconnecter.',
//           toast: true,
//           position: 'top-end',
//           timer: 3000,
//           timerProgressBar: true,
//         });
//         localStorage.clear();
//         navigate('/login');
//         return;
//       }

//       setIsLoading(true);
//       setError(null);

//       try {
//         const response = await axios.get('http://localhost:5000/api/appointments/doctor', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         console.log('Réponse du backend:', response.data);
//         setAppointments(response.data || []);
//       } catch (err) {
//         console.error('Erreur lors de la récupération des rendez-vous:', err);
//         setError(err.response?.data?.message || 'Impossible de charger les rendez-vous.');
//         if (err.response?.status === 401) {
//           Swal.fire({
//             icon: 'warning',
//             title: 'Session expirée',
//             text: 'Votre session a expiré. Veuillez vous reconnecter.',
//             toast: true,
//             position: 'top-end',
//             timer: 3000,
//             timerProgressBar: true,
//           });
//           localStorage.clear();
//           navigate('/login');
//         }
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchAppointments();
//   }, [navigate]);

//   // Fonction pour mettre à jour le statut d’un rendez-vous
//   const handleStatusChange = async (appointmentId, newStatus) => {
//     const token = localStorage.getItem('token');

//     if (!token) {
//       Swal.fire({
//         icon: 'warning',
//         title: 'Session expirée',
//         text: 'Votre session a expiré. Veuillez vous reconnecter.',
//         toast: true,
//         position: 'top-end',
//         timer: 3000,
//         timerProgressBar: true,
//       });
//       localStorage.clear();
//       navigate('/login');
//       return;
//     }

//     try {
//       const response = await axios.put(
//         `http://localhost:5000/api/appointments/${appointmentId}/status`,
//         { status: newStatus },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       // Mettre à jour l’état local avec le rendez-vous modifié
//       setAppointments((prevAppointments) =>
//         prevAppointments.map((appt) =>
//           appt._id === appointmentId ? { ...appt, status: newStatus } : appt
//         )
//       );

//       Swal.fire({
//         icon: 'success',
//         title: 'Succès',
//         text: 'Statut du rendez-vous mis à jour avec succès.',
//         toast: true,
//         position: 'top-end',
//         timer: 3000,
//         timerProgressBar: true,
//       });
//     } catch (err) {
//       console.error('Erreur lors de la mise à jour du statut:', err);
//       Swal.fire({
//         icon: 'error',
//         title: 'Erreur',
//         text: err.response?.data?.message || 'Impossible de mettre à jour le statut.',
//         toast: true,
//         position: 'top-end',
//         timer: 3000,
//         timerProgressBar: true,
//       });

//       if (err.response?.status === 401) {
//         localStorage.clear();
//         navigate('/login');
//       }
//     }
//   };

//   return (
//     <div className="bg-gray-100 min-h-screen">
//       <Navbar />
//       <main className="pt-24 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-6xl mx-auto">
//           <h2 className="text-3xl font-bold text-blue-600 mb-8 text-center">
//             Mes Rendez-vous
//           </h2>

//           {isLoading && (
//             <div className="flex justify-center items-center">
//               <svg
//                 className="animate-spin h-8 w-8 text-blue-600"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//               >
//                 <circle
//                   className="opacity-25"
//                   cx="12"
//                   cy="12"
//                   r="10"
//                   stroke="currentColor"
//                   strokeWidth="4"
//                 />
//                 <path
//                   className="opacity-75"
//                   fill="currentColor"
//                   d="M4 12a8 8 0 018-8v8H4z"
//                 />
//               </svg>
//               <span className="ml-2 text-gray-600">Chargement...</span>
//             </div>
//           )}

//           {error && !isLoading && (
//             <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">
//               <p>{error}</p>
//             </div>
//           )}

//           {!isLoading && !error && appointments.length === 0 && (
//             <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded-lg text-center">
//               <p>Aucun rendez-vous pour le moment.</p>
//             </div>
//           )}

//           {!isLoading && !error && appointments.length > 0 && (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {appointments.map((appt) => (
//                 <div
//                   key={appt._id}
//                   className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
//                 >
//                   <div className="flex items-center mb-4">
//                     <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
//                       <svg
//                         className="w-6 h-6 text-blue-600"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                         xmlns="http://www.w3.org/2000/svg"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth="2"
//                           d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                         />
//                       </svg>
//                     </div>
//                     <h3 className="ml-4 text-lg font-semibold text-gray-800">
//                       {appt.patientId.nom} {appt.patientId.prenom}
//                     </h3>
//                   </div>
//                   <div className="space-y-2">
//                     <p className="text-gray-600">
//                       <span className="font-medium">Email:</span>{' '}
//                       {appt.patientId.email}
//                     </p>
//                     <p className="text-gray-600">
//                       <span className="font-medium">Date:</span> {appt.date}
//                     </p>
//                     <p className="text-gray-600">
//                       <span className="font-medium">Heure:</span> {appt.time}
//                     </p>
//                     <p className="text-gray-600">
//                       <span className="font-medium">Jour:</span> {appt.day}
//                     </p>
//                     <div className="flex items-center space-x-2">
//                       <span className="font-medium text-gray-600">Statut:</span>
//                       <select
//                         value={appt.status}
//                         onChange={(e) => handleStatusChange(appt._id, e.target.value)}
//                         className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-blue-500 focus:border-blue-500"
//                       >
//                         <option value="pending">En attente</option>
//                         <option value="confirmed">Confirmé</option>
//                         <option value="cancelled">Annulé</option>
//                       </select>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default DoctorAppointments;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const DoctorAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAppointments = async () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    console.log('Logged-in user:', user);

    if (!user || user.role !== 'internaute') {
      Swal.fire({
        icon: 'warning',
        title: 'Connexion requise',
        text: 'Vous devez être connecté en tant que médecin pour voir vos rendez-vous.',
        toast: true,
        position: 'top-end',
        timer: 3000,
        timerProgressBar: true,
      });
      navigate('/login');
      return;
    }

    if (!token) {
      Swal.fire({
        icon: 'warning',
        title: 'Session expirée',
        text: 'Votre session a expiré. Veuillez vous reconnecter.',
        toast: true,
        position: 'top-end',
        timer: 3000,
        timerProgressBar: true,
      });
      localStorage.clear();
      navigate('/login');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get('http://localhost:5000/api/appointments/doctor', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Réponse du backend (détails):', response.data);
      setAppointments(response.data || []);
    } catch (err) {
      console.error('Erreur lors de la récupération des rendez-vous:', err);
      setError(err.response?.data?.message || 'Impossible de charger les rendez-vous.');
      if (err.response?.status === 401) {
        Swal.fire({
          icon: 'warning',
          title: 'Session expirée',
          text: 'Votre session a expiré. Veuillez vous reconnecter.',
          toast: true,
          position: 'top-end',
          timer: 3000,
          timerProgressBar: true,
        });
        localStorage.clear();
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [navigate]);

  useEffect(() => {
    console.log('Appointments state (détails):', appointments);
  }, [appointments]);

  const handleStatusChange = async (appointmentId, newStatus) => {
    const token = localStorage.getItem('token');

    if (!token) {
      Swal.fire({
        icon: 'warning',
        title: 'Session expirée',
        text: 'Votre session a expiré. Veuillez vous reconnecter.',
        toast: true,
        position: 'top-end',
        timer: 3000,
        timerProgressBar: true,
      });
      localStorage.clear();
      navigate('/login');
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/appointments/${appointmentId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Mise à jour statut - Réponse API:', response.data);

      await fetchAppointments();

      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Statut du rendez-vous mis à jour avec succès.',
        toast: true,
        position: 'top-end',
        timer: 3000,
        timerProgressBar: true,
      });
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut:', err);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: err.response?.data?.message || 'Impossible de mettre à jour le statut.',
        toast: true,
        position: 'top-end',
        timer: 3000,
        timerProgressBar: true,
      });

      if (err.response?.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    }
  };

  const joinMeeting = async (appointment) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const doctorName = `${user.prenom} ${user.nom}`;
    const patientName = `${appointment.patientId.prenom} ${appointment.patientId.nom}`;
    const roomName = `Meeting-${appointment._id.slice(-8)}`;

    console.log('Generated roomName:', roomName);

    // Send the meeting link to the patient via the backend
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        `http://localhost:5000/api/appointments/${appointment._id}/send-meeting-link`,
        { roomName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Meeting link sent to patient successfully');
    } catch (error) {
      console.error('Error sending meeting link to patient:', error.response?.data?.message || error.message);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Échec de l’envoi du lien de réunion au patient.',
        toast: true,
        position: 'top-end',
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }

    // Navigate to the meeting
    navigate('/meeting', {
      state: {
        userName: doctorName,
        patientName: patientName,
        roomName: roomName,
      },
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <main className="pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-blue-600 mb-8 text-center">
            Mes Rendez-vous
          </h2>

          {isLoading && (
            <div className="flex justify-center items-center">
              <svg
                className="animate-spin h-8 w-8 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              <span className="ml-2 text-gray-600">Chargement...</span>
            </div>
          )}

          {error && !isLoading && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">
              <p>{error}</p>
            </div>
          )}

          {!isLoading && !error && appointments.length === 0 && (
            <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded-lg text-center">
              <p>Aucun rendez-vous pour le moment.</p>
            </div>
          )}

          {!isLoading && !error && appointments.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {appointments.map((appt) => {
                console.log(`Appointment ${appt._id} status:`, appt.status);
                console.log(
                  `Status length for ${appt._id}:`,
                  appt.status ? appt.status.length : 'undefined'
                );
                console.log(
                  `Condition result for ${appt._id}:`,
                  (appt.status || '').toLowerCase() === 'confirmed'
                );
                return (
                  <div
                    key={appt._id}
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <h3 className="ml-4 text-lg font-semibold text-gray-800">
                        {appt.patientId.nom} {appt.patientId.prenom}
                      </h3>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-600">
                        <span className="font-medium">Email:</span>{' '}
                        {appt.patientId.email}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Date:</span> {appt.date}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Heure:</span> {appt.time}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Jour:</span> {appt.day}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-600">Statut:</span>
                        <select
                          value={appt.status}
                          onChange={(e) => handleStatusChange(appt._id, e.target.value)}
                          className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="pending">En attente</option>
                          <option value="confirmed">Confirmé</option>
                          <option value="cancelled">Annulé</option>
                        </select>
                      </div>
                      {(appt.status || '').trim().toLowerCase() === 'confirmed' ? (
                        <button
                          onClick={() => joinMeeting(appt)}
                          className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                        >
                          Rejoindre la réunion
                        </button>
                      ) : (
                        <p className="mt-4 text-gray-600">
                          Statut non confirmé (actuel: {appt.status})
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DoctorAppointments;