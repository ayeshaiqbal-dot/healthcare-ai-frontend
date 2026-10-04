
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      console.log("Login response:", data);

      if (!response.ok) {
        setMessage(data.message || "Login failed.");
        return;
      }

      if (!data.token) {
        setMessage("Login succeeded but no token was received.");
        return;
      }

      // Save JWT token
      localStorage.setItem("token", data.token);

      // Save user information
      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      setMessage("Login successful!");

      // ==========================================
      // ROLE-BASED REDIRECTION
      // ==========================================

      if (data.user?.role === "patient") {
        navigate("/patient-dashboard");
      } else if (data.user?.role === "doctor") {
        navigate("/doctor-dashboard");
      } else if (data.user?.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        setMessage("Unknown user role.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f7fa",
        padding: "30px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "450px",
          backgroundColor: "#fff",
          padding: "40px",
          borderRadius: "14px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ textAlign: "center" }}>
          Login
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#6b7280",
          }}
        >
          Welcome back! Please sign in to your account.
        </p>

        <form onSubmit={handleSubmit}>
          {/* EMAIL */}

          <label>Email</label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            style={inputStyle}
          />

          {/* PASSWORD */}

          <label>Password</label>

          <div
            style={{
              position: "relative",
              marginTop: "8px",
              marginBottom: "20px",
            }}
          >
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              style={{
                ...inputStyle,
                marginTop: "0",
                marginBottom: "0",
                paddingRight: "45px",
              }}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: "18px",
                padding: "5px",
              }}
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {/* FORGOT PASSWORD */}

          <div
            style={{
              textAlign: "right",
              marginBottom: "20px",
            }}
          >
            <span
              onClick={() => navigate("/forgot-password")}
              style={{
                color: "#2563eb",
                cursor: "pointer",
              }}
            >
              Forgot your password?
            </span>
          </div>

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              border: "none",
              borderRadius: "8px",
              backgroundColor: "#2563eb",
              color: "white",
              fontSize: "16px",
              cursor: loading
                ? "not-allowed"
                : "pointer",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* MESSAGE */}

        {message && (
          <p
            style={{
              textAlign: "center",
              marginTop: "15px",
            }}
          >
            {message}
          </p>
        )}

        {/* REGISTER */}

        <p
          style={{
            textAlign: "center",
            marginTop: "25px",
          }}
        >
          New user?{" "}
          <span
            onClick={() => navigate("/register")}
            style={{
              color: "#2563eb",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "12px",
  marginTop: "8px",
  marginBottom: "20px",
  boxSizing: "border-box",
  border: "1px solid #ccc",
  borderRadius: "8px",
};

export default Login;

