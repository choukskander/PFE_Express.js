import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import animationData from './Animation - 1742560736699.json';
import Navbar from './Navbar';
import axios from 'axios';
import Swal from 'sweetalert2'; // Add SweetAlert2 for consistency

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('user', JSON.stringify(response.data)); // Keep current approach
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
        title: 'Connexion réussie !',
      });
      navigate('/');
    } catch (err) {
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
        icon: 'error',
        title: err.response?.data?.message || 'Erreur de connexion',
      });
    }
  };

  const styles = {
    pageContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      paddingTop: '80px',
    },
    contentContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '40px',
      width: '80%',
      maxWidth: '1200px',
    },
    animation: {
      width: '300px',
      height: '500px',
    },
    card: {
      backgroundColor: '#fff',
      padding: '2.5rem',
      borderRadius: '15px',
      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
      maxWidth: '400px',
      width: '100%',
    },
    title: {
      fontSize: '28px',
      marginBottom: '2rem',
      color: '#0a66c2',
      fontWeight: '700',
      textAlign: 'center',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
    },
    label: {
      fontWeight: '600',
      color: '#1a1a1a',
    },
    input: {
      width: '100%',
      padding: '0.9rem',
      borderRadius: '8px',
      border: '1px solid #dcdcdc',
      fontSize: '16px',
    },
    button: {
      background: 'linear-gradient(45deg, #0a66c2, #094c99)',
      color: '#fff',
      padding: '0.9rem',
      borderRadius: '8px',
      border: 'none',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '1rem',
    },
    footer: {
      marginTop: '2rem',
      fontSize: '14px',
      color: '#666',
      textAlign: 'center',
    },
    link: {
      color: '#0a66c2',
      textDecoration: 'none',
      fontWeight: '600',
    },
  };

  return (
    <div>
      <Navbar />
      <div style={styles.pageContainer}>
        <div style={styles.contentContainer}>
          <div>
            <Lottie animationData={animationData} style={styles.animation} />
          </div>
          <div style={styles.card}>
            <h1 style={styles.title}>Sign In</h1>
            <form onSubmit={handleLogin} style={styles.form}>
              <div>
                <label style={styles.label}>Email Address</label>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>
              <div>
                <label style={styles.label}>Password</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>
              <button type="submit" style={styles.button}>Sign In</button>
            </form>
            <div style={styles.footer}>
              New Customer? <Link to="/register" style={styles.link}>Register</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
