import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import 'bootstrap/dist/css/bootstrap.min.css';
import PatientPage from "./pages/RegisterPatient";
import InternautePage from "./pages/RegisterInternaute";
import ProfileScreen from "./pages/ProfileScreen";
import DoctorDashboard from './pages/DoctorDashboard';
import SearchDoctors from './pages/SearchDoctors';
import DoctorSchedule from './pages/DoctorSchedule';
import DoctorList from './pages/DoctorList';
import DoctorSchedulePatient from './pages/DoctorSchedulePatient';
import DoctorAppointments from './pages/DoctorAppointments';
import PatientAppointments from './pages/PatientAppointments';
import Historique from './pages/Historique';
import MeetingPage from './pages/Meeting';
import AdminDashboard from './components/AdminDashboard';
import MedicalForumBuilder from './components/MedicalForumBuilder';
import ErrorPage from './pages/error.jsx';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'antd/dist/reset.css';
import ForumList from "./components/ForumList";
import ForumResponse from "./components/ForumResponse";
import ForumResponses from "./components/ForumResponses";
import DiagnosticIA from './pages/DiagnosticIA';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/ProfileScreen" element={<ProfileScreen />} />
          <Route path="/registerpatient" element={<PatientPage />} />
          <Route path="/registerinternaute" element={<InternautePage />} />
          <Route path="/search-doctors" element={<SearchDoctors />} />
          <Route path="/doctor-schedule" element={<DoctorSchedule />} />
          <Route path="/doctors" element={<DoctorList />} />
          <Route path="/doctor-schedule/:doctorId" element={<DoctorSchedulePatient />} />
          <Route path="/my-appointments/doctor" element={<DoctorAppointments />} />
          <Route path="/my-appointments/patient" element={<PatientAppointments />} />
          <Route path="/historique/patient" element={<Historique />} />
          <Route path="/doctor" element={<DoctorDashboard />} />
          <Route path="/meeting" element={<MeetingPage />} />
          <Route path="/create-forum" element={<MedicalForumBuilder />} />
          <Route path="/forums" element={<ForumList />} />
          <Route path="/forum/:id" element={<ForumResponse />} />
          <Route path="/forum-responses/:forumId" element={<ForumResponses />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/diagnostic-ia" element={<DiagnosticIA />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;