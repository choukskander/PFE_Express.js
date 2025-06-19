import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import animationData from './Animation - 1742560736699.json';
import Navbar from './Navbar';
import axios from 'axios';
import Swal from 'sweetalert2';
import TwoFactorAuth from './TwoFactorAuth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [tempToken, setTempToken] = useState(null);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    console.log('Toggling visibility, current state:', isPasswordVisible);
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      console.log('Login response:', response.data); // Debug log
      if (response.data.tempToken) {
        console.log('2FA required, tempToken received:', response.data.tempToken);
        setTempToken(response.data.tempToken);
      } else {
        console.log('No 2FA required, proceeding with login');
        localStorage.setItem('user', JSON.stringify(response.data));
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data._id);

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

        const user = response.data;
        if (user.role === 'admin') {
          navigate('/admin-dashboard');
        } else if (user.role === 'internaute') {
          navigate('/my-appointments/doctor');
        } else if (user.role === 'patient') {
          navigate('/my-appointments/patient');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      console.error('Login error:', err.response?.data); // Debug log
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
    inputContainer: {
      position: 'relative',
      width: '100%',
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
      {tempToken ? (
        <TwoFactorAuth email={email} tempToken={tempToken} />
      ) : (
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
                <div style={styles.inputContainer}>
                  <label style={styles.label}>Password</label>
                  <input
                    className="fakepassword"
                    type={isPasswordVisible ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                    required
                  />
                  <span
                    className="position-absolute top-50 end-0 translate-middle-y p-0 mt-3"
                    onClick={togglePasswordVisibility}
                    style={{ cursor: 'pointer' }}
                  >
                    <i
                      className={`fas ${
                        isPasswordVisible ? 'fa-eye' : 'fa-eye-slash'
                      } fakepasswordicon cursor-pointer p-2`}
                      key={isPasswordVisible ? 'eye' : 'eye-slash'}
                    ></i>
                  </span>
                </div>
                <button type="submit" style={styles.button}>Sign In</button>
              </form>
              <div style={styles.footer}>
                New Customer? <Link to="/register" style={styles.link}>Register</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;