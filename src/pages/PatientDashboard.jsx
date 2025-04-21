import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Navbar from './Navbar';
import Chart from 'chart.js/auto'; // For symptom trends
import { Line } from 'react-chartjs-2'; // Chart.js React wrapper

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [symptoms, setSymptoms] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [city, setCity] = useState('');
  const [date, setDate] = useState('');
  const [symptomHistory, setSymptomHistory] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== 'patient') {
        navigate('/profile');
      }
      setUser(parsedUser);
      fetchDoctors();
      fetchAppointments();
      fetchSymptomHistory();
    }
  }, [navigate]);

  const fetchDoctors = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/doctors', {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setDoctors(data);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de charger les médecins.',
        toast: true,
        position: 'top-end',
        timer: 3000,
      });
    }
  };

  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/appointments/patient', {
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

  const fetchSymptomHistory = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/symptoms', {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setSymptomHistory(data);
    } catch (err) {
      console.log('No symptom history yet.');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get('http://localhost:5000/api/doctors/search', {
        params: { specialty, city, date },
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setDoctors(data);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Aucun médecin trouvé.',
        toast: true,
        position: 'top-end',
        timer: 3000,
      });
    }
  };

  const handleBookAppointment = async (doctorId, slot) => {
    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/appointments',
        { doctorId, patientId: user._id, slot },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      setAppointments([...appointments, data]);
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Rendez-vous réservé !',
        toast: true,
        position: 'top-end',
        timer: 3000,
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de réserver.',
        toast: true,
        position: 'top-end',
        timer: 3000,
      });
    }
  };

  const handleSymptomSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/predict',
        { symptoms, userId: user._id },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      setSymptomHistory([...symptomHistory, data]);
      Swal.fire({
        icon: 'success',
        title: 'Analyse',
        text: `Diagnostic préliminaire : ${data.prediction}`,
        toast: true,
        position: 'top-end',
        timer: 5000,
      });
      setSymptoms('');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Analyse échouée.',
        toast: true,
        position: 'top-end',
        timer: 3000,
      });
    }
  };

  const chartData = {
    labels: symptomHistory.map((s) => new Date(s.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Sévérité des symptômes',
        data: symptomHistory.map((s) => s.severity || 1),
        borderColor: '#0a66c2',
        fill: false,
      },
    ],
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <Container style={styles.container}>
        <h2 style={styles.title}>Espace Patient</h2>

        <Row>
          {/* Search Doctors */}
          <Col md={6}>
            <Card style={styles.card}>
              <Card.Body>
                <h4 style={styles.cardTitle}>Rechercher un médecin</h4>
                <Form onSubmit={handleSearch}>
                  <Form.Group controlId="specialty" className="mb-3">
                    <Form.Label>Spécialité</Form.Label>
                    <Form.Select
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                    >
                      <option value="">Choisir...</option>
                      <option value="dentiste">Dentiste</option>
                      <option value="cardiologue">Cardiologue</option>
                      {/* Add more specialties */}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group controlId="city" className="mb-3">
                    <Form.Label>Ville</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ex: Tunis"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group controlId="date" className="mb-3">
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </Form.Group>
                  <Button type="submit" variant="primary" style={styles.button}>
                    Rechercher
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Symptom Tracker */}
          <Col md={6}>
            <Card style={styles.card}>
              <Card.Body>
                <h4 style={styles.cardTitle}>Suivi des symptômes</h4>
                <Form onSubmit={handleSymptomSubmit}>
                  <Form.Group controlId="symptoms" className="mb-3">
                    <Form.Label>Symptômes</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Ex: Fièvre, toux..."
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                    />
                  </Form.Group>
                  <Button type="submit" variant="primary" style={styles.button}>
                    Analyser avec IA
                  </Button>
                </Form>
                {symptomHistory.length > 0 && (
                  <div className="mt-3">
                    <Line data={chartData} options={{ responsive: true }} />
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Appointments */}
        <Row className="mt-4">
          <Col>
            <Card style={styles.card}>
              <Card.Body>
                <h4 style={styles.cardTitle}>Mes rendez-vous</h4>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Médecin</th>
                      <th>Date</th>
                      <th>Heure</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appt) => (
                      <tr key={appt._id}>
                        <td>{appt.doctorName}</td>
                        <td>{new Date(appt.slot).toLocaleDateString()}</td>
                        <td>{new Date(appt.slot).toLocaleTimeString()}</td>
                        <td>
                          <Button variant="danger" size="sm">
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

export default PatientDashboard;