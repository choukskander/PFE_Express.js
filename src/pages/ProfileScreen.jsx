// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card, Form, Button, Image } from 'react-bootstrap';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import Swal from 'sweetalert2';
// import Navbar from './Navbar';

// const ProfileScreen = () => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [nom, setNom] = useState('');
//   const [prenom, setPrenom] = useState('');
//   const [email, setEmail] = useState('');
//   const [specialite, setSpecialite] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [profileImage, setProfileImage] = useState(null);
//   const [previewImage, setPreviewImage] = useState(null);

//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');
//     if (!storedUser) {
//       navigate('/login');
//     } else {
//       const parsedUser = JSON.parse(storedUser);
//       setUser(parsedUser);
//       setNom(parsedUser.nom || '');
//       setPrenom(parsedUser.prenom || '');
//       setEmail(parsedUser.email || '');
//       setSpecialite(parsedUser.specialite || '');
//       setPreviewImage(parsedUser.profileImage || '/placeholder-profile-image.jpg');
//     }
//   }, [navigate]);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     setProfileImage(file);
//     if (file) {
//       setPreviewImage(URL.createObjectURL(file));
//     }
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     if (password && password !== confirmPassword) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Erreur',
//         text: 'Les mots de passe ne correspondent pas',
//         toast: true,
//         position: 'top-end',
//         timer: 3000,
//         timerProgressBar: true,
//       });
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append('nom', nom || '');
//       formData.append('prenom', prenom || '');
//       formData.append('email', email || '');
//       if (user.role === 'internaute') {
//         formData.append('specialite', specialite || '');
//       }
//       if (password) {
//         formData.append('password', password);
//       }
//       if (profileImage) {
//         formData.append('profileImage', profileImage);
//       }

//       // Debug FormData
//       for (let pair of formData.entries()) {
//         console.log(`${pair[0]}: ${pair[1]}`);
//       }

//       const config = {
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       };

//       const { data } = await axios.put(
//         'http://localhost:5000/api/auth/profile',
//         formData,
//         config
//       );

//       localStorage.setItem('user', JSON.stringify({
//         ...user,
//         nom: data.nom,
//         prenom: data.prenom,
//         email: data.email,
//         specialite: data.specialite,
//         profileImage: data.profileImage,
//       }));
//       setUser({
//         ...user,
//         nom: data.nom,
//         prenom: data.prenom,
//         email: data.email,
//         specialite: data.specialite,
//         profileImage: data.profileImage,
//       });
//       setPreviewImage(data.profileImage || '/placeholder-profile-image.jpg');

//       Swal.fire({
//         icon: 'success',
//         title: 'Succès',
//         text: 'Profil mis à jour avec succès',
//         toast: true,
//         position: 'top-end',
//         timer: 3000,
//         timerProgressBar: true,
//       });
//     } catch (err) {
//       const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Une erreur s\'est produite';
//       if (err.response?.status === 401) {
//         localStorage.removeItem('user');
//         navigate('/login');
//         Swal.fire({
//           icon: 'error',
//           title: 'Erreur',
//           text: errorMessage,
//           toast: true,
//           position: 'top-end',
//           timer: 3000,
//           timerProgressBar: true,
//         });
//       } else {
//         Swal.fire({
//           icon: 'error',
//           title: 'Erreur',
//           text: errorMessage,
//           toast: true,
//           position: 'top-end',
//           timer: 3000,
//           timerProgressBar: true,
//         });
//       }
//     }
//   };

//   return (
//     <div style={{ minHeight: '100vh' }}>
//       <Navbar />
//       <Container style={styles.container}>
//         <h2 style={styles.title}>Modifier le profil</h2>

//         <Form onSubmit={handleUpdate}>
//           <Row>
//             <Col md={4}>
//               <Card style={styles.profileCard}>
//                 <Card.Body>
//                   <Image
//                     src={previewImage}
//                     roundedCircle
//                     style={styles.profileImage}
//                   />
//                   <Form.Group controlId="profileImage" className="mt-3">
//                     <Form.Label style={styles.label}>Image de profil</Form.Label>
//                     <Form.Control
//                       type="file"
//                       accept=".jpg,.jpeg,.png"
//                       onChange={handleImageChange}
//                       style={styles.fileInput}
//                     />
//                   </Form.Group>
//                 </Card.Body>
//               </Card>
//             </Col>

