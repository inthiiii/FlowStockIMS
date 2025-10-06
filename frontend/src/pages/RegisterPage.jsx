import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const styles = {
    container: {
      display: "flex",
      minHeight: "100vh",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
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
    decorativeCircle1: {
      position: "absolute",
      width: "400px",
      height: "400px",
      borderRadius: "50%",
      background: "rgba(255, 255, 255, 0.1)",
      top: "-100px",
      right: "-100px",
    },
    decorativeCircle2: {
      position: "absolute",
      width: "300px",
      height: "300px",
      borderRadius: "50%",
      background: "rgba(255, 255, 255, 0.05)",
      bottom: "-50px",
      left: "-50px",
    },
    brandContent: { zIndex: 2, textAlign: "center", maxWidth: "500px" },
    logo: { fontSize: "3rem", fontWeight: 700, marginBottom: "20px" },
    tagline: {
      fontSize: "1.2rem",
      fontWeight: 300,
      opacity: 0.9,
      lineHeight: 1.6,
      marginBottom: "30px",
    },
    rightPanel: {
      flex: 1,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "40px",
      backgroundColor: "#f8f9fa",
    },
    formContainer: {
      background: "#ffffff",
      padding: "40px",
      borderRadius: "20px",
      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
      width: "100%",
      maxWidth: "520px",
    },
    formHeader: { textAlign: "center", marginBottom: "24px" },
    title: { color: "#023E8A", fontSize: "2rem", fontWeight: 700, margin: 0 },
    form: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "16px",
    },
    fullRow: {
      gridColumn: "1 / -1",
    },
    label: {
      display: "block",
      fontSize: "0.9rem",
      fontWeight: 600,
      color: "#023E8A",
      marginBottom: "6px",
    },
    input: {
      width: "100%",
      padding: "12px 14px",
      borderRadius: "10px",
      border: "2px solid #e9ecef",
      outline: "none",
      fontSize: "1rem",
      transition: "all 0.2s ease",
      background: "#fff",
      boxSizing: "border-box",
    },
    inputError: {
      borderColor: "#dc3545",
      boxShadow: "0 0 0 3px rgba(220,53,69,0.1)",
    },
    select: {
      width: "100%",
      padding: "12px 14px",
      borderRadius: "10px",
      border: "2px solid #e9ecef",
      outline: "none",
      fontSize: "1rem",
      transition: "all 0.2s ease",
      background: "#fff",
      boxSizing: "border-box",
      appearance: "none",
      WebkitAppearance: "none",
      MozAppearance: "none",
      backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'20\' height=\'20\' viewBox=\'0 0 20 20\'><path fill=\'%236c757d\' d=\'M5.516 7.548l4.484 4.485 4.484-4.485 1.06 1.06-5.544 5.546L4.456 8.608z\'/></svg>")',
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 10px center",
      backgroundSize: "16px 16px",
    },
    errorText: {
      marginTop: "6px",
      color: "#dc3545",
      fontSize: "0.85rem",
    },
    actions: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "12px",
      marginTop: "10px",
    },
    submit: {
      background: "linear-gradient(135deg, #023E8A 0%, #0056b3 100%)",
      color: "#ffffff",
      padding: "14px 18px",
      borderRadius: "10px",
      border: "none",
      cursor: "pointer",
      fontSize: "1rem",
      fontWeight: 600,
      letterSpacing: "0.3px",
    },
    linkButton: {
      background: "none",
      border: "none",
      color: "#023E8A",
      textDecoration: "underline",
      cursor: "pointer",
      fontSize: "0.95rem",
      fontWeight: 600,
    },
    passwordWrap: { position: "relative" },
    toggle: {
      position: "absolute",
      right: "12px",
      top: "50%",
      transform: "translateY(-50%)",
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "#6c757d",
      fontSize: "1.1rem",
    },
    // Modal styles
    modalOverlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.45)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    },
    modalContent: {
      width: "90%",
      maxWidth: "440px",
      background: "#ffffff",
      borderRadius: "16px",
      boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
      overflow: "hidden",
      textAlign: "center",
    },
    modalHeader: {
      background: "linear-gradient(135deg, #023E8A 0%, #0056b3 100%)",
      color: "#fff",
      padding: "18px 20px",
      fontWeight: 700,
      fontSize: "1.1rem",
    },
    modalBody: { padding: "22px" },
    modalIcon: { fontSize: "42px", marginBottom: "10px" },
    modalMessage: { color: "#0056b3", fontSize: "1rem", marginTop: "8px" },
    hintText: { marginTop: "6px", color: "#6c757d", fontSize: "0.85rem" },
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    // Phone number: must be exactly 10 digits
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?]).{1,6}$/.test(formData.password)) {
      newErrors.password = "Max 6 chars with 1 uppercase, 1 number, 1 special";
    }

    if (!formData.role) {
      newErrors.role = "Role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
      setFormData({ ...formData, [name]: digitsOnly });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: undefined });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    // Simulate API call then show success and navigate to login
    setTimeout(() => {
      setSubmitting(false);
      setSuccessMessage(
        `Registration successful! A welcome email has been sent to ${formData.email}.`
      );
      setTimeout(() => navigate("/login"), 1400);
    }, 1200);
  };

  return (
    <div style={styles.container}>
      {/* Left Panel - Branding */}
      <div style={styles.leftPanel}>
        <div style={styles.decorativeCircle1}></div>
        <div style={styles.decorativeCircle2}></div>
        <div style={styles.brandContent}>
          <h1 style={styles.logo}>Nation Motor Spares</h1>
          <p style={styles.tagline}>Create your account to access your admin dashboard</p>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div style={styles.rightPanel}>
        <div style={styles.formContainer}>
          <div style={styles.formHeader}>
            <h2 style={styles.title}>Create your account</h2>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
          <div>
            <label style={styles.label}>First Name</label>
            <input
              name="firstName"
              type="text"
              placeholder="Jane"
              value={formData.firstName}
              onChange={handleChange}
              style={{
                ...styles.input,
                ...(errors.firstName && styles.inputError),
              }}
            />
            {errors.firstName && <div style={styles.errorText}>{errors.firstName}</div>}
          </div>

          <div>
            <label style={styles.label}>Last Name</label>
            <input
              name="lastName"
              type="text"
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleChange}
              style={{
                ...styles.input,
                ...(errors.lastName && styles.inputError),
              }}
            />
            {errors.lastName && <div style={styles.errorText}>{errors.lastName}</div>}
          </div>

          <div style={styles.fullRow}>
            <label style={styles.label}>Phone Number</label>
            <input
              name="phone"
              type="tel"
              placeholder="10-digit phone number"
              value={formData.phone}
              onChange={handleChange}
              inputMode="numeric"
              maxLength={10}
              style={{
                ...styles.input,
                ...(errors.phone && styles.inputError),
              }}
            />
            {errors.phone && <div style={styles.errorText}>{errors.phone}</div>}
          </div>

          <div style={styles.fullRow}>
            <label style={styles.label}>Email</label>
            <input
              name="email"
              type="email"
              placeholder="jane.doe@example.com"
              value={formData.email}
              onChange={handleChange}
              style={{
                ...styles.input,
                ...(errors.email && styles.inputError),
              }}
            />
            {errors.email && <div style={styles.errorText}>{errors.email}</div>}
          </div>

          <div style={styles.fullRow}>
            <label style={styles.label}>Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{
                ...styles.select,
                ...(errors.role && styles.inputError),
              }}
            >
              <option value="">Select a role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="sales_manager">Sales Manager</option>
              <option value="delivery_manager">Delivery Manager</option>
              <option value="shipment_manager">Shipment Manager</option>
            </select>
            {errors.role && <div style={styles.errorText}>{errors.role}</div>}
          </div>

          <div style={{ ...styles.fullRow, ...styles.passwordWrap }}>
            <label style={styles.label}>Password</label>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              style={{
                ...styles.input,
                ...(errors.password && styles.inputError),
                paddingRight: "42px",
              }}
              maxLength={6}
            />
            <button
              type="button"
              style={styles.toggle}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
            {!errors.password && (
              <div style={styles.hintText}>
                Max 6 characters with at least 1 uppercase, 1 number, and 1 special character.
              </div>
            )}
            {errors.password && <div style={styles.errorText}>{errors.password}</div>}
          </div>

          <div className="actions" style={{ ...styles.fullRow, ...styles.actions }}>
            <button type="submit" style={styles.submit} disabled={submitting}>
              {submitting ? "Creating account..." : "Create Account"}
            </button>
            <button
              type="button"
              style={styles.linkButton}
              onClick={() => navigate("/login")}
            >
              Back to Login
            </button>
          </div>
          </form>
        </div>
      </div>

      {successMessage && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>Registration Successful</div>
            <div style={styles.modalBody}>
              <div style={styles.modalIcon}>🎉</div>
              <div style={styles.modalMessage}>{successMessage}</div>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          @media (max-width: 968px) {
            .left-panel { display: none; }
          }
        `}
      </style>
    </div>
  );
};

export default RegisterPage;


