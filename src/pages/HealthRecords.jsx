import { useEffect, useState } from "react";

function HealthRecords() {
  const [records, setRecords] = useState([]);

  const [title, setTitle] = useState("");
  const [type, setType] = useState("Medical Report");
  const [description, setDescription] = useState("");
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // GET RECORDS
  const fetchRecords = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/health-records/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load records"
        );
      }

      setRecords(data);
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      fetchRecords();
    }
  }, [token]);

  // CREATE RECORD
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/health-records",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            type,
            description,
            doctor,
            date,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create record"
        );
      }

      setMessage("Health record added successfully! ✅");

      setTitle("");
      setType("Medical Report");
      setDescription("");
      setDoctor("");
      setDate("");

      await fetchRecords();
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // DELETE RECORD
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this record?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/health-records/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete record"
        );
      }

      setMessage("Health record deleted successfully.");

      await fetchRecords();
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
      <h1>Health Records 📋</h1>

      <p style={{ color: "#666" }}>
        Add and manage your medical records.
      </p>

      {message && (
        <div
          style={{
            padding: "12px",
            marginTop: "20px",
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
            backgroundColor: "#fee2e2",
            color: "#b91c1c",
            borderRadius: "8px",
          }}
        >
          {error}
        </div>
      )}

      {/* ADD RECORD */}

      <div
        style={{
          backgroundColor: "white",
          padding: "25px",
          borderRadius: "12px",
          marginTop: "25px",
          maxWidth: "650px",
          border: "1px solid #ddd",
        }}
      >
        <h2>Add Health Record</h2>

        <form onSubmit={handleSubmit}>
          <label>Record Title</label>

          <input
            type="text"
            placeholder="e.g. Blood Test Report"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={inputStyle}
          />

          <label>Record Type</label>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={inputStyle}
          >
            <option>Prescription</option>
            <option>Lab Report</option>
            <option>Medical Report</option>
            <option>Vaccination</option>
            <option>Other</option>
          </select>

          <label>Description</label>

          <textarea
            placeholder="Enter details..."
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            rows="4"
            style={inputStyle}
          />

          <label>Doctor</label>

          <input
            type="text"
            placeholder="Doctor name"
            value={doctor}
            onChange={(e) => setDoctor(e.target.value)}
            style={inputStyle}
          />

          <label>Date</label>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            style={inputStyle}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "15px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {loading ? "Adding..." : "Add Record"}
          </button>
        </form>
      </div>

      {/* RECORDS */}

      <div style={{ marginTop: "40px" }}>
        <h2>My Health Records</h2>

        {records.length === 0 ? (
          <p>No health records yet.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            {records.map((record) => (
              <div
                key={record._id}
                style={{
                  backgroundColor: "white",
                  padding: "20px",
                  borderRadius: "12px",
                  border: "1px solid #ddd",
                }}
              >
                <h3>{record.title}</h3>

                <p>
                  <strong>Type:</strong> {record.type}
                </p>

                <p>
                  <strong>Date:</strong> {record.date}
                </p>

                <p>
                  <strong>Doctor:</strong>{" "}
                  {record.doctor || "Not provided"}
                </p>

                <p>
                  <strong>Description:</strong>{" "}
                  {record.description || "None"}
                </p>

                <button
                  onClick={() =>
                    handleDelete(record._id)
                  }
                  style={{
                    padding: "10px 15px",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "12px",
  marginTop: "8px",
  marginBottom: "18px",
  boxSizing: "border-box",
  border: "1px solid #ccc",
  borderRadius: "8px",
};

export default HealthRecords;