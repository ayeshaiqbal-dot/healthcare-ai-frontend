
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f7fa",
        padding: "30px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <div>
          <h1 style={{ marginBottom: "5px" }}>
            Admin Dashboard
          </h1>

          <p style={{ color: "#6b7280" }}>
            Welcome, {user.name || "Admin"}
          </p>
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: "10px 18px",
            border: "none",
            borderRadius: "8px",
            backgroundColor: "#dc2626",
            color: "white",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        <div style={cardStyle}>
          <h2>Doctors</h2>

          <p style={descriptionStyle}>
            Manage doctors and create doctor accounts.
          </p>

          <button
            onClick={() =>
              navigate("/admin/doctors")
            }
            style={buttonStyle}
          >
            Manage Doctors
          </button>
        </div>

        <div style={cardStyle}>
          <h2>Patients</h2>

          <p style={descriptionStyle}>
            View and manage registered patients.
          </p>

          <button
            onClick={() =>
              navigate("/admin/patients")
            }
            style={buttonStyle}
          >
            Manage Patients
          </button>
        </div>

        <div style={cardStyle}>
          <h2>Appointments</h2>

          <p style={descriptionStyle}>
            View and manage platform appointments.
          </p>

          <button
            onClick={() =>
              navigate("/admin/appointments")
            }
            style={buttonStyle}
          >
            View Appointments
          </button>
        </div>

        <div style={cardStyle}>
          <h2>Health Records</h2>

          <p style={descriptionStyle}>
            Access platform health records.
          </p>

          <button
            onClick={() =>
              navigate("/admin/health-records")
            }
            style={buttonStyle}
          >
            View Records
          </button>
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  backgroundColor: "white",
  padding: "25px",
  borderRadius: "14px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
};

const descriptionStyle = {
  color: "#6b7280",
  minHeight: "45px",
};

const buttonStyle = {
  width: "100%",
  padding: "11px",
  border: "none",
  borderRadius: "8px",
  backgroundColor: "#2563eb",
  color: "white",
  cursor: "pointer",
  fontSize: "14px",
};

export default AdminDashboard;

