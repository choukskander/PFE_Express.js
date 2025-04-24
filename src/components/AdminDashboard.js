import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Row, Col, Badge, Nav, Table } from 'react-bootstrap';
import { FaUserMd, FaUsers, FaUserShield, FaSignOutAlt, FaChevronLeft, FaChevronRight, FaCalendarAlt } from 'react-icons/fa';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ArcElement);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tous');
  const [userTypeFilter, setUserTypeFilter] = useState('Tous');
  const [dateFilter, setDateFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [appointmentStatusFilter, setAppointmentStatusFilter] = useState('Tous');
  const [doctorValidationFilter, setDoctorValidationFilter] = useState('Tous');

  // Fetch users and appointments from the API
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const usersResponse = await axios.get('http://localhost:5000/api/auth/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('API Response (users):', usersResponse.data);
        setUsers(usersResponse.data);

        const appointmentsResponse = await axios.get('http://localhost:5000/api/appointments', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('API Response (appointments):', appointmentsResponse.data);
        setAppointments(appointmentsResponse.data);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        console.error('Error response:', err.response);
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: err.response?.data?.message || 'Une erreur s\'est produite lors de la récupération des données.',
          toast: true,
          position: 'top-end',
          timer: 3000,
          timerProgressBar: true,
        });
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };

    fetchData();
  }, [navigate]);

  // Filter users
  const medecins = users.filter((user) => user.role === 'internaute');
  const patients = users.filter((user) => user.role === 'patient');
  const admins = users.filter((user) => user.role === 'admin');

  // Statistics for widgets
  const stats = {
    totalUsers: users.length,
    newUsers: users.filter((user) => {
      const registrationDate = new Date(user.createdAt);
      const now = new Date();
      const diffDays = (now - registrationDate) / (1000 * 60 * 60 * 24);
      return diffDays <= 30;
    }).length,
    activeUsers: users.filter((user) => user.validated).length,
    appointments: appointments.filter((appointment) => appointment.status === 'confirmed').length,
  };

  // Combined user list for the table
  const allUsers = users.map((user) => {
    const mappedUser = {
      id: user._id,
      name: `${user.nom} ${user.prenom}`,
      email: user.email,
      type: user.role === 'internaute' ? 'Médecin' : user.role === 'patient' ? 'Patient' : 'Admin',
      date: user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'N/A',
      status: user.validated ? 'Actif' : 'Inactif',
      validated: user.validated,
      specialite: user.specialite,
      ville: user.ville,
      localisation: user.localisation,
      licenceProfessionnelle: user.licenceProfessionnelle,
      profileImage: user.profileImage,
    };
    console.log('Mapped User:', mappedUser);
    return mappedUser;
  });

  // Filter users for the table
  const filteredUsers = allUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'Tous' ||
      (statusFilter === 'Actifs' && user.status === 'Actif') ||
      (statusFilter === 'Inactifs' && user.status === 'Inactif');
    const matchesType =
      userTypeFilter === 'Tous' || userTypeFilter === user.type;
    const matchesDate = !dateFilter || user.date.includes(dateFilter);

    return matchesSearch && matchesStatus && matchesType && matchesDate;
  });

  // Filter doctors for validation status
  const filteredMedecins = medecins.filter((medecin) => {
    if (doctorValidationFilter === 'Tous') return true;
    if (doctorValidationFilter === 'Validés') return medecin.validated;
    if (doctorValidationFilter === 'Non Validés') return !medecin.validated;
    return true;
  });

  // Filter appointments for the table
  const filteredAppointments = appointments.filter((appointment) => {
    const matchesStatus =
      appointmentStatusFilter === 'Tous' ||
      appointment.status === appointmentStatusFilter.toLowerCase();
    return matchesStatus;
  });

  // Calculate appointments by status per month for the last 7 months (October 2024 to April 2025)
  const calculateAppointmentsByStatusPerMonth = () => {
    const months = [];
    const monthLabels = [];
    const now = new Date(); // Current date: April 23, 2025
    const endMonth = now.getMonth(); // 3 (April)
    const endYear = now.getFullYear(); // 2025

    // Generate the last 7 months (from October 2024 to April 2025)
    for (let i = 6; i >= 0; i--) {
      const date = new Date(endYear, endMonth - i, 1);
      const month = date.getMonth(); // 0-11
      const year = date.getFullYear();
      months.push({ month, year });
      monthLabels.push(date.toLocaleString('fr-FR', { month: 'short' })); // e.g., "oct.", "nov.", etc.
    }

    // Count appointments for each status per month
    const confirmedData = months.map(({ month, year }) => {
      return appointments.filter((appointment) => {
        const appointmentDate = new Date(appointment.date);
        return (
          appointmentDate.getMonth() === month &&
          appointmentDate.getFullYear() === year &&
          appointment.status === 'confirmed'
        );
      }).length;
    });

    const pendingData = months.map(({ month, year }) => {
      return appointments.filter((appointment) => {
        const appointmentDate = new Date(appointment.date);
        return (
          appointmentDate.getMonth() === month &&
          appointmentDate.getFullYear() === year &&
          appointment.status === 'pending'
        );
      }).length;
    });

    const cancelledData = months.map(({ month, year }) => {
      return appointments.filter((appointment) => {
        const appointmentDate = new Date(appointment.date);
        return (
          appointmentDate.getMonth() === month &&
          appointmentDate.getFullYear() === year &&
          appointment.status === 'cancelled'
        );
      }).length;
    });

    return { labels: monthLabels, confirmedData, pendingData, cancelledData };
  };

  const { labels, confirmedData, pendingData, cancelledData } = calculateAppointmentsByStatusPerMonth();

  // Data for Stacked Bar Chart (Appointments by Status per Month)
  const barChartData = {
    labels, // e.g., ['oct.', 'nov.', 'déc.', 'janv.', 'févr.', 'mars', 'avr.']
    datasets: [
      {
        label: 'Confirmé',
        data: confirmedData,
        backgroundColor: 'rgba(40, 167, 69, 0.6)', // Green
        borderColor: '#28a745',
        borderWidth: 1,
      },
      {
        label: 'En attente',
        data: pendingData,
        backgroundColor: 'rgba(255, 193, 7, 0.6)', // Yellow
        borderColor: '#ffc107',
        borderWidth: 1,
      },
      {
        label: 'Annulé',
        data: cancelledData,
        backgroundColor: 'rgba(220, 53, 69, 0.6)', // Red
        borderColor: '#dc3545',
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Rendez-vous par Statut par Mois',
        font: { size: 14 },
      },
    },
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: 'Mois',
        },
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: 'Nombre de Rendez-vous',
        },
        beginAtZero: true,
      },
    },
  };

  // Data for Pie Chart (User Role Distribution)
  const pieChartData = {
    labels: ['Médecins', 'Patients', 'Admins'],
    datasets: [
      {
        label: 'Répartition des Rôles',
        data: [medecins.length, patients.length, admins.length],
        backgroundColor: [
          'rgba(13, 110, 253, 0.6)',
          'rgba(40, 167, 69, 0.6)',
          'rgba(255, 193, 7, 0.6)',
        ],
        borderColor: ['#0d6efd', '#28a745', '#ffc107'],
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Répartition des Utilisateurs par Rôle',
        font: { size: 14 },
      },
    },
  };

  // Functions
  const handleDeleteUser = async (userId) => {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action est irréversible !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
    });

    if (result.isConfirmed) {
      const token = localStorage.getItem('token');
      try {
        await axios.delete(`http://localhost:5000/api/auth/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(users.filter((user) => user._id !== userId));
        showNotification('Utilisateur supprimé avec succès');
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: err.response?.data?.message || 'Impossible de supprimer l\'utilisateur.',
          toast: true,
          position: 'top-end',
          timer: 3000,
          timerProgressBar: true,
        });
      }
    }
  };

  const handleValidateDoctor = async (userId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `http://localhost:5000/api/auth/users/${userId}/validate`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, validated: true } : user
        )
      );
      showNotification('Licence du médecin validée avec succès');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: err.response?.data?.message || 'Impossible de valider la licence.',
        toast: true,
        position: 'top-end',
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    Swal.fire({
      icon: 'success',
      title: 'Déconnexion',
      text: 'Vous avez été déconnecté avec succès.',
      toast: true,
      position: 'top-end',
      timer: 3000,
      timerProgressBar: true,
    });
    navigate('/login');
  };

  const isCloudinaryUrl = (url) => url && url.startsWith('https://res.cloudinary.com');

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const handleToggleStatus = (userId) => {
    setUsers(
      users.map((user) =>
        user._id === userId ? { ...user, validated: !user.validated } : user
      )
    );
    showNotification('Statut mis à jour avec succès');
  };

  const showNotification = (message) => {
    setNotificationMessage(message);
    setShowSuccessNotification(true);
    setTimeout(() => {
      setShowSuccessNotification(false);
    }, 3000);
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedName = formData.get('name').split(' ');
    const updatedUser = {
      ...currentUser,
      nom: updatedName[0] || currentUser.nom,
      prenom: updatedName[1] || currentUser.prenom,
      email: formData.get('email'),
      role: formData.get('type') === 'Médecin' ? 'internaute' : formData.get('type').toLowerCase(),
      validated: formData.get('status') === 'Actif',
    };

    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `http://localhost:5000/api/auth/users/${updatedUser.id}`,
        updatedUser,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(
        users.map((user) =>
          user._id === updatedUser.id ? { ...user, ...updatedUser } : user
        )
      );
      setIsModalOpen(false);
      showNotification('Utilisateur mis à jour avec succès');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: err.response?.data?.message || 'Impossible de mettre à jour l\'utilisateur.',
        toast: true,
        position: 'top-end',
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  const handleAddUser = () => {
    navigate('/register');
  };

  if (loading) {
    return <div className="text-center mt-5">Chargement...</div>;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Sidebar */}
      <div
        style={{
          width: sidebarOpen ? '250px' : '80px',
          backgroundColor: '#0d6efd',
          color: 'white',
          transition: 'all 0.3s ease-in-out',
          position: 'fixed',
          height: '100vh',
          zIndex: 10,
        }}
      >
        <div className="p-4 d-flex justify-content-between align-items-center">
          {sidebarOpen ? (
            <h4 style={{ color: 'white', fontWeight: 'bold', margin: 0 }}>
              Rdv-Med Admin
            </h4>
          ) : (
            <h4 style={{ color: 'white', fontWeight: 'bold', margin: 0 }}>RMA</h4>
          )}
          <Button
            variant="link"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ color: 'white', padding: 0 }}
          >
            {sidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
          </Button>
        </div>
        <Nav className="flex-column mt-4">
          <Nav.Link
            onClick={() => setActiveSection('dashboard')}
            style={{
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: activeSection === 'dashboard' ? '#ffffff' : 'transparent',
              color: activeSection === 'dashboard' ? '#0d6efd' : 'white',
            }}
          >
            <i className="fas fa-tachometer-alt me-2"></i>
            {sidebarOpen && <span>Tableau de bord</span>}
          </Nav.Link>
          <Nav.Link
            onClick={() => setActiveSection('users')}
            style={{
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: activeSection === 'users' ? '#ffffff' : 'transparent',
              color: activeSection === 'users' ? '#0d6efd' : 'white',
            }}
          >
            <i className="fas fa-users me-2"></i>
            {sidebarOpen && <span>Gestion des utilisateurs</span>}
          </Nav.Link>
          <Nav.Link
            onClick={() => setActiveSection('medecins')}
            style={{
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: activeSection === 'medecins' ? '#ffffff' : 'transparent',
              color: activeSection === 'medecins' ? '#0d6efd' : 'white',
            }}
          >
            <FaUserMd className="me-2" />
            {sidebarOpen && <span>Médecins</span>}
            {sidebarOpen && (
              <Badge bg="light" text="dark" className="ms-2">
                {medecins.length}
              </Badge>
            )}
          </Nav.Link>
          <Nav.Link
            onClick={() => setActiveSection('patients')}
            style={{
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: activeSection === 'patients' ? '#ffffff' : 'transparent',
              color: activeSection === 'patients' ? '#0d6efd' : 'white',
            }}
          >
            <FaUsers className="me-2" />
            {sidebarOpen && <span>Patients</span>}
            {sidebarOpen && (
              <Badge bg="light" text="dark" className="ms-2">
                {patients.length}
              </Badge>
            )}
          </Nav.Link>
          <Nav.Link
            onClick={() => setActiveSection('admins')}
            style={{
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: activeSection === 'admins' ? '#ffffff' : 'transparent',
              color: activeSection === 'admins' ? '#0d6efd' : 'white',
            }}
          >
            <FaUserShield className="me-2" />
            {sidebarOpen && <span>Admins</span>}
            {sidebarOpen && (
              <Badge bg="light" text="dark" className="ms-2">
                {admins.length}
              </Badge>
            )}
          </Nav.Link>
          <Nav.Link
            onClick={() => setActiveSection('appointments')}
            style={{
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: activeSection === 'appointments' ? '#ffffff' : 'transparent',
              color: activeSection === 'appointments' ? '#0d6efd' : 'white',
            }}
          >
            <FaCalendarAlt className="me-2" />
            {sidebarOpen && <span>Rendez-vous</span>}
            {sidebarOpen && (
              <Badge bg="light" text="dark" className="ms-2">
                {appointments.length}
              </Badge>
            )}
          </Nav.Link>
          <Nav.Link
            onClick={handleLogout}
            style={{
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              color: 'white',
              position: 'absolute',
              bottom: '20px',
              width: sidebarOpen ? 'calc(100% - 40px)' : 'auto',
            }}
          >
            <FaSignOutAlt className="me-2" />
            {sidebarOpen && <span>Déconnexion</span>}
          </Nav.Link>
        </Nav>
      </div>

      {/* Main Content */}
      <div
        style={{
          marginLeft: sidebarOpen ? '250px' : '80px',
          transition: 'all 0.3s ease-in-out',
          flex: 1,
        }}
      >
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="d-flex justify-content-between align-items-center px-4 py-3">
            <h1 className="h4 mb-0 text-dark">
              {activeSection === 'dashboard' && 'Tableau de bord'}
              {activeSection === 'users' && 'Gestion des Utilisateurs'}
              {activeSection === 'medecins' && 'Gestion des Médecins'}
              {activeSection === 'patients' && 'Gestion des Patients'}
              {activeSection === 'admins' && 'Gestion des Admins'}
              {activeSection === 'appointments' && 'Gestion des Rendez-vous'}
            </h1>
            <div className="d-flex align-items-center">
              <div className="position-relative me-3">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="form-control form-control-sm ps-5"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <i className="fas fa-search position-absolute top-50 start-0 translate-middle-y ms-2 text-muted"></i>
              </div>
              <div className="position-relative me-3">
                <Button variant="link" className="p-2">
                  <i className="fas fa-bell text-muted"></i>
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger text-white">
                    3
                  </span>
                </Button>
              </div>
              <div className="d-flex align-items-center">
                <img
                  src="/admin.png"
                  alt="Admin"
                  className="rounded-circle me-2"
                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                  onError={(e) => (e.target.src = '/placeholder-profile-image.jpg')}
                />
                <span className="text-muted">Admin</span>
                <Button variant="link" className="p-2">
                  <i className="fas fa-chevron-down text-muted"></i>
                </Button>
              </div>
            </div>
          </div>
          <div className="px-4 py-2 border-top text-muted" style={{ fontSize: '0.875rem' }}>
            {new Date().toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </header>

        {/* Main Section */}
        <main className="p-4">
          {/* Dashboard Section (Statistics and Charts) */}
          {activeSection === 'dashboard' && (
            <>
              {/* Statistics Widgets */}
              <Row className="mb-4">
                <Col lg={3} md={6} className="mb-4">
                  <Card className="Lifeline Chart shadow-sm">
                    <Card.Body className="d-flex align-items-center">
                      <div className="p-3 rounded-circle bg-primary bg-opacity-10 text-primary me-3">
                        <i className="fas fa-users fs-4"></i>
                      </div>
                      <div>
                        <Card.Text className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>
                          Total Utilisateurs
                        </Card.Text>
                        <Card.Title className="h5 mb-0">{stats.totalUsers}</Card.Title>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={3} md={6} className="mb-4">
                  <Card className="shadow-sm">
                    <Card.Body className="d-flex align-items-center">
                      <div className="p-3 rounded-circle bg-success bg-opacity-10 text-success me-3">
                        <i className="fas fa-user-plus fs-4"></i>
                      </div>
                      <div>
                        <Card.Text className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>
                          Nouveaux Utilisateurs
                        </Card.Text>
                        <Card.Title className="h5 mb-0">{stats.newUsers}</Card.Title>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={3} md={6} className="mb-4">
                  <Card className="shadow-sm">
                    <Card.Body className="d-flex align-items-center">
                      <div className="p-3 rounded-circle bg-purple bg-opacity-10 text-purple me-3">
                        <i className="fas fa-user-check fs-4"></i>
                      </div>
                      <div>
                        <Card.Text className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>
                          Utilisateurs Actifs
                        </Card.Text>
                        <Card.Title className="h5 mb-0">{stats.activeUsers}</Card.Title>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={3} md={6} className="mb-4">
                  <Card className="shadow-sm">
                    <Card.Body className="d-flex align-items-center">
                      <div className="p-3 rounded-circle bg-warning bg-opacity-10 text-warning me-3">
                        <i className="fas fa-calendar-check fs-4"></i>
                      </div>
                      <div>
                        <Card.Text className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>
                          Rendez-vous en cours
                        </Card.Text>
                        <Card.Title className="h5 mb-0">{stats.appointments}</Card.Title>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Charts Section */}
              <Row className="mb-4">
                <Col lg={8} className="mb-4">
                  <Card className="shadow-sm">
                    <Card.Body>
                      <div style={{ height: '300px', width: '100%' }}>
                        <Bar data={barChartData} options={barChartOptions} />
                      </div>
                      <div style={{ height: '300px', width: '100%', marginTop: '20px' }}>
                        <Pie data={pieChartData} options={pieChartOptions} />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={4}>
                  <Card className="shadow-sm">
                    <Card.Body>
                      <h5 className="mb-4">Filtres</h5>
                      <div className="mb-4">
                        <label className="form-label">Statut</label>
                        <div className="d-flex gap-2">
                          {['Tous', 'Actifs', 'Inactifs'].map((filter) => (
                            <Button
                              key={filter}
                              variant={statusFilter === filter ? 'primary' : 'outline-secondary'}
                              size="sm"
                              onClick={() => setStatusFilter(filter)}
                            >
                              {filter}
                            </Button>
                          ))}
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="form-label">Type de compte</label>
                        <select
                          className="form-select form-select-sm"
                          value={userTypeFilter}
                          onChange={(e) => setUserTypeFilter(e.target.value)}
                        >
                          <option value="Tous">Tous les types</option>
                          <option value="Patient">Patient</option>
                          <option value="Médecin">Médecin</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </div>
                      <div className="mb-4">
                        <label className="form-label">Date d'inscription</label>
                        <input
                          type="text"
                          placeholder="JJ/MM/AAAA"
                          className="form-control form-control-sm"
                          value={dateFilter}
                          onChange={(e) => setDateFilter(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="form-label">Exporter</label>
                        <div className="d-flex gap-2">
                          <Button variant="outline-secondary" size="sm">
                            <i className="fas fa-file-csv me-2"></i> CSV
                          </Button>
                          <Button variant="outline-secondary" size="sm">
                            <i className="fas fa-file-pdf me-2"></i> PDF
                          </Button>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </>
          )}

          {/* Users Section (Table View) */}
          {activeSection === 'users' && (
            <Card className="shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5>Liste des utilisateurs</h5>
                  <Button variant="primary" size="sm" onClick={handleAddUser}>
                    <i className="fas fa-plus me-2"></i> Ajouter un utilisateur
                  </Button>
                </div>
                <div className="table-responsive">
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Utilisateur</th>
                        <th>Email</th>
                        <th>Type</th>
                        <th>Date d'inscription</th>
                        <th>Statut</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <img
                                src={
                                  user.profileImage && user.profileImage !== ''
                                    ? isCloudinaryUrl(user.profileImage)
                                      ? user.profileImage
                                      : `http://localhost:5000/${user.profileImage.replace(/^\/+/, '')}`
                                    : '/placeholder-profile-image.jpg'
                                }
                                alt={user.name}
                                className="rounded-circle me-2"
                                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                onError={(e) => {
                                  console.log('Image failed to load:', e.target.src);
                                  e.target.src = '/placeholder-profile-image.jpg';
                                }}
                              />
                              <span>{user.name}</span>
                            </div>
                          </td>
                          <td>{user.email}</td>
                          <td>{user.type}</td>
                          <td>{user.date}</td>
                          <td>
                            <Badge bg={user.status === 'Actif' ? 'success' : 'danger'}>
                              {user.status}
                            </Badge>
                          </td>
                          <td>
                            <Button
                              variant="link"
                              className="text-primary p-1"
                              onClick={() => handleEditUser(user)}
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                            <Button
                              variant="link"
                              className={user.status === 'Actif' ? 'text-warning p-1' : 'text-success p-1'}
                              onClick={() => handleToggleStatus(user.id)}
                            >
                              <i className={user.status === 'Actif' ? 'fas fa-ban' : 'fas fa-check'}></i>
                            </Button>
                            <Button
                              variant="link"
                              className="text-danger p-1"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <i className="fas fa-trash"></i>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
                <div className="d-flex justify-content-between align-items-center border-top pt-3">
                  <span className="text-muted">
                    Affichage de 1 à {filteredUsers.length} sur {allUsers.length} résultats
                  </span>
                  <div className="d-flex gap-2">
                    <Button variant="outline-secondary" size="sm">
                      Précédent
                    </Button>
                    <Button variant="primary" size="sm">
                      1
                    </Button>
                    <Button variant="outline-secondary" size="sm">
                      Suivant
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Médecins Section */}
          {activeSection === 'medecins' && (
            <>
              <Card className="shadow-sm mb-4">
                <Card.Body>
                  <h5 className="mb-4">Filtres</h5>
                  <div className="mb-4">
                    <label className="form-label">Statut de validation</label>
                    <div className="d-flex gap-2">
                      {['Tous', 'Validés', 'Non Validés'].map((filter) => (
                        <Button
                          key={filter}
                          variant={doctorValidationFilter === filter ? 'primary' : 'outline-secondary'}
                          size="sm"
                          onClick={() => setDoctorValidationFilter(filter)}
                        >
                          {filter}
                        </Button>
                      ))}
                    </div>
                  </div>
                </Card.Body>
              </Card>
              {filteredMedecins.length === 0 ? (
                <p className="text-center text-muted mt-3">Aucun médecin trouvé.</p>
              ) : (
                <Row>
                  {filteredMedecins.map((user) => (
                    <Col md={4} key={user._id} className="mb-4">
                      <Card className="shadow-sm h-100">
                        <Card.Body>
                          <Card.Title className="d-flex justify-content-between align-items-center">
                            <span>{user.nom} {user.prenom}</span>
                            <Badge bg={user.validated ? 'success' : 'warning'} pill>
                              {user.validated ? 'Validé' : 'Non Validé'}
                            </Badge>
                          </Card.Title>
                          <Card.Text>
                            <strong>Email:</strong> {user.email}
                          </Card.Text>
                          <Card.Text>
                            <strong>Spécialité:</strong> {user.specialite || 'Non spécifiée'}
                          </Card.Text>
                          <Card.Text>
                            <strong>Ville:</strong> {user.ville || 'Non spécifiée'}
                          </Card.Text>
                          <Card.Text>
                            <strong>Localisation:</strong> {user.localisation || 'Non spécifiée'}
                          </Card.Text>
                          <Card.Text>
                            <strong>Licence:</strong>{' '}
                            {user.licenceProfessionnelle ? (
                              isCloudinaryUrl(user.licenceProfessionnelle) ? (
                                <span className="text-danger">
                                  Licence non accessible (ancien format Cloudinary)
                                </span>
                              ) : (
                                <a
                                  href={`http://localhost:5000${user.licenceProfessionnelle}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary"
                                >
                                  Voir la licence
                                </a>
                              )
                            ) : (
                              'Non fournie'
                            )}
                          </Card.Text>
                          <div className="d-flex justify-content-between mt-3">
                            {!user.validated && (
                              <Button
                                variant="success"
                                size="sm"
                                onClick={() => handleValidateDoctor(user._id)}
                              >
                                Valider
                              </Button>
                            )}
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDeleteUser(user._id)}
                            >
                              Supprimer
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </>
          )}

          {/* Patients Section */}
          {activeSection === 'patients' && (
            <>
              {patients.length === 0 ? (
                <p className="text-center text-muted mt-3">Aucun patient trouvé.</p>
              ) : (
                <Row>
                  {patients.map((user) => (
                    <Col md={4} key={user._id} className="mb-4">
                      <Card className="shadow-sm h-100">
                        <Card.Body>
                          <Card.Title>{user.nom} {user.prenom}</Card.Title>
                          <Card.Text>
                            <strong>Email:</strong> {user.email}
                          </Card.Text>
                          <div className="d-flex justify-content-end mt-3">
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDeleteUser(user._id)}
                            >
                              Supprimer
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </>
          )}

          {/* Admins Section */}
          {activeSection === 'admins' && (
            <>
              {admins.length === 0 ? (
                <p className="text-center text-muted mt-3">Aucun admin trouvé.</p>
              ) : (
                <Row>
                  {admins.map((user) => (
                    <Col md={4} key={user._id} className="mb-4">
                      <Card className="shadow-sm h-100">
                        <Card.Body>
                          <Card.Title>{user.nom} {user.prenom}</Card.Title>
                          <Card.Text>
                            <strong>Email:</strong> {user.email}
                          </Card.Text>
                          <div className="d-flex justify-content-end mt-3">
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDeleteUser(user._id)}
                              disabled={admins.length === 1}
                            >
                              Supprimer
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </>
          )}

          {/* Appointments Section */}
          {activeSection === 'appointments' && (
            <Card className="shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5>Liste des rendez-vous</h5>
                </div>
                <div className="mb-4">
                  <label className="form-label">Filtrer par statut</label>
                  <div className="d-flex gap-2">
                    {['Tous', 'Pending', 'Confirmed', 'Cancelled'].map((filter) => (
                      <Button
                        key={filter}
                        variant={appointmentStatusFilter === filter ? 'primary' : 'outline-secondary'}
                        size="sm"
                        onClick={() => setAppointmentStatusFilter(filter)}
                      >
                        {filter === 'Pending' ? 'En attente' : filter === 'Confirmed' ? 'Confirmé' : filter === 'Cancelled' ? 'Annulé' : 'Tous'}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="table-responsive">
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Patient</th>
                        <th>Médecin</th>
                        <th>Date</th>
                        <th>Heure</th>
                        <th>Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAppointments.map((appointment) => {
                        const appointmentDate = new Date(appointment.date);
                        return (
                          <tr key={appointment._id}>
                            <td>{appointment.patientId ? `${appointment.patientId.nom} ${appointment.patientId.prenom}` : 'Inconnu'}</td>
                            <td>{appointment.doctorId ? `${appointment.doctorId.nom} ${appointment.doctorId.prenom}` : 'Inconnu'}</td>
                            <td>{appointmentDate.toLocaleDateString('fr-FR')}</td>
                            <td>{appointment.time}</td>
                            <td>
                              <Badge
                                bg={
                                  appointment.status === 'confirmed'
                                    ? 'success'
                                    : appointment.status === 'pending'
                                    ? 'warning'
                                    : 'danger'
                                }
                              >
                                {appointment.status === 'confirmed'
                                  ? 'Confirmé'
                                  : appointment.status === 'pending'
                                  ? 'En attente'
                                  : 'Annulé'}
                              </Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
                <div className="d-flex justify-content-between align-items-center border-top pt-3">
                  <span className="text-muted">
                    Affichage de 1 à {filteredAppointments.length} sur {appointments.length} résultats
                  </span>
                  <div className="d-flex gap-2">
                    <Button variant="outline-secondary" size="sm">
                      Précédent
                    </Button>
                    <Button variant="primary" size="sm">
                      1
                    </Button>
                    <Button variant="outline-secondary" size="sm">
                      Suivant
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          )}
        </main>
      </div>

      {/* Edit Modal */}
      {isModalOpen && currentUser && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center"
          style={{ zIndex: 50 }}
        >
          <Card className="w-100" style={{ maxWidth: '500px' }}>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Modifier l'utilisateur</h5>
              <Button variant="link" onClick={() => setIsModalOpen(false)}>
                <i className="fas fa-times text-muted"></i>
              </Button>
            </Card.Header>
            <form onSubmit={handleSubmitEdit}>
              <Card.Body>
                <div className="text-center mb-4">
                  <div className="position-relative d-inline-block">
                    <img
                      src={
                        currentUser.profileImage && currentUser.profileImage !== ''
                          ? isCloudinaryUrl(currentUser.profileImage)
                            ? currentUser.profileImage
                            : `http://localhost:5000/${currentUser.profileImage.replace(/^\/+/, '')}`
                          : '/placeholder-profile-image.jpg'
                      }
                      alt={currentUser.name}
                      className="rounded-circle"
                      style={{ width: '96px', height: '96px', objectFit: 'cover' }}
                      onError={(e) => {
                        console.log('Image failed to load in modal:', e.target.src);
                        e.target.src = '/placeholder-profile-image.jpg';
                      }}
                    />
                    <Button
                      variant="primary"
                      size="sm"
                      className="position-absolute bottom-0 end-0 rounded-circle p-2"
                    >
                      <i className="fas fa-camera"></i>
                    </Button>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Nom complet</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    defaultValue={currentUser.name}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    defaultValue={currentUser.email}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Type de compte</label>
                  <select name="type" className="form-select" defaultValue={currentUser.type}>
                    <option value="Patient">Patient</option>
                    <option value="Médecin">Médecin</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Statut</label>
                  <div className="d-flex gap-3">
                    <div className="form-check">
                      <input
                        type="radio"
                        id="status-active"
                        name="status"
                        value="Actif"
                        defaultChecked={currentUser.status === 'Actif'}
                        className="form-check-input"
                      />
                      <label htmlFor="status-active" className="form-check-label">
                        Actif
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        type="radio"
                        id="status-inactive"
                        name="status"
                        value="Inactif"
                        defaultChecked={currentUser.status === 'Inactif'}
                        className="form-check-input"
                      />
                      <label htmlFor="status-inactive" className="form-check-label">
                        Inactif
                      </label>
                    </div>
                  </div>
                </div>
              </Card.Body>
              <Card.Footer className="d-flex justify-content-end gap-2">
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" variant="primary">
                  Enregistrer
                </Button>
              </Card.Footer>
            </form>
          </Card>
        </div>
      )}

      {/* Success Notification */}
      {showSuccessNotification && (
        <div
          className="position-fixed bottom-0 end-0 m-4 bg-success text-white px-4 py-3 rounded shadow"
          style={{ zIndex: 50 }}
        >
          <i className="fas fa-check-circle me-2"></i>
          {notificationMessage}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;