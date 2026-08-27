import { useEffect, useState } from "react";

function Profile() {
  const [profile, setProfile] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // GET PROFILE
  const fetchProfile = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load profile"
        );
      }

      setProfile(data);
      setName(data.name || "");
      setEmail(data.email || "");
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile();
    } else {
      setError("Please login first.");
      setLoading(false);
    }
  }, [token]);

  // UPDATE PROFILE
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setSaving(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update profile"
        );
      }

      setMessage("Profile updated successfully! ✅");

      setProfile(data.user);

      // Update localStorage user if it exists
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "30px" }}>
        <h2>Loading profile...</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "30px",
        backgroundColor: "#f5f7fa",
        minHeight: "100vh",
      }}
    >
      <h1>My Profile 👤</h1>

      <p style={{ color: "#666" }}>
        View and update your profile information.
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

      {profile && (
        <div
          style={{
            backgroundColor: "white",
            padding: "30px",
            marginTop: "25px",
            maxWidth: "600px",
            borderRadius: "12px",
            border: "1px solid #ddd",
          }}
        >
          <form onSubmit={handleSubmit}>
            <label>
              <strong>Name</strong>
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              style={inputStyle}
              required
            />

            <label>
              <strong>Email</strong>
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              style={inputStyle}
              required
            />

            <label>
              <strong>Role</strong>
            </label>

            <input
              type="text"
              value={profile.role}
              disabled
              style={inputStyle}
            />

            <button
              type="submit"
              disabled={saving}
              style={{
                width: "100%",
                padding: "12px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </form>
        </div>
      )}
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

export default Profile;