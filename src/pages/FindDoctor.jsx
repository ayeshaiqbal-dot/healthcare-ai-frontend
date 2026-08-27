import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function FindDoctor() {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/doctors"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch doctors");
        }

        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        console.error("Doctor fetch error:", error);
        setError("Unable to load doctors.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doctor) => {
    const text = search.toLowerCase();

    return (
      doctor.name?.toLowerCase().includes(text) ||
      doctor.specialization?.toLowerCase().includes(text) ||
      doctor.hospital?.toLowerCase().includes(text) ||
      doctor.location?.toLowerCase().includes(text)
    );
  });

  const handleBookAppointment = (doctor) => {
    navigate("/appointments", {
      state: {
        doctor,
      },
    });
  };

  return (
    <div
      style={{
        padding: "30px",
        backgroundColor: "#f5f7fa",
        minHeight: "100vh",
      }}
    >
      <h1>Find a Doctor 👨‍⚕️</h1>

      <p style={{ color: "#666" }}>
        Search for doctors and specialists.
      </p>

      {/* SEARCH BOX */}
      <input
        type="text"
        placeholder="Search doctor, specialization, hospital or location..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          maxWidth: "600px",
          padding: "15px",
          marginTop: "20px",
          marginBottom: "30px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          fontSize: "16px",
          boxSizing: "border-box",
        }}
      />

      {loading && <p>Loading doctors...</p>}

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {!loading && !error && filteredDoctors.length === 0 && (
        <p>No doctors found.</p>
      )}

      {/* DOCTOR CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        {filteredDoctors.map((doctor) => (
          <div
            key={doctor._id}
            style={{
              backgroundColor: "white",
              padding: "25px",
              borderRadius: "12px",
              border: "1px solid #ddd",
            }}
          >
            <h2>{doctor.name}</h2>

            <p>
              <strong>Specialization:</strong>{" "}
              {doctor.specialization}
            </p>

            <p>
              <strong>Experience:</strong>{" "}
              {doctor.experience} years
            </p>

            <p>
              <strong>Hospital:</strong>{" "}
              {doctor.hospital}
            </p>

            <p>
              <strong>Location:</strong>{" "}
              {doctor.location}
            </p>

            <p>
              <strong>Phone:</strong>{" "}
              {doctor.phone}
            </p>

            <p>🟢 Available</p>

            <button
              onClick={() => handleBookAppointment(doctor)}
              style={{
                width: "100%",
                padding: "12px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Book Appointment
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FindDoctor;