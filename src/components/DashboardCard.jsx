function DashboardCard({ title, description, buttonText, onClick }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "20px",
        backgroundColor: "#fff",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
      }}
    >
      <h2>{title}</h2>

      <p>{description}</p>

      <button onClick={onClick}>
        {buttonText}
      </button>
    </div>
  );
}

export default DashboardCard;