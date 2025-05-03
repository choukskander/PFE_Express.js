// import React from 'react';
// import { Nav, Button, Badge } from 'react-bootstrap';
// import { FaUserMd, FaUsers, FaUserShield, FaSignOutAlt, FaChevronLeft, FaChevronRight, FaCalendarAlt } from 'react-icons/fa';

// const Sidebar = ({
//   sidebarOpen,
//   setSidebarOpen,
//   activeSection,
//   setActiveSection,
//   medecins,
//   patients,
//   admins,
//   appointments,
//   handleLogout,
// }) => {
//   return (
//     <div
//       style={{
//         width: sidebarOpen ? '250px' : '80px',
//         backgroundColor: '#0d6efd',
//         color: 'white',
//         transition: 'all 0.3s ease-in-out',
//         position: 'fixed',
//         height: '100vh',
//         zIndex: 10,
//       }}
//     >
//       <div className="p-4 d-flex justify-content-between align-items-center">
//         {sidebarOpen ? (
//           <h4 style={{ color: 'white', fontWeight: 'bold', margin: 0 }}>
//             Rdv-Med Admin
//           </h4>
//         ) : (
//           <h4 style={{ color: 'white', fontWeight: 'bold', margin: 0 }}>RMA</h4>
//         )}
//         <Button
//           variant="link"
//           onClick={() => setSidebarOpen(!sidebarOpen)}
//           style={{ color: 'white', padding: 0 }}
//         >
//           {sidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
//         </Button>
//       </div>
//       <Nav className="flex-column mt-4">
//         <Nav.Link
//           onClick={() => setActiveSection('dashboard')}
//           style={{
//             padding: '12px 20px',
//             display: 'flex',
//             alignItems: 'center',
//             backgroundColor: activeSection === 'dashboard' ? '#3b86ff' : 'transparent',
//             color: 'white',
//             borderRadius: '8px',
//             margin: '0 10px',
//             transition: 'background-color 0.2s ease',
//           }}
//           onMouseEnter={(e) => {
//             if (activeSection !== 'dashboard') {
//               e.currentTarget.style.backgroundColor = '#1a73e8';
//             }
//           }}
//           onMouseLeave={(e) => {
//             if (activeSection !== 'dashboard') {
//               e.currentTarget.style.backgroundColor = 'transparent';
//             }
//           }}
//         >
//           <i className="fas fa-tachometer-alt me-2"></i>
//           {sidebarOpen && <span>Tableau de bord</span>}
//         </Nav.Link>
//         <Nav.Link
//           onClick={() => setActiveSection('users')}
//           style={{
//             padding: '12px 20px',
//             display: 'flex',
//             alignItems: 'center',
//             backgroundColor: activeSection === 'users' ? '#3b86ff' : 'transparent',
//             color: 'white',
//             borderRadius: '8px',
//             margin: '0 10px',
//             transition: 'background-color 0.2s ease',
//           }}
//           onMouseEnter={(e) => {
//             if (activeSection !== 'users') {
//               e.currentTarget.style.backgroundColor = '#1a73e8';
//             }
//           }}
//           onMouseLeave={(e) => {
//             if (activeSection !== 'users') {
//               e.currentTarget.style.backgroundColor = 'transparent';
//             }
//           }}
//         >
//           <i className="fas fa-users me-2"></i>
//           {sidebarOpen && <span>Gestion des utilisateurs</span>}
//         </Nav.Link>
//         <Nav.Link
//           onClick={() => setActiveSection('medecins')}
//           style={{
//             padding: '12px 20px',
//             display: 'flex',
//             alignItems: 'center',
//             backgroundColor: activeSection === 'medecins' ? '#3b86ff' : 'transparent',
//             color: 'white',
//             borderRadius: '8px',
//             margin: '0 10px',
//             transition: 'background-color 0.2s ease',
//           }}
//           onMouseEnter={(e) => {
//             if (activeSection !== 'medecins') {
//               e.currentTarget.style.backgroundColor = '#1a73e8';
//             }
//           }}
//           onMouseLeave={(e) => {
//             if (activeSection !== 'medecins') {
//               e.currentTarget.style.backgroundColor = 'transparent';
//             }
//           }}
//         >
//           <FaUserMd className="me-2" />
//           {sidebarOpen && <span>Médecins</span>}
//           {sidebarOpen && (
//             <Badge bg="light" text="dark" className="ms-2">
//               {medecins.length}
//             </Badge>
//           )}
//         </Nav.Link>
//         <Nav.Link
//           onClick={() => setActiveSection('patients')}
//           style={{
//             padding: '12px 20px',
//             display: 'flex',
//             alignItems: 'center',
//             backgroundColor: activeSection === 'patients' ? '#3b86ff' : 'transparent',
//             color: 'white',
//             borderRadius: '8px',
//             margin: '0 10px',
//             transition: 'background-color 0.2s ease',
//           }}
//           onMouseEnter={(e) => {
//             if (activeSection !== 'patients') {
//               e.currentTarget.style.backgroundColor = '#1a73e8';
//             }
//           }}
//           onMouseLeave={(e) => {
//             if (activeSection !== 'patients') {
//               e.currentTarget.style.backgroundColor = 'transparent';
//             }
//           }}
//         >
//           <FaUsers className="me-2" />
//           {sidebarOpen && <span>Patients</span>}
//           {sidebarOpen && (
//             <Badge bg="light" text="dark" className="ms-2">
//               {patients.length}
//             </Badge>
//           )}
//         </Nav.Link>
//         <Nav.Link
//           onClick={() => setActiveSection('admins')}
//           style={{
//             padding: '12px 20px',
//             display: 'flex',
//             alignItems: 'center',
//             backgroundColor: activeSection === 'admins' ? '#3b86ff' : 'transparent',
//             color: 'white',
//             borderRadius: '8px',
//             margin: '0 10px',
//             transition: 'background-color 0.2s ease',
//           }}
//           onMouseEnter={(e) => {
//             if (activeSection !== 'admins') {
//               e.currentTarget.style.backgroundColor = '#1a73e8';
//             }
//           }}
//           onMouseLeave={(e) => {
//             if (activeSection !== 'admins') {
//               e.currentTarget.style.backgroundColor = 'transparent';
//             }
//           }}
//         >
//           <FaUserShield className="me-2" />
//           {sidebarOpen && <span>Admins</span>}
//           {sidebarOpen && (
//             <Badge bg="light" text="dark" className="ms-2">
//               {admins.length}
//             </Badge>
//           )}
//         </Nav.Link>
//         <Nav.Link
//           onClick={() => setActiveSection('appointments')}
//           style={{
//             padding: '12px 20px',
//             display: 'flex',
//             alignItems: 'center',
//             backgroundColor: activeSection === 'appointments' ? '#3b86ff' : 'transparent',
//             color: 'white',
//             borderRadius: '8px',
//             margin: '0 10px',
//             transition: 'background-color 0.2s ease',
//           }}
//           onMouseEnter={(e) => {
//             if (activeSection !== 'appointments') {
//               e.currentTarget.style.backgroundColor = '#1a73e8';
//             }
//           }}
//           onMouseLeave={(e) => {
//             if (activeSection !== 'appointments') {
//               e.currentTarget.style.backgroundColor = 'transparent';
//             }
//           }}
//         >
//           <FaCalendarAlt className="me-2" />
//           {sidebarOpen && <span>Rendez-vous</span>}
//           {sidebarOpen && (
//             <Badge bg="light" text="dark" className="ms-2">
//               {appointments.length}
//             </Badge>
//           )}
//         </Nav.Link>
//         <Nav.Link
//           onClick={handleLogout}
//           style={{
//             padding: '12px 20px',
//             display: 'flex',
//             alignItems: 'center',
//             backgroundColor: 'transparent',
//             color: 'white',
//             borderRadius: '8px',
//             margin: '0 10px',
//             transition: 'background-color 0.2s ease',
//             position: 'absolute',
//             bottom: '20px',
//             width: sidebarOpen ? 'calc(100% - 40px)' : 'auto',
//           }}
//           onMouseEnter={(e) => {
//             e.currentTarget.style.backgroundColor = '#1a73e8';
//           }}
//           onMouseLeave={(e) => {
//             e.currentTarget.style.backgroundColor = 'transparent';
//           }}
//         >
//           <FaSignOutAlt className="me-2" />
//           {sidebarOpen && <span>Déconnexion</span>}
//         </Nav.Link>
//       </Nav>
//     </div>
//   );
// };

