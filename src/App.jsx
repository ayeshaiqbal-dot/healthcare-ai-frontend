
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboard from "./pages/AdminDashboard";

import AIAssistant from "./pages/AIAssistant";
import FindDoctor from "./pages/FindDoctor";
import Appointments from "./pages/Appointments";
import HealthRecords from "./pages/HealthRecords";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminDoctors from "./pages/AdminDoctors";

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

        <Route
          path="/patient-dashboard"
          element={<PatientDashboard />}
        />

        <Route
          path="/doctor-dashboard"
          element={<DoctorDashboard />}
        />

        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
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

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />
        <Route
  path="/admin/doctors"
  element={<AdminDoctors />}
/>

        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;

