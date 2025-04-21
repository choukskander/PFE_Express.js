import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Navbar from './Navbar';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [slots, setSlots] = useState([]);
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== 'internaute') {
        navigate('/profile');
      }
      setUser(parsedUser);
      fetchAppointments();
      fetchSlots();
      fetchProfile();
    }
  }, [navigate]);

  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/appointments/doctor', {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setAppointments(data);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de charger les rendez-vous.',
        toast: true,
        position: 'top-end',
        timer: 3000,
      });
    }
  };

  const fetchSlots = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/slots', {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setSlots(data.map((slot) => ({
        title: 'Disponible',
        start: new Date(slot.start),
        end: new Date(slot.end),
      })));
    } catch (err) {
      console.log('No slots yet.');
    }
  };

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/auth/profile', {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setProfile(data);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de charger le profil.',
        toast: true,
        position: 'top-end',
        timer: 3000,
      });
    }
  };

  const handleAddSlot = async (start, end) => {
    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/slots',
        { doctorId: user._id, start, end },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      setSlots([...slots, { title: 'Disponible', start: new Date(data.start), end: new Date(data.end) }]);
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Créneau ajouté !',
        toast: true,
        position: 'top-end',
        timer: 3000,
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible d’ajouter le créneau.',
        toast: true,
        position: 'top-end',
        timer: 3000,
      });
    }
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <Container style={styles.container}>
        <h2 style={styles.title}>Espace Médecin</h2>

        <Row>
          {/* Profile Overview */}
          <Col md={4}>
            <Card style={styles.card}>
              <Card.Body>
                <h4 style={styles.cardTitle}>Profil</h4>
                <p><strong>Nom:</strong> {profile.nom} {profile.prenom}</p>
                <p><strong>Spécialité:</strong> {profile.specialite || 'Non spécifiée'}</p>
                <p><strong>Vérifié:</strong> {profile.verified ? 'Oui' : 'Non'}</p>
                <Button variant="primary" href="/profile" style={styles.button}>
                  Modifier Profil
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Calendar */}
          <Col md={8}>
            <Card style={styles.card}>
              <Card.Body>
                <h4 style={styles.cardTitle}>Agenda</h4>
                <Calendar
                  localizer={localizer}
                  events={slots.concat(
                    appointments.map((appt) => ({
                      title: `RDV avec ${appt.patientName}`,
                      start: new Date(appt.slot),
                      end: new Date(new Date(appt.slot).getTime() + 30 * 60 * 1000),
                    }))
                  )}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 500 }}
                  onSelectSlot={({ start, end }) => handleAddSlot(start, end)}
                  selectable
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Appointments */}
        <Row className="mt-4">
          <Col>
            <Card style={styles.card}>
              <Card.Body>
                <h4 style={styles.cardTitle}>Rendez-vous</h4>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Date</th>
                      <th>Heure</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appt) => (
                      <tr key={appt._id}>
                        <td>{appt.patientName}</td>
                        <td>{new Date(appt.slot).toLocaleDateString()}</td>
                        <td>{new Date(appt.slot).toLocaleTimeString()}</td>
                        <td>
                          <Button variant="success" size="sm" href={appt.zoomLink || '#'}>
                            Lancer Consultation
                          </Button>
                          <Button variant="danger" size="sm" className="ms-2">
                            Annuler
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Chatbot Placeholder */}
        <Button
          style={styles.chatbotButton}
          onClick={() => alert('Chatbot IA à venir !')}
        >
          Discuter avec le Chatbot
        </Button>
      </Container>
    </div>
  );
};

const styles = {
  container: {
    paddingTop: '80px',
    paddingBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    color: '#0a66c2',
    textAlign: 'center',
  },
  card: {
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    marginBottom: '1.5rem',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#0a66c2',
    marginBottom: '1rem',
  },
  button: {
    width: '100%',
  },
  chatbotButton: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    borderRadius: '50%',
    width: '60px',
    height: '60px',
    fontSize: '1.5rem',
  },
};

export default DoctorDashboard;