//             <Col md={8}>
//               <Card style={styles.detailsCard}>
//                 <Card.Body>
//                   <Form.Group controlId="nom" className="mb-3">
//                     <Form.Label style={styles.label}>Nom</Form.Label>
//                     <Form.Control
//                       type="text"
//                       placeholder="Entrez votre nom"
//                       value={nom}
//                       onChange={(e) => setNom(e.target.value)}
//                       style={styles.input}
//                       required
//                     />
//                   </Form.Group>

//                   <Form.Group controlId="prenom" className="mb-3">
//                     <Form.Label style={styles.label}>Prénom</Form.Label>
//                     <Form.Control
//                       type="text"
//                       placeholder="Entrez votre prénom"
//                       value={prenom}
//                       onChange={(e) => setPrenom(e.target.value)}
//                       style={styles.input}
//                       required
//                     />
//                   </Form.Group>

//                   <Form.Group controlId="email" className="mb-3">
//                     <Form.Label style={styles.label}>Email</Form.Label>
//                     <Form.Control
//                       type="email"
//                       placeholder="Entrez votre email"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       style={styles.input}
//                       required
//                     />
//                   </Form.Group>

//                   {user?.role === 'internaute' && (
//                     <Form.Group controlId="specialite" className="mb-3">
//                       <Form.Label style={styles.label}>Spécialité</Form.Label>
//                       <Form.Control
//                         type="text"
//                         placeholder="Entrez votre spécialité"
//                         value={specialite}
//                         onChange={(e) => setSpecialite(e.target.value)}
//                         style={styles.input}
//                       />
//                     </Form.Group>
//                   )}

//                   <Form.Group controlId="password" className="mb-3">
//                     <Form.Label style={styles.label}>Nouveau mot de passe</Form.Label>
//                     <Form.Control
//                       type="password"
//                       placeholder="Laissez vide pour ne pas modifier"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       style={styles.input}
//                     />
//                   </Form.Group>

//                   <Form.Group controlId="confirmPassword" className="mb-3">
//                     <Form.Label style={styles.label}>Confirmer le mot de passe</Form.Label>
//                     <Form.Control
//                       type="password"
//                       placeholder="Laissez vide pour ne pas modifier"
//                       value={confirmPassword}
//                       onChange={(e) => setConfirmPassword(e.target.value)}
//                       style={styles.input}
//                     />
//                   </Form.Group>

//                   <Button type="submit" variant="primary" style={styles.submitButton}>
//                     Mettre à jour
//                   </Button>
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row>
//         </Form>
//       </Container>
//     </div>
//   );
// };

// // Styles
// const styles = {
//   container: {
//     paddingTop: '80px', // Adjusted for fixed navbar height
//     paddingBottom: '2rem',
//   },
//   title: {
//     fontSize: '2rem',
//     fontWeight: 'bold',
//     marginBottom: '1.5rem',
//     color: '#0a66c2',
//     textAlign: 'center',
//   },
//   profileCard: {
//     textAlign: 'center',
//     padding: '1rem',
//     borderRadius: '10px',
//     boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
//   },
//   profileImage: {
//     width: '150px',
//     height: '150px',
//     marginBottom: '1rem',
//     objectFit: 'cover',
//   },
//   fileInput: {
//     marginTop: '1rem',
//   },
//   detailsCard: {
//     padding: '1.5rem',
//     borderRadius: '10px',
//     boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
//   },
//   label: {
//     fontWeight: '600',
//     marginBottom: '0.5rem',
//   },
//   input: {
//     borderRadius: '5px',
//     border: '1px solid #ddd',
//     padding: '0.75rem',
//   },
//   submitButton: {
//     width: '100%',
//     marginTop: '1rem',
//   },
// };

// export default ProfileScreen;
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Image } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Navbar from './Navbar';

