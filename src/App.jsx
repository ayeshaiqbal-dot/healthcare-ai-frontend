import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";

import AIAssistant from "./pages/AIAssistant";
import FindDoctor from "./pages/FindDoctor";
import Appointments from "./pages/Appointments";
import HealthRecords from "./pages/HealthRecords";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* PATIENT */}
        <Route
          path="/patient-dashboard"
          element={<PatientDashboard />}
        />

        <Route
          path="/ai-assistant"
          element={<AIAssistant />}
        />

        <Route
          path="/find-doctor"
          element={<FindDoctor />}
        />

        <Route
          path="/appointments"
          element={<Appointments />}
        />

        <Route
          path="/health-records"
          element={<HealthRecords />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        {/* DOCTOR */}
        <Route
          path="/doctor-dashboard"
          element={<DoctorDashboard />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;