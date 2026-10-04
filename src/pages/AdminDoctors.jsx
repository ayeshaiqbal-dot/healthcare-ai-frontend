
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDoctors() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    email: "",
    password: "",
    phone: "",
    experience: "",
    hospital: "",
    location: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
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
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login as admin first.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/doctors/admin/create",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            ...formData,
            experience:
              Number(formData.experience) || 0,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to create doctor account."
        );
        setLoading(false);
        return;
      }

      setMessage(
        "Doctor account created successfully!"
      );

      setFormData({
        name: "",
        specialization: "",
        email: "",
        password: "",
        phone: "",
        experience: "",
        hospital: "",
        location: "",
      });

    } catch (error) {
      console.error(
        "Create doctor error:",
        error
      );

      setError(
        "Could not connect to server."
      );
    }

    setLoading(false);
  };

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

      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <div>
          <h1>
            Create Doctor Account
          </h1>

          <p
            style={{
              color: "#6b7280",
            }}
          >
            Admin can create doctor login
            accounts from here.
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


      {/* BACK BUTTON */}

      <button
        onClick={() =>
          navigate("/admin-dashboard")
        }
        style={{
          marginBottom: "20px",
          padding: "10px 16px",
          border: "none",
          borderRadius: "8px",
          backgroundColor: "#6b7280",
          color: "white",
          cursor: "pointer",
        }}
      >
        ← Back to Admin Dashboard
      </button>


      {/* FORM */}

      <div
        style={{
          maxWidth: "700px",
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "14px",
          boxShadow:
            "0 4px 15px rgba(0,0,0,0.08)",
        }}
      >

        <form onSubmit={handleSubmit}>

          {/* NAME */}

          <label>Doctor Name</label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Dr. Ahmed Khan"
            required
            style={inputStyle}
          />


          {/* SPECIALIZATION */}

          <label>Specialization</label>

          <input
            type="text"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            placeholder="Cardiologist"
            required
            style={inputStyle}
          />


          {/* EMAIL */}

          <label>Email</label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="doctor@example.com"
            required
            style={inputStyle}
          />


          {/* PASSWORD */}

          <label>Password</label>

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create doctor password"
            required
            minLength="6"
            style={inputStyle}
          />


          {/* PHONE */}

          <label>Phone</label>

          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="03001234567"
            style={inputStyle}
          />


          {/* EXPERIENCE */}

          <label>Experience (Years)</label>

          <input
            type="number"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            placeholder="5"
            min="0"
            style={inputStyle}
          />


          {/* HOSPITAL */}

          <label>Hospital / Clinic</label>

          <input
            type="text"
            name="hospital"
            value={formData.hospital}
            onChange={handleChange}
            placeholder="City Hospital"
            style={inputStyle}
          />


          {/* LOCATION */}

          <label>Location</label>

          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Islamabad"
            style={inputStyle}
          />


          {/* MESSAGE */}

          {message && (
            <p
              style={{
                color: "green",
                fontWeight: "bold",
                marginTop: "15px",
              }}
            >
              {message}
            </p>
          )}


          {/* ERROR */}

          {error && (
            <p
              style={{
                color: "red",
                fontWeight: "bold",
                marginTop: "15px",
              }}
            >
              {error}
            </p>
          )}


          {/* SUBMIT */}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              marginTop: "20px",
              border: "none",
              borderRadius: "8px",
              backgroundColor:
                loading
                  ? "#9ca3af"
                  : "#2563eb",
              color: "white",
              cursor: loading
                ? "not-allowed"
                : "pointer",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            {loading
              ? "Creating Doctor..."
              : "Create Doctor Account"}
          </button>

        </form>

      </div>
    </div>
  );
}


const inputStyle = {
  width: "100%",
  padding: "11px",
  marginTop: "7px",
  marginBottom: "18px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  boxSizing: "border-box",
  fontSize: "14px",
};


export default AdminDoctors;

