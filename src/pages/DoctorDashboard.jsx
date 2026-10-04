
import { useEffect, useState } from "react";

function DoctorDashboard() {
  const [doctor, setDoctor] = useState(null);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
  });

  const [appointments, setAppointments] = useState([]);

  // Health Records
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [healthRecords, setHealthRecords] = useState([]);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [recordsError, setRecordsError] = useState("");

  // Prescription
  const [selectedAppointment, setSelectedAppointment] =
    useState(null);
  const [medicines, setMedicines] = useState("");
  const [instructions, setInstructions] = useState("");
  const [prescriptionLoading, setPrescriptionLoading] =
    useState(false);

  // Availability
  const [availabilityLoading, setAvailabilityLoading] =
    useState(false);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  // ==========================================
  // LOAD DOCTOR DASHBOARD
  // ==========================================

  const loadDashboard = async () => {
    try {
      if (!token) {
        setMessage("Please login first.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/doctors/dashboard",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Unable to load dashboard"
        );
        setLoading(false);
        return;
      }

      setDoctor(data.doctor);
      setStats(data.stats);
      setAppointments(data.appointments || []);

      setLoading(false);
    } catch (error) {
      console.error("Dashboard error:", error);

      setMessage("Could not connect to server.");
      setLoading(false);
    }
  };

  // ==========================================
  // CHANGE AVAILABILITY
  // ==========================================

  const changeAvailability = async () => {
    try {
      setAvailabilityLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/doctors/availability",
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to update availability"
        );
        setAvailabilityLoading(false);
        return;
      }

      setDoctor(data.doctor);

      alert(
        data.doctor.available
          ? "You are now available for appointments."
          : "You are now unavailable for appointments."
      );

      setAvailabilityLoading(false);
    } catch (error) {
      console.error(
        "Availability error:",
        error
      );

      alert("Could not connect to server.");
      setAvailabilityLoading(false);
    }
  };

  // ==========================================
  // VIEW PATIENT HEALTH RECORDS
  // ==========================================

  const viewHealthRecords = async (patient) => {
    try {
      setSelectedPatient(patient);
      setHealthRecords([]);
      setRecordsError("");
      setRecordsLoading(true);

      const patientId = patient?._id;

      if (!patientId) {
        setRecordsError(
          "Patient information is not available."
        );
        setRecordsLoading(false);
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/health-records/patient/${patientId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setRecordsError(
          data.message ||
            "Unable to load health records."
        );
        setRecordsLoading(false);
        return;
      }

      setHealthRecords(data);
      setRecordsLoading(false);
    } catch (error) {
      console.error(
        "Health records error:",
        error
      );

      setRecordsError(
        "Could not connect to server."
      );

      setRecordsLoading(false);
    }
  };

  // ==========================================
  // CLOSE HEALTH RECORDS
  // ==========================================

  const closeHealthRecords = () => {
    setSelectedPatient(null);
    setHealthRecords([]);
    setRecordsError("");
  };

  // ==========================================
  // OPEN PRESCRIPTION FORM
  // ==========================================

  const openPrescription = (appointment) => {
    setSelectedAppointment(appointment);
    setMedicines("");
    setInstructions("");
  };

  // ==========================================
  // CLOSE PRESCRIPTION FORM
  // ==========================================

  const closePrescription = () => {
    setSelectedAppointment(null);
    setMedicines("");
    setInstructions("");
  };

  // ==========================================
  // SAVE PRESCRIPTION
  // ==========================================

  const savePrescription = async () => {
    try {
      if (!selectedAppointment) {
        alert("Please select an appointment.");
        return;
      }

      const patientId =
        selectedAppointment.patient?._id;

      const appointmentId =
        selectedAppointment._id;

      if (!patientId) {
        alert("Patient information is missing.");
        return;
      }

      if (!medicines.trim()) {
        alert("Please enter at least one medicine.");
        return;
      }

      setPrescriptionLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/prescriptions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            patient: patientId,
            appointment: appointmentId,
            medicines: medicines.trim(),
            instructions:
              instructions.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to save prescription."
        );

        setPrescriptionLoading(false);
        return;
      }

      alert(
        "Prescription added successfully!"
      );

      closePrescription();

      setPrescriptionLoading(false);
    } catch (error) {
      console.error(
        "Prescription error:",
        error
      );

      alert("Could not connect to server.");

      setPrescriptionLoading(false);
    }
  };

  // ==========================================
  // CONFIRM APPOINTMENT
  // ==========================================

  const confirmAppointment = async (
    appointmentId
  ) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/doctors/appointments/${appointmentId}/confirm`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to confirm appointment"
        );
        return;
      }

      alert(
        "Appointment confirmed successfully!"
      );

      loadDashboard();
    } catch (error) {
      console.error(error);

      alert("Could not connect to server.");
    }
  };

  // ==========================================
  // CANCEL APPOINTMENT
  // ==========================================

  const cancelAppointment = async (
    appointmentId
  ) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/doctors/appointments/${appointmentId}/cancel`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to cancel appointment"
        );
        return;
      }

      alert(
        "Appointment cancelled successfully!"
      );

      loadDashboard();
    } catch (error) {
      console.error(error);

      alert("Could not connect to server.");
    }
  };

  // ==========================================
  // LOAD ON PAGE OPEN
  // ==========================================

  useEffect(() => {
    loadDashboard();
  }, []);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
        }}
      >
        <h2>Loading Doctor Dashboard...</h2>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (message) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
        }}
      >
        <h2>{message}</h2>
      </div>
    );
  }

  // ==========================================
  // DASHBOARD
  // ==========================================

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f7fb",
        padding: "30px",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          backgroundColor: "white",
          padding: "25px",
          borderRadius: "12px",
          marginBottom: "25px",
          border: "1px solid #e5e7eb",
        }}
      >
        <h1 style={{ margin: 0 }}>
          Doctor Dashboard 👨‍⚕️
        </h1>

        {doctor && (
          <>
            <h2 style={{ marginBottom: "5px" }}>
              Welcome, {doctor.name}
            </h2>

            <p
              style={{
                color: "#6b7280",
                margin: "5px 0",
              }}
            >
              {doctor.specialization}
            </p>

            <p
              style={{
                color: "#6b7280",
                margin: "5px 0",
              }}
            >
              {doctor.hospital} •{" "}
              {doctor.location}
            </p>
          </>
        )}
      </div>

      {/* DOCTOR OPTIONS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(4, minmax(0, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        {/* AVAILABILITY */}

        <div style={optionCardStyle}>
          <div style={{ fontSize: "35px" }}>
            📅
          </div>

          <h3>My Availability</h3>

          <p
            style={{
              color: doctor?.available
                ? "#15803d"
                : "#b91c1c",
              fontWeight: "bold",
            }}
          >
            {doctor?.available
              ? "Available"
              : "Unavailable"}
          </p>

          <button
            onClick={changeAvailability}
            disabled={availabilityLoading}
            style={primaryButtonStyle}
          >
            {availabilityLoading
              ? "Updating..."
              : doctor?.available
              ? "Set Unavailable"
              : "Set Available"}
          </button>
        </div>

        {/* PRESCRIPTIONS */}

        <div style={optionCardStyle}>
          <div style={{ fontSize: "35px" }}>
            💊
          </div>

          <h3>Prescriptions</h3>

          <p
            style={{
              color: "#6b7280",
            }}
          >
            Write prescriptions for patients.
          </p>

          <p
            style={{
              color: "#2563eb",
              fontWeight: "bold",
            }}
          >
            Use the button in appointments
          </p>
        </div>

        {/* APPOINTMENTS */}

        <div style={optionCardStyle}>
          <div style={{ fontSize: "35px" }}>
            📋
          </div>

          <h3>Appointments</h3>

          <p
            style={{
              color: "#6b7280",
            }}
          >
            Total appointments
          </p>

          <h2>{stats.total}</h2>
        </div>

        {/* HEALTH RECORDS */}

        <div style={optionCardStyle}>
          <div style={{ fontSize: "35px" }}>
            🏥
          </div>

          <h3>Health Records</h3>

          <p
            style={{
              color: "#6b7280",
            }}
          >
            View patient medical records.
          </p>

          <p
            style={{
              color: "#2563eb",
              fontWeight: "bold",
            }}
          >
            Available below
          </p>
        </div>
      </div>

      {/* STATS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(4, minmax(0, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div style={cardStyle}>
          <p>Total Appointments</p>
          <h2>{stats.total}</h2>
        </div>

        <div style={cardStyle}>
          <p>Pending</p>
          <h2>{stats.pending}</h2>
        </div>

        <div style={cardStyle}>
          <p>Confirmed</p>
          <h2>{stats.confirmed}</h2>
        </div>

        <div style={cardStyle}>
          <p>Cancelled</p>
          <h2>{stats.cancelled}</h2>
        </div>
      </div>

      {/* PRESCRIPTION FORM */}

      {selectedAppointment && (
        <div
          style={{
            backgroundColor: "white",
            padding: "25px",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <div>
              <h2>
                💊 Write Prescription
              </h2>

              <p
                style={{
                  color: "#6b7280",
                }}
              >
                Patient:{" "}
                <strong>
                  {selectedAppointment.patient
                    ?.name || "Unknown"}
                </strong>
              </p>

              <p
                style={{
                  color: "#6b7280",
                }}
              >
                Appointment:{" "}
                {selectedAppointment.date}{" "}
                at{" "}
                {selectedAppointment.time}
              </p>
            </div>

            <button
              onClick={closePrescription}
              style={{
                padding: "10px 16px",
                border: "none",
                borderRadius: "8px",
                backgroundColor: "#6b7280",
                color: "white",
                cursor: "pointer",
              }}
            >
              ✕ Close
            </button>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label>
              <strong>
                Medicines *
              </strong>
            </label>

            <textarea
              value={medicines}
              onChange={(e) =>
                setMedicines(e.target.value)
              }
              placeholder={
                "Example:\nParacetamol 500mg - 1 tablet twice daily\nMedicine 2 - dosage..."
              }
              rows="6"
              style={textareaStyle}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label>
              <strong>
                Instructions
              </strong>
            </label>

            <textarea
              value={instructions}
              onChange={(e) =>
                setInstructions(
                  e.target.value
                )
              }
              placeholder="Example: Take medicine after meals..."
              rows="5"
              style={textareaStyle}
            />
          </div>

          <button
            onClick={savePrescription}
            disabled={prescriptionLoading}
            style={{
              padding: "12px 20px",
              border: "none",
              borderRadius: "8px",
              backgroundColor: "#16a34a",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {prescriptionLoading
              ? "Saving..."
              : "💊 Save Prescription"}
          </button>
        </div>
      )}

      {/* HEALTH RECORDS PANEL */}

      {selectedPatient && (
        <div
          style={{
            backgroundColor: "white",
            padding: "25px",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <div>
              <h2>
                Patient Health Records
              </h2>

              <p
                style={{
                  color: "#6b7280",
                  margin: 0,
                }}
              >
                Patient:{" "}
                <strong>
                  {selectedPatient.name ||
                    "Unknown"}
                </strong>
              </p>

              <p
                style={{
                  color: "#6b7280",
                  margin: "5px 0",
                }}
              >
                Email:{" "}
                {selectedPatient.email ||
                  "N/A"}
              </p>
            </div>

            <button
              onClick={closeHealthRecords}
              style={{
                padding: "10px 16px",
                border: "none",
                borderRadius: "8px",
                backgroundColor: "#6b7280",
                color: "white",
                cursor: "pointer",
              }}
            >
              ✕ Close Records
            </button>
          </div>

          {recordsLoading && (
            <p>Loading health records...</p>
          )}

          {recordsError && (
            <div
              style={{
                padding: "12px",
                backgroundColor: "#fee2e2",
                color: "#b91c1c",
                borderRadius: "8px",
              }}
            >
              {recordsError}
            </div>
          )}

          {!recordsLoading &&
            !recordsError &&
            healthRecords.length === 0 && (
              <p
                style={{
                  color: "#6b7280",
                }}
              >
                This patient has no health
                records yet.
              </p>
            )}

          {!recordsLoading &&
            healthRecords.length > 0 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "20px",
                }}
              >
                {healthRecords.map(
                  (record) => (
                    <div
                      key={record._id}
                      style={{
                        padding: "20px",
                        border:
                          "1px solid #e5e7eb",
                        borderRadius: "10px",
                      }}
                    >
                      <h3>
                        {record.title}
                      </h3>

                      <p>
                        <strong>
                          Type:
                        </strong>{" "}
                        {record.type}
                      </p>

                      <p>
                        <strong>
                          Date:
                        </strong>{" "}
                        {record.date}
                      </p>

                      <p>
                        <strong>
                          Doctor:
                        </strong>{" "}
                        {record.doctor ||
                          "Not provided"}
                      </p>

                      <p>
                        <strong>
                          Description:
                        </strong>{" "}
                        {record.description ||
                          "None"}
                      </p>

                      {record.image && (
                        <div
                          style={{
                            marginTop:
                              "15px",
                          }}
                        >
                          <p>
                            <strong>
                              Medical Picture:
                            </strong>
                          </p>

                          <img
                            src={`http://localhost:5000${record.image}`}
                            alt={
                              record.title
                            }
                            style={{
                              width: "100%",
                              maxHeight:
                                "300px",
                              objectFit:
                                "contain",
                              borderRadius:
                                "8px",
                              border:
                                "1px solid #ddd",
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            )}
        </div>
      )}

      {/* APPOINTMENTS */}

      <div
        style={{
          backgroundColor: "white",
          padding: "25px",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
        }}
      >
        <h2>Patient Appointments</h2>

        {appointments.length === 0 ? (
          <p
            style={{
              color: "#6b7280",
            }}
          >
            No appointments yet.
          </p>
        ) : (
          <div
            style={{
              overflowX: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse:
                  "collapse",
              }}
            >
              <thead>
                <tr>
                  <th style={thStyle}>
                    Patient
                  </th>

                  <th style={thStyle}>
                    Email
                  </th>

                  <th style={thStyle}>
                    Date
                  </th>

                  <th style={thStyle}>
                    Time
                  </th>

                  <th style={thStyle}>
                    Reason
                  </th>

                  <th style={thStyle}>
                    Status
                  </th>

                  <th style={thStyle}>
                    Health Records
                  </th>

                  <th style={thStyle}>
                    Prescription
                  </th>

                  <th style={thStyle}>
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {appointments.map(
                  (appointment) => (
                    <tr
                      key={
                        appointment._id
                      }
                    >
                      <td style={tdStyle}>
                        {appointment.patient
                          ?.name ||
                          "Unknown"}
                      </td>

                      <td style={tdStyle}>
                        {appointment.patient
                          ?.email ||
                          "N/A"}
                      </td>

                      <td style={tdStyle}>
                        {appointment.date}
                      </td>

                      <td style={tdStyle}>
                        {appointment.time}
                      </td>

                      <td style={tdStyle}>
                        {appointment.reason ||
                          "—"}
                      </td>

                      <td style={tdStyle}>
                        {appointment.status}
                      </td>

                      <td style={tdStyle}>
                        {appointment.patient
                          ?._id ? (
                          <button
                            onClick={() =>
                              viewHealthRecords(
                                appointment.patient
                              )
                            }
                            style={{
                              padding:
                                "8px 12px",
                              border: "none",
                              borderRadius:
                                "6px",
                              backgroundColor:
                                "#2563eb",
                              color: "white",
                              cursor:
                                "pointer",
                            }}
                          >
                            📋 View Records
                          </button>
                        ) : (
                          "Unavailable"
                        )}
                      </td>

                      <td style={tdStyle}>
                        {appointment.patient
                          ?._id ? (
                          <button
                            onClick={() =>
                              openPrescription(
                                appointment
                              )
                            }
                            style={{
                              padding:
                                "8px 12px",
                              border: "none",
                              borderRadius:
                                "6px",
                              backgroundColor:
                                "#16a34a",
                              color: "white",
                              cursor:
                                "pointer",
                            }}
                          >
                            💊 Prescription
                          </button>
                        ) : (
                          "Unavailable"
                        )}
                      </td>

                      <td style={tdStyle}>
                        {appointment.status ===
                          "pending" && (
                          <div
                            style={{
                              display:
                                "flex",
                              gap: "8px",
                            }}
                          >
                            <button
                              onClick={() =>
                                confirmAppointment(
                                  appointment._id
                                )
                              }
                              style={{
                                padding:
                                  "8px 12px",
                                border:
                                  "none",
                                borderRadius:
                                  "6px",
                                cursor:
                                  "pointer",
                              }}
                            >
                              ✅ Confirm
                            </button>

                            <button
                              onClick={() =>
                                cancelAppointment(
                                  appointment._id
                                )
                              }
                              style={{
                                padding:
                                  "8px 12px",
                                border:
                                  "none",
                                borderRadius:
                                  "6px",
                                cursor:
                                  "pointer",
                              }}
                            >
                              ❌ Reject
                            </button>
                          </div>
                        )}

                        {appointment.status ===
                          "confirmed" && (
                          <span>
                            ✅ Confirmed
                          </span>
                        )}

                        {appointment.status ===
                          "cancelled" && (
                          <span>
                            ❌ Cancelled
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const cardStyle = {
  backgroundColor: "white",
  padding: "25px",
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
};

const optionCardStyle = {
  backgroundColor: "white",
  padding: "22px",
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
};

const primaryButtonStyle = {
  padding: "10px 14px",
  border: "none",
  borderRadius: "7px",
  backgroundColor: "#2563eb",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
};

const textareaStyle = {
  width: "100%",
  marginTop: "8px",
  padding: "12px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  resize: "vertical",
  boxSizing: "border-box",
  fontSize: "14px",
};

const thStyle = {
  textAlign: "left",
  padding: "12px",
  borderBottom: "1px solid #ddd",
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #eee",
};

export default DoctorDashboard;