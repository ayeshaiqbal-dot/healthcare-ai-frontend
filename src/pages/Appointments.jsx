import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function Appointments() {
  const location = useLocation();

  const selectedDoctor = location.state?.doctor || null;

  const [appointments, setAppointments] = useState([]);
  const [doctor, setDoctor] = useState(selectedDoctor);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // Get appointments
  const fetchAppointments = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/appointments/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load appointments");
      }

      setAppointments(data);
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAppointments();
    }
  }, [token]);

  // Book appointment
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!doctor) {
      setError("Please select a doctor first.");
      return;
    }

    if (!date || !time) {
      setError("Please select date and time.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/appointments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            doctor: doctor._id,
            date,
            time,
            reason,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to book appointment"
        );
      }

      setMessage("Appointment booked successfully! 🎉");

      setDate("");
      setTime("");
      setReason("");

      await fetchAppointments();
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Cancel appointment
  const handleCancel = async (appointmentId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!confirmCancel) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/appointments/${appointmentId}/cancel`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to cancel appointment"
        );
      }

      setMessage("Appointment cancelled successfully.");

      await fetchAppointments();
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  return (
    <div
      style={{
        padding: "30px",
        backgroundColor: "#f5f7fa",
        minHeight: "100vh",
      }}
    >
      <h1>Appointments 📅</h1>

      <p style={{ color: "#666" }}>
        Book and manage your doctor appointments.
      </p>

      {/* Messages */}

      {message && (
        <div
          style={{
            padding: "12px",
            marginTop: "20px",
            marginBottom: "20px",
            backgroundColor: "#dcfce7",
            borderRadius: "8px",
          }}
        >
          {message}
        </div>
      )}

      {error && (
        <div
          style={{
            padding: "12px",
            marginTop: "20px",
            marginBottom: "20px",
            backgroundColor: "#fee2e2",
            color: "#b91c1c",
            borderRadius: "8px",
          }}
        >
          {error}
        </div>
      )}

      {/* Booking Form */}

      {doctor && (
        <div
          style={{
            backgroundColor: "white",
            padding: "25px",
            borderRadius: "12px",
            border: "1px solid #ddd",
            marginTop: "25px",
            maxWidth: "600px",
          }}
        >
          <h2>Book Appointment</h2>

          <p>
            <strong>Doctor:</strong> {doctor.name}
          </p>

          <p>
            <strong>Specialization:</strong>{" "}
            {doctor.specialization}
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginTop: "20px" }}>
              <label>
                <strong>Date</strong>
              </label>

              <input
                type="date"
                value={date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDate(e.target.value)}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "12px",
                  marginTop: "8px",
                  boxSizing: "border-box",
                }}
                required
              />
            </div>

            <div style={{ marginTop: "20px" }}>
              <label>
                <strong>Time</strong>
              </label>

              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "12px",
                  marginTop: "8px",
                  boxSizing: "border-box",
                }}
                required
              />
            </div>

            <div style={{ marginTop: "20px" }}>
              <label>
                <strong>Reason</strong>
              </label>

              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Describe your reason for the appointment..."
                rows="4"
                style={{
                  display: "block",
                  width: "100%",
                  padding: "12px",
                  marginTop: "8px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "20px",
                border: "none",
                borderRadius: "8px",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: "bold",
              }}
            >
              {loading ? "Booking..." : "Confirm Appointment"}
            </button>
          </form>
        </div>
      )}

      {/* Existing Appointments */}

      <div style={{ marginTop: "40px" }}>
        <h2>My Appointments</h2>

        {appointments.length === 0 ? (
          <p>No appointments booked yet.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
              marginTop: "20px",
            }}
          >
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                style={{
                  backgroundColor: "white",
                  padding: "20px",
                  borderRadius: "12px",
                  border: "1px solid #ddd",
                }}
              >
                <h3>
                  {appointment.doctor?.name ||
                    "Doctor"}
                </h3>

                <p>
                  <strong>Specialization:</strong>{" "}
                  {appointment.doctor?.specialization ||
                    "N/A"}
                </p>

                <p>
                  <strong>Date:</strong>{" "}
                  {appointment.date}
                </p>

                <p>
                  <strong>Time:</strong>{" "}
                  {appointment.time}
                </p>

                <p>
                  <strong>Reason:</strong>{" "}
                  {appointment.reason || "Not provided"}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  {appointment.status}
                </p>

                {appointment.status !== "cancelled" && (
                  <button
                    onClick={() =>
                      handleCancel(appointment._id)
                    }
                    style={{
                      padding: "10px 15px",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    Cancel Appointment
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Appointments;