const ProfileScreen = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [specialite, setSpecialite] = useState('');
  const [ville, setVille] = useState(''); 
  const [localisation, setLocalisation] = useState(''); 
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setNom(parsedUser.nom || '');
      setPrenom(parsedUser.prenom || '');
      setEmail(parsedUser.email || '');
      setSpecialite(parsedUser.specialite || '');
      setVille(parsedUser.ville || ''); 
      setLocalisation(parsedUser.localisation || ''); 
      setPreviewImage(parsedUser.profileImage || '/placeholder-profile-image.jpg');
    }
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Les mots de passe ne correspondent pas',
        toast: true,
        position: 'top-end',
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('nom', nom || '');
      formData.append('prenom', prenom || '');
      formData.append('email', email || '');
      if (user.role === 'internaute') {
        formData.append('specialite', specialite || '');
        formData.append('ville', ville || ''); 
        formData.append('localisation', localisation || ''); 
      }
      if (password) {
        formData.append('password', password);
      }
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }

      // Debug FormData
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data',
        },
      };

      const { data } = await axios.put(
        'http://localhost:5000/api/auth/profile',
        formData,
        config
      );

      localStorage.setItem('user', JSON.stringify({
        ...user,
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        specialite: data.specialite,
        ville: data.ville, 
        localisation: data.localisation, 
        profileImage: data.profileImage,
      }));
      setUser({
        ...user,
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        specialite: data.specialite,
        ville: data.ville, 
        localisation: data.localisation, 
        profileImage: data.profileImage,
      });
      setPreviewImage(data.profileImage || '/placeholder-profile-image.jpg');

      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Profil mis à jour avec succès',
        toast: true,
        position: 'top-end',
        timer: 3000,
        timerProgressBar: true,
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Une erreur s\'est produite';
      if (err.response?.status === 401) {
        localStorage.removeItem('user');
        navigate('/login');
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: errorMessage,
          toast: true,
          position: 'top-end',
          timer: 3000,
          timerProgressBar: true,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: errorMessage,
          toast: true,
          position: 'top-end',
          timer: 3000,
          timerProgressBar: true,
        });
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <Container style={styles.container}>
        <h2 style={styles.title}>Modifier le profil</h2>

        <Form onSubmit={handleUpdate}>
          <Row>
            <Col md={4}>
              <Card style={styles.profileCard}>
                <Card.Body>
                  <Image
                    src={previewImage}
                    roundedCircle
                    style={styles.profileImage}
                  />
                  <Form.Group controlId="profileImage" className="mt-3">
                    <Form.Label style={styles.label}>Image de profil</Form.Label>
                    <Form.Control
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={handleImageChange}
                      style={styles.fileInput}
                    />
                  </Form.Group>
                </Card.Body>
              </Card>
            </Col>

            <Col md={8}>
              <Card style={styles.detailsCard}>
                <Card.Body>
                  <Form.Group controlId="nom" className="mb-3">
                    <Form.Label style={styles.label}>Nom</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Entrez votre nom"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      style={styles.input}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="prenom" className="mb-3">
                    <Form.Label style={styles.label}>Prénom</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Entrez votre prénom"
                      value={prenom}
                      onChange={(e) => setPrenom(e.target.value)}
                      style={styles.input}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="email" className="mb-3">
                    <Form.Label style={styles.label}>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Entrez votre email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={styles.input}
                      required
                    />
                  </Form.Group>

                  {user?.role === 'internaute' && (
                    <>
                      <Form.Group controlId="specialite" className="mb-3">
                        <Form.Label style={styles.label}>Spécialité</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Entrez votre spécialité"
                          value={specialite}
                          onChange={(e) => setSpecialite(e.target.value)}
                          style={styles.input}
                        />
                      </Form.Group>

                      <Form.Group controlId="ville" className="mb-3">
                        <Form.Label style={styles.label}>Ville</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Entrez votre ville"
                          value={ville}
                          onChange={(e) => setVille(e.target.value)}
                          style={styles.input}
                        />
                      </Form.Group>

                      <Form.Group controlId="localisation" className="mb-3">
                        <Form.Label style={styles.label}>Localisation</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Entrez votre localisation"
                          value={localisation}
                          onChange={(e) => setLocalisation(e.target.value)}
                          style={styles.input}
                        />
                      </Form.Group>
                    </>
                  )}

                  <Form.Group controlId="password" className="mb-3">
                    <Form.Label style={styles.label}>Nouveau mot de passe</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Laissez vide pour ne pas modifier"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={styles.input}
                    />
                  </Form.Group>

                  <Form.Group controlId="confirmPassword" className="mb-3">
                    <Form.Label style={styles.label}>Confirmer le mot de passe</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Laissez vide pour ne pas modifier"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={styles.input}
                    />
                  </Form.Group>

                  <Button type="submit" variant="primary" style={styles.submitButton}>
                    Mettre à jour
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Form>
      </Container>
    </div>
  );
};

// Styles (inchangés)
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
  profileCard: {
    textAlign: 'center',
    padding: '1rem',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  profileImage: {
    width: '150px',
    height: '150px',
    marginBottom: '1rem',
    objectFit: 'cover',
  },
  fileInput: {
    marginTop: '1rem',
  },
  detailsCard: {
    padding: '1.5rem',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  label: {
    fontWeight: '600',
    marginBottom: '0.5rem',
  },
  input: {
    borderRadius: '5px',
    border: '1px solid #ddd',
    padding: '0.75rem',
  },
  submitButton: {
    width: '100%',
    marginTop: '1rem',
  },
};

export default ProfileScreen;