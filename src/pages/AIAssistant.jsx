import { useState } from "react";

function AIAssistant() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const suggestedQuestions = [
    "What are common causes of headache?",
    "What are some healthy sleep habits?",
    "How can I stay hydrated?",
    "What are some general healthy eating habits?",
  ];

  const getTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const sendMessage = async (text = question) => {
    const userMessage = text.trim();

    if (!userMessage || loading) return;

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        content: userMessage,
        time: getTime(),
      },
    ]);

    setQuestion("");
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login again to use the AI Assistant.");
      }

      const response = await fetch(
        "http://localhost:5000/api/ai/ask",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message: userMessage,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to get AI response."
        );
      }

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: data.reply,
          time: getTime(),
        },
      ]);
    } catch (error) {
      console.error("AI error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const clearChat = () => {
    setMessages([]);
    setError("");
    setQuestion("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f7fb",
        padding: "30px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "950px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1
              style={{
                marginBottom: "8px",
                color: "#111827",
              }}
            >
              AI Medical Assistant 🤖
            </h1>

            <p
              style={{
                margin: 0,
                color: "#6b7280",
              }}
            >
              Ask general health questions and get AI-powered
              health information.
            </p>
          </div>

          {messages.length > 0 && (
            <button
              onClick={clearChat}
              style={{
                padding: "10px 18px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                backgroundColor: "#ffffff",
                cursor: "pointer",
              }}
            >
              🧹 Clear Chat
            </button>
          )}
        </div>

        {/* CHAT BOX */}

        <div
          style={{
            marginTop: "30px",
            backgroundColor: "#ffffff",
            borderRadius: "14px",
            border: "1px solid #e5e7eb",
            padding: "25px",
            minHeight: "350px",
            maxHeight: "500px",
            overflowY: "auto",
          }}
        >
          {messages.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
              }}
            >
              <div style={{ fontSize: "50px" }}>🤖</div>

              <h2>How can I help you?</h2>

              <p style={{ color: "#6b7280" }}>
                Choose a question below or type your own.
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent:
                    message.role === "user"
                      ? "flex-end"
                      : "flex-start",
                  marginBottom: "18px",
                }}
              >
                <div
                  style={{
                    maxWidth: "75%",
                    padding: "14px 16px",
                    borderRadius: "14px",
                    backgroundColor:
                      message.role === "user"
                        ? "#2563eb"
                        : "#f3f4f6",
                    color:
                      message.role === "user"
                        ? "#ffffff"
                        : "#111827",
                  }}
                >
                  <strong>
                    {message.role === "user"
                      ? "You"
                      : "🤖 AI Assistant"}
                  </strong>

                  <p
                    style={{
                      margin: "8px 0",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {message.content}
                  </p>

                  <small
                    style={{
                      opacity: 0.7,
                    }}
                  >
                    {message.time}
                  </small>
                </div>
              </div>
            ))
          )}

          {loading && (
            <div
              style={{
                padding: "14px 16px",
                backgroundColor: "#f3f4f6",
                borderRadius: "14px",
                width: "fit-content",
              }}
            >
              🤖 AI Assistant is thinking...
            </div>
          )}
        </div>

        {/* SUGGESTED QUESTIONS */}

        {messages.length === 0 && (
          <div style={{ marginTop: "20px" }}>
            <h3>💡 Suggested Questions</h3>

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              {suggestedQuestions.map((item, index) => (
                <button
                  key={index}
                  onClick={() => sendMessage(item)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: "20px",
                    border: "1px solid #d1d5db",
                    backgroundColor: "#ffffff",
                    cursor: "pointer",
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* INPUT */}

        <form
          onSubmit={handleSubmit}
          style={{
            marginTop: "25px",
          }}
        >
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Describe your symptoms or ask a general health question..."
            rows="4"
            disabled={loading}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "15px",
              borderRadius: "10px",
              border: "1px solid #d1d5db",
              fontSize: "16px",
              resize: "vertical",
              backgroundColor: "#ffffff",
            }}
          />

          <button
            type="submit"
            disabled={loading || !question.trim()}
            style={{
              marginTop: "12px",
              padding: "12px 24px",
              border: "none",
              borderRadius: "8px",
              backgroundColor:
                loading || !question.trim()
                  ? "#9ca3af"
                  : "#2563eb",
              color: "#ffffff",
              cursor:
                loading || !question.trim()
                  ? "not-allowed"
                  : "pointer",
              fontWeight: "bold",
            }}
          >
            {loading ? "Getting Guidance..." : "Send Message"}
          </button>
        </form>

        {/* ERROR */}

        {error && (
          <div
            style={{
              marginTop: "15px",
              padding: "12px",
              borderRadius: "8px",
              backgroundColor: "#fee2e2",
              color: "#b91c1c",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* MEDICAL DISCLAIMER */}

        <div
          style={{
            marginTop: "25px",
            padding: "18px",
            borderRadius: "10px",
            backgroundColor: "#fff7ed",
            border: "1px solid #fed7aa",
          }}
        >
          <strong>🩺 Important Medical Notice</strong>

          <p
            style={{
              marginBottom: 0,
              color: "#7c2d12",
            }}
          >
            This AI assistant provides general health information
            and does not replace a qualified healthcare professional.
            It should not be used for diagnosis or emergency
            treatment. If you have severe or emergency symptoms,
            seek professional medical care immediately.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AIAssistant;