// export default Sidebar;
import React from 'react';
import { Nav, Button, Badge } from 'react-bootstrap';
import { FaUserMd, FaUsers, FaUserShield, FaSignOutAlt, FaChevronLeft, FaChevronRight, FaCalendarAlt, FaComments } from 'react-icons/fa';

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  activeSection,
  setActiveSection,
  medecins,
  patients,
  admins,
  appointments,
  forums, // Add forums to destructured props
  handleLogout,
}) => {
  return (
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
            backgroundColor: activeSection === 'dashboard' ? '#3b86ff' : 'transparent',
            color: 'white',
            borderRadius: '8px',
            margin: '0 10px',
            transition: 'background-color 0.2s ease',
          }}
          onMouseEnter={(e) => {
            if (activeSection !== 'dashboard') {
              e.currentTarget.style.backgroundColor = '#1a73e8';
            }
          }}
          onMouseLeave={(e) => {
            if (activeSection !== 'dashboard') {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
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
            backgroundColor: activeSection === 'users' ? '#3b86ff' : 'transparent',
            color: 'white',
            borderRadius: '8px',
            margin: '0 10px',
            transition: 'background-color 0.2s ease',
          }}
          onMouseEnter={(e) => {
            if (activeSection !== 'users') {
              e.currentTarget.style.backgroundColor = '#1a73e8';
            }
          }}
          onMouseLeave={(e) => {
            if (activeSection !== 'users') {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
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
            backgroundColor: activeSection === 'medecins' ? '#3b86ff' : 'transparent',
            color: 'white',
            borderRadius: '8px',
            margin: '0 10px',
            transition: 'background-color 0.2s ease',
          }}
          onMouseEnter={(e) => {
            if (activeSection !== 'medecins') {
              e.currentTarget.style.backgroundColor = '#1a73e8';
            }
          }}
          onMouseLeave={(e) => {
            if (activeSection !== 'medecins') {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
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
            backgroundColor: activeSection === 'patients' ? '#3b86ff' : 'transparent',
            color: 'white',
            borderRadius: '8px',
            margin: '0 10px',
            transition: 'background-color 0.2s ease',
          }}
          onMouseEnter={(e) => {
            if (activeSection !== 'patients') {
              e.currentTarget.style.backgroundColor = '#1a73e8';
            }
          }}
          onMouseLeave={(e) => {
            if (activeSection !== 'patients') {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
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
            backgroundColor: activeSection === 'admins' ? '#3b86ff' : 'transparent',
            color: 'white',
            borderRadius: '8px',
            margin: '0 10px',
            transition: 'background-color 0.2s ease',
          }}
          onMouseEnter={(e) => {
            if (activeSection !== 'admins') {
              e.currentTarget.style.backgroundColor = '#1a73e8';
            }
          }}
          onMouseLeave={(e) => {
            if (activeSection !== 'admins') {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
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
            backgroundColor: activeSection === 'appointments' ? '#3b86ff' : 'transparent',
            color: 'white',
            borderRadius: '8px',
            margin: '0 10px',
            transition: 'background-color 0.2s ease',
          }}
          onMouseEnter={(e) => {
            if (activeSection !== 'appointments') {
              e.currentTarget.style.backgroundColor = '#1a73e8';
            }
          }}
          onMouseLeave={(e) => {
            if (activeSection !== 'appointments') {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
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
          onClick={() => setActiveSection('forums')}
          style={{
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: activeSection === 'forums' ? '#3b86ff' : 'transparent',
            color: 'white',
            borderRadius: '8px',
            margin: '0 10px',
            transition: 'background-color 0.2s ease',
          }}
          onMouseEnter={(e) => {
            if (activeSection !== 'forums') {
              e.currentTarget.style.backgroundColor = '#1a73e8';
            }
          }}
          onMouseLeave={(e) => {
            if (activeSection !== 'forums') {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          <FaComments className="me-2" />
          {sidebarOpen && <span>Forums</span>}
          {sidebarOpen && (
            <Badge bg="light" text="dark" className="ms-2">
              {forums.length}
            </Badge>
          )}
        </Nav.Link>
        <Nav.Link
          onClick={handleLogout}
          style={{
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'transparent',
            color: 'white',
            borderRadius: '8px',
            margin: '0 10px',
            transition: 'background-color 0.2s ease',
            position: 'absolute',
            bottom: '20px',
            width: sidebarOpen ? 'calc(100% - 40px)' : 'auto',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#1a73e8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <FaSignOutAlt className="me-2" />
          {sidebarOpen && <span>Déconnexion</span>}
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;