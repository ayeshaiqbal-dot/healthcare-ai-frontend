import { useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div
      style={{
        width: "240px",
        minHeight: "100vh",
        padding: "20px",
        boxSizing: "border-box",
        borderRight: "1px solid #ddd",
        backgroundColor: "#ffffff",
      }}
    >
      <h2>HealthCare AI</h2>

      <nav>
        <p
          onClick={() => navigate("/dashboard")}
          style={navStyle}
        >
          Dashboard
        </p>

        <p
          onClick={() => navigate("/ai-assistant")}
          style={navStyle}
        >
          AI Medical Assistant
        </p>

        <p
          onClick={() => navigate("/find-doctor")}
          style={navStyle}
        >
          Find Doctor
        </p>

        <p
          onClick={() => navigate("/appointments")}
          style={navStyle}
        >
          Appointments
        </p>

        <p
          onClick={() => navigate("/health-records")}
          style={navStyle}
        >
          Health Records
        </p>

        <p
          onClick={() => navigate("/profile")}
          style={navStyle}
        >
          Profile
        </p>
      </nav>

      <button
        onClick={handleLogout}
        style={{
          marginTop: "30px",
          padding: "10px 20px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
}

const navStyle = {
  cursor: "pointer",
  padding: "10px 5px",
};

export default Sidebar;