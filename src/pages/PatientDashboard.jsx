import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import DashboardCard from "../components/DashboardCard";

function PatientDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState({
    appointments: [],
    recordsCount: 0,
    doctorsCount: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      // Appointments
      const appointmentsResponse = await fetch(
        "http://localhost:5000/api/appointments",
        {
          headers,
        }
      );

      // Health Records
      const recordsResponse = await fetch(
        "http://localhost:5000/api/health-records",
        {
          headers,
        }
      );

      // Doctors
      const doctorsResponse = await fetch(
        "http://localhost:5000/api/doctors",
        {
          headers,
        }
      );

      const appointmentsData =
        appointmentsResponse.ok
          ? await appointmentsResponse.json()
          : [];

      const recordsData =
        recordsResponse.ok
          ? await recordsResponse.json()
          : [];

      const doctorsData =
        doctorsResponse.ok
          ? await doctorsResponse.json()
          : [];

      setDashboard({
        appointments: Array.isArray(appointmentsData)
          ? appointmentsData
          : appointmentsData.appointments || [],
        recordsCount: Array.isArray(recordsData)
          ? recordsData.length
          : recordsData.records?.length || 0,
        doctorsCount: Array.isArray(doctorsData)
          ? doctorsData.length
          : doctorsData.doctors?.length || 0,
      });
    } catch (error) {
      console.error("Dashboard error:", error);
      setError("Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const upcomingAppointment =
    dashboard.appointments.length > 0
      ? dashboard.appointments[0]
      : null;

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f5f7fb",
      }}
    >
      <Sidebar />

      <main style={{ flex: 1 }}>
        <Header />

        <div style={{ padding: "30px" }}>
          {/* Welcome */}

          <div style={{ marginBottom: "30px" }}>
            <h1
              style={{
                margin: 0,
                fontSize: "28px",
              }}
            >
              Welcome to your health dashboard 👋
            </h1>

            <p
              style={{
                color: "#6b7280",
                fontSize: "16px",
                marginTop: "8px",
              }}
            >
              What would you like to do today?
            </p>
          </div>

          {/* Error */}

          {error && (
            <div
              style={{
                padding: "15px",
                marginBottom: "20px",
                backgroundColor: "#fee2e2",
                color: "#b91c1c",
                borderRadius: "8px",
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {/* Statistics */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(3, minmax(0, 1fr))",
              gap: "20px",
              marginBottom: "35px",
            }}
          >
            <div
              style={{
                backgroundColor: "#ffffff",
                padding: "22px",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
              }}
            >
              <p style={{ color: "#6b7280", margin: 0 }}>
                Appointments
              </p>

              <h2 style={{ margin: "8px 0 0" }}>
                {loading
                  ? "..."
                  : dashboard.appointments.length}
              </h2>
            </div>

            <div
              style={{
                backgroundColor: "#ffffff",
                padding: "22px",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
              }}
            >
              <p style={{ color: "#6b7280", margin: 0 }}>
                Health Records
              </p>

              <h2 style={{ margin: "8px 0 0" }}>
                {loading
                  ? "..."
                  : dashboard.recordsCount}
              </h2>
            </div>

            <div
              style={{
                backgroundColor: "#ffffff",
                padding: "22px",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
              }}
            >
              <p style={{ color: "#6b7280", margin: 0 }}>
                Available Doctors
              </p>

              <h2 style={{ margin: "8px 0 0" }}>
                {loading
                  ? "..."
                  : dashboard.doctorsCount}
              </h2>
            </div>
          </div>

          {/* Quick Actions */}

          <h2
            style={{
              fontSize: "20px",
              marginBottom: "15px",
            }}
          >
            Quick Actions
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2, minmax(0, 1fr))",
              gap: "20px",
            }}
          >
            <DashboardCard
              title="🤖 AI Medical Assistant"
              description="Ask questions about your symptoms and get helpful health guidance."
              buttonText="Open AI Assistant"
              onClick={() => navigate("/ai-assistant")}
            />

            <DashboardCard
              title="👨‍⚕️ Find a Doctor"
              description="Search for doctors and specialists according to your needs."
              buttonText="Find Doctor"
              onClick={() => navigate("/find-doctor")}
            />

            <DashboardCard
              title="📅 Upcoming Appointment"
              description={
                upcomingAppointment
                  ? `You have an appointment scheduled.`
                  : "You currently have no upcoming appointments."
              }
              buttonText={
                upcomingAppointment
                  ? "View Appointments"
                  : "Book Appointment"
              }
              onClick={() =>
                navigate("/appointments")
              }
            />

            <DashboardCard
              title="📋 Health Records"
              description={
                loading
                  ? "Loading your health records..."
                  : `You have ${dashboard.recordsCount} health record${
                      dashboard.recordsCount === 1
                        ? ""
                        : "s"
                    }.`
              }
              buttonText="View Records"
              onClick={() =>
                navigate("/health-records")
              }
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default PatientDashboard;