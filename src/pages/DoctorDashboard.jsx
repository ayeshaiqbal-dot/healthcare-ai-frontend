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

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  // ==========================================
  // LOAD DASHBOARD
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
      setAppointments(data.appointments);

      setLoading(false);

    } catch (error) {
      console.error(
        "Dashboard error:",
        error
      );

      setMessage(
        "Could not connect to server."
      );

      setLoading(false);
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

      alert(
        "Could not connect to server."
      );
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

      alert(
        "Could not connect to server."
      );
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
        <h1
          style={{
            margin: 0,
          }}
        >
          Doctor Dashboard 👨‍⚕️
        </h1>

        {doctor && (
          <>
            <h2
              style={{
                marginBottom: "5px",
              }}
            >
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

        <div
          style={{
            backgroundColor: "white",
            padding: "25px",
            borderRadius: "12px",
            border:
              "1px solid #e5e7eb",
          }}
        >
          <p>Total Appointments</p>

          <h2>{stats.total}</h2>
        </div>


        <div
          style={{
            backgroundColor: "white",
            padding: "25px",
            borderRadius: "12px",
            border:
              "1px solid #e5e7eb",
          }}
        >
          <p>Pending</p>

          <h2>{stats.pending}</h2>
        </div>


        <div
          style={{
            backgroundColor: "white",
            padding: "25px",
            borderRadius: "12px",
            border:
              "1px solid #e5e7eb",
          }}
        >
          <p>Confirmed</p>

          <h2>{stats.confirmed}</h2>
        </div>


        <div
          style={{
            backgroundColor: "white",
            padding: "25px",
            borderRadius: "12px",
            border:
              "1px solid #e5e7eb",
          }}
        >
          <p>Cancelled</p>

          <h2>{stats.cancelled}</h2>
        </div>

      </div>


      {/* APPOINTMENTS */}

      <div
        style={{
          backgroundColor: "white",
          padding: "25px",
          borderRadius: "12px",
          border:
            "1px solid #e5e7eb",
        }}
      >

        <h2>
          Patient Appointments
        </h2>

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
                  <th
                    style={{
                      textAlign: "left",
                      padding: "12px",
                      borderBottom:
                        "1px solid #ddd",
                    }}
                  >
                    Patient
                  </th>

                  <th
                    style={{
                      textAlign: "left",
                      padding: "12px",
                      borderBottom:
                        "1px solid #ddd",
                    }}
                  >
                    Email
                  </th>

                  <th
                    style={{
                      textAlign: "left",
                      padding: "12px",
                      borderBottom:
                        "1px solid #ddd",
                    }}
                  >
                    Date
                  </th>

                  <th
                    style={{
                      textAlign: "left",
                      padding: "12px",
                      borderBottom:
                        "1px solid #ddd",
                    }}
                  >
                    Time
                  </th>

                  <th
                    style={{
                      textAlign: "left",
                      padding: "12px",
                      borderBottom:
                        "1px solid #ddd",
                    }}
                  >
                    Reason
                  </th>

                  <th
                    style={{
                      textAlign: "left",
                      padding: "12px",
                      borderBottom:
                        "1px solid #ddd",
                    }}
                  >
                    Status
                  </th>

                  <th
                    style={{
                      textAlign: "left",
                      padding: "12px",
                      borderBottom:
                        "1px solid #ddd",
                    }}
                  >
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

                      <td
                        style={{
                          padding: "12px",
                          borderBottom:
                            "1px solid #eee",
                        }}
                      >
                        {appointment.patient
                          ?.name ||
                          "Unknown"}
                      </td>


                      <td
                        style={{
                          padding: "12px",
                          borderBottom:
                            "1px solid #eee",
                        }}
                      >
                        {appointment.patient
                          ?.email ||
                          "N/A"}
                      </td>


                      <td
                        style={{
                          padding: "12px",
                          borderBottom:
                            "1px solid #eee",
                        }}
                      >
                        {appointment.date}
                      </td>


                      <td
                        style={{
                          padding: "12px",
                          borderBottom:
                            "1px solid #eee",
                        }}
                      >
                        {appointment.time}
                      </td>


                      <td
                        style={{
                          padding: "12px",
                          borderBottom:
                            "1px solid #eee",
                        }}
                      >
                        {appointment.reason ||
                          "—"}
                      </td>


                      <td
                        style={{
                          padding: "12px",
                          borderBottom:
                            "1px solid #eee",
                        }}
                      >
                        {appointment.status}
                      </td>


                      <td
                        style={{
                          padding: "12px",
                          borderBottom:
                            "1px solid #eee",
                        }}
                      >

                        {appointment.status ===
                          "pending" && (
                          <div
                            style={{
                              display: "flex",
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

export default DoctorDashboard;