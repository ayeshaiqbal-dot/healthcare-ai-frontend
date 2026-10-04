import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 30px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      {/* Welcome Section */}
      <div>
        <h2
          style={{
            margin: 0,
            fontSize: "24px",
          }}
        >
          Welcome back 👋
        </h2>

        <p
          style={{
            margin: "6px 0 0",
            color: "#6b7280",
          }}
        >
          Manage your healthcare easily
        </p>
      </div>

      {/* Right Section */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
        }}
      >
        {/* Notification */}
        <button
          onClick={() => alert("No new notifications")}
          style={{
            padding: "10px 14px",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            backgroundColor: "#ffffff",
            cursor: "pointer",
          }}
        >
          🔔
        </button>

        {/* Profile */}
        <button
          onClick={() => navigate("/profile")}
          style={{
            padding: "10px 16px",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            backgroundColor: "#ffffff",
            cursor: "pointer",
          }}
        >
          👤 Profile
        </button>
      </div>
    </header>
  );
}

export default Header;