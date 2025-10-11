import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const styles = {
    container: { display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" },
    leftPanel: {
      flex: 1,
      background: "linear-gradient(135deg, #023E8A 0%, #0056b3 100%)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "60px",
      color: "#ffffff",
      position: "relative",
      overflow: "hidden",
    },
    decorativeCircle1: { position: "absolute", width: "400px", height: "400px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", top: "-100px", right: "-100px" },
    decorativeCircle2: { position: "absolute", width: "300px", height: "300px", borderRadius: "50%", background: "rgba(255,255,255,0.05)", bottom: "-50px", left: "-50px" },
    brandContent: { zIndex: 2, textAlign: "center", maxWidth: "500px" },
    logo: { fontSize: "3rem", fontWeight: 700, marginBottom: "20px" },
    tagline: { fontSize: "1.2rem", fontWeight: 300, opacity: 0.9, lineHeight: 1.6, marginBottom: "30px" },

    rightPanel: { flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "40px", backgroundColor: "#f8f9fa" },
    formContainer: { background: "#ffffff", padding: "40px", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.1)", width: "100%", maxWidth: "520px" },
    formHeader: { textAlign: "center", marginBottom: "24px" },
    title: { color: "#023E8A", fontSize: "2rem", fontWeight: 700, margin: 0 },
    label: { display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#023E8A", marginBottom: "6px" },
    input: { width: "100%", padding: "12px 14px", borderRadius: "10px", border: "2px solid #e9ecef", outline: "none", fontSize: "1rem", background: "#fff" },
    inputError: { borderColor: "#dc3545", boxShadow: "0 0 0 3px rgba(220,53,69,0.1)" },
    errorText: { marginTop: "6px", color: "#dc3545", fontSize: "0.85rem" },
    actions: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", marginTop: "16px" },
    submit: { background: "linear-gradient(135deg, #023E8A 0%, #0056b3 100%)", color: "#ffffff", padding: "14px 18px", borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "1rem", fontWeight: 600 },
    linkButton: { background: "none", border: "none", color: "#023E8A", textDecoration: "underline", cursor: "pointer", fontSize: "0.95rem", fontWeight: 600 },
    // Modal styles
    modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
    modalContent: { width: "90%", maxWidth: "440px", background: "#ffffff", borderRadius: "16px", boxShadow: "0 20px 50px rgba(0,0,0,0.2)", overflow: "hidden", textAlign: "center" },
    modalHeader: { background: "linear-gradient(135deg, #023E8A 0%, #0056b3 100%)", color: "#fff", padding: "18px 20px", fontWeight: 700, fontSize: "1.1rem" },
    modalBody: { padding: "22px" },
    modalIcon: { fontSize: "42px", marginBottom: "10px" },
    modalMessage: { color: "#0056b3", fontSize: "1rem", marginTop: "8px" },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const { message } = await authService.forgotPassword({ email });
      const finalMessage = message || `If an account exists for ${email}, a reset link has been sent.`;
      const el = document.getElementById("fp-success-msg");
      if (el) el.textContent = finalMessage;
      setSuccessMessage(finalMessage);
      setTimeout(() => navigate("/login"), 1400);
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Left Panel - Branding */}
      <div style={styles.leftPanel}>
        <div style={styles.decorativeCircle1}></div>
        <div style={styles.decorativeCircle2}></div>
        <div style={styles.brandContent}>
          <h1 style={styles.logo}>Nation Motor Spares</h1>
          <p style={styles.tagline}>Reset your password to get back in</p>
        </div>
      </div>

      {/* Right Panel - Forgot Form */}
      <div style={styles.rightPanel}>
        <div style={styles.formContainer}>
          <div style={styles.formHeader}>
            <h2 style={styles.title}>Forgot Password</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ ...styles.input, ...(error && styles.inputError) }}
            />
            {error && <div style={styles.errorText}>{error}</div>}

            <div style={styles.actions}>
              <button type="submit" style={styles.submit} disabled={submitting}>
                {submitting ? "Sending..." : "Send Reset Link"}
              </button>
              <button type="button" style={styles.linkButton} onClick={() => navigate("/login")}>
                Back to Login
              </button>
            </div>
          </form>
        </div>
      </div>

      {successMessage && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>Check your email</div>
            <div style={styles.modalBody}>
              <div style={styles.modalIcon}>✉️</div>
              <div id="fp-success-msg" style={styles.modalMessage}>{successMessage}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;


