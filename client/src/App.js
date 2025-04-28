import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/pages/LandingPage';
import SignIn from './components/pages/SignIn';
import StudentDashboard from './components/pages/StudentDashboard';
import FacultyDashboard from './components/pages/FacultyDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/StudentDashboard" element={<StudentDashboard />} />
      <Route path="/FacultyDashboard" element={<FacultyDashboard />} />
    </Routes>
  );
}

export default App;
