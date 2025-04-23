import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Row, Col, Badge, Nav } from 'react-bootstrap';
import { FaUserMd, FaUsers, FaUserShield, FaSignOutAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import * as echarts from 'echarts';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('users'); // Changed to 'users' to match new design
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tous');
  const [userTypeFilter, setUserTypeFilter] = useState('Tous');
  const [dateFilter, setDateFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/auth/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: err.response?.data?.message || 'Une erreur s\'est produite lors de la récupération des utilisateurs.',
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

    fetchUsers();
  }, [navigate]);

  // Initialize the ECharts chart
  useEffect(() => {
    const chartDom = document.getElementById('usersChart');
    if (chartDom) {
      const myChart = echarts.init(chartDom);
      const option = {
        animation: false,
        title: {
          text: 'Nouveaux Utilisateurs',
          left: 'center',
          textStyle: { fontSize: 14 },
        },
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          data: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil'],
        },
        yAxis: { type: 'value' },
        series: [
          {
            data: [45, 62, 87, 76, 95, 82, 87],
            type: 'line',
            smooth: true,
            lineStyle: { color: '#0d6efd' },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(13, 110, 253, 0.5)' },
                  { offset: 1, color: 'rgba(13, 110, 253, 0.1)' },
                ],
              },
            },
          },
        ],
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      };
      myChart.setOption(option);

      const handleResize = () => myChart.resize();
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        myChart.dispose();
      };
    }
  }, []);

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
      return diffDays <= 30; // Users registered in the last 30 days
    }).length,
    activeUsers: users.filter((user) => user.validated).length,
    appointments: 342, // Static for now; replace with API data if available
  };

  // Combined user list for the table
  const allUsers = users.map((user) => ({
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
  }));

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

  // Functions from the original code
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

  // New functions for the modern dashboard
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

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedName = formData.get('name').split(' ');
    const updatedUser = {
      ...currentUser,
      nom: updatedName[0] || currentUser.nom,
      prenom: updatedName[1] || currentUser.prenom,
      email: formData.get('email'),
      type: formData.get('type'),
      validated: formData.get('status') === 'Actif',
    };

    setUsers(
      users.map((user) =>
        user._id === updatedUser.id ? { ...user, ...updatedUser } : user
      )
    );
    setIsModalOpen(false);
    showNotification('Utilisateur mis à jour avec succès');
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
                  src="https://via.placeholder.com/40"
                  alt="Admin"
                  className="rounded-circle me-2"
                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
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
          {/* Dashboard Section (Statistics and Chart) */}
          {activeSection === 'dashboard' && (
            <>
              {/* Statistics Widgets */}
              <Row className="mb-4">
                <Col lg={3} md={6} className="mb-4">
                  <Card className="shadow-sm">
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

              {/* Chart and Filters */}
              <Row className="mb-4">
                <Col lg={8} className="mb-4">
                  <Card className="shadow-sm">
                    <Card.Body>
                      <div id="usersChart" style={{ height: '300px', width: '100%' }}></div>
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
                  <Button variant="primary" size="sm">
                    <i className="fas fa-plus me-2"></i> Ajouter un utilisateur
                  </Button>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
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
                                src="https://via.placeholder.com/40"
                                alt={user.name}
                                className="rounded-circle me-2"
                                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
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
                  </table>
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

          {/* Original Sections (Médecins, Patients, Admins) */}
          {activeSection === 'medecins' && (
            <>
              {medecins.length === 0 ? (
                <p className="text-center text-muted mt-3">Aucun médecin trouvé.</p>
              ) : (
                <Row>
                  {medecins.map((user) => (
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
                      src="https://via.placeholder.com/96"
                      alt={currentUser.name}
                      className="rounded-circle"
                      style={{ width: '96px', height: '96px', objectFit: 'cover' }}
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
