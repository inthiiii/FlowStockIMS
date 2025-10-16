import React, { useEffect, useState } from "react";
import { authService } from "../services/authService";

const ChangeCredentials = () => {
  const [form, setForm] = useState({
    id: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    currentPassword: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [focused, setFocused] = useState(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const me = await authService.me();
        if (!isMounted) return;
        setForm((prev) => ({
          ...prev,
          id: me._id,
          firstName: me.firstName || "",
          lastName: me.lastName || "",
          phone: me.phone || "",
          email: me.email || "",
        }));
      } catch (e) {
        // ignore; user may not be logged in
      }
    })();
    return () => { isMounted = false; };
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      // For now, require user id to be typed or prefilled from storage if available
      const payload = { ...form };
      if (!payload.id) {
        setError("User ID is required");
        return;
      }
      const res = await authService.changeCredentials(payload);
      setSuccess("Credentials updated successfully");
      // Optionally refresh local user info here
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: "900px",
      margin: "0 auto",
      padding: "50px 30px",
      background: "linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%)",
      minHeight: "100vh",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
    header: {
      textAlign: "center",
      marginBottom: "40px",
      animation: "fadeInDown 0.6s ease-out",
    },
    title: {
      color: "#023E8A",
      fontSize: "3rem",
      fontWeight: "700",
      margin: "0 0 12px 0",
      letterSpacing: "-1px",
      textShadow: "0 2px 4px rgba(2, 62, 138, 0.1)",
    },
    subtitle: {
      color: "#64748b",
      fontSize: "1.05rem",
      margin: 0,
      fontWeight: 400,
    },
    formContainer: {
      background: "#ffffff",
      padding: "40px 50px",
      borderRadius: "20px",
      border: "1px solid rgba(226, 232, 240, 0.8)",
      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
      animation: "fadeInUp 0.7s ease-out",
    },
    form: {
      display: "grid",
      gap: "24px",
    },
    row2: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "24px",
    },
    group: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    label: {
      fontSize: "0.9rem",
      fontWeight: 600,
      color: "#1e293b",
      letterSpacing: "0.3px",
    },
    input: {
      padding: "14px 18px",
      border: "2px solid #e2e8f0",
      borderRadius: "10px",
      fontSize: "1rem",
      backgroundColor: "#f8fafc",
      outline: "none",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    },
    inputFocus: {
      borderColor: "#023E8A",
      backgroundColor: "#ffffff",
      boxShadow: "0 0 0 3px rgba(2, 62, 138, 0.1)",
    },
    message: {
      padding: "14px 16px",
      borderRadius: "10px",
      border: "1px solid transparent",
      fontSize: "0.95rem",
      fontWeight: 500,
      textAlign: "center",
    },
    error: {
      backgroundColor: "rgba(239, 68, 68, 0.1)",
      color: "#b91c1c",
      borderColor: "rgba(239, 68, 68, 0.2)",
    },
    success: {
      backgroundColor: "rgba(34, 197, 94, 0.1)",
      color: "#15803d",
      borderColor: "rgba(34, 197, 94, 0.2)",
    },
    button: {
      background: "linear-gradient(135deg, #023E8A 0%, #0353b8 100%)",
      color: "#ffffff",
      padding: "14px 24px",
      borderRadius: "12px",
      border: "none",
      cursor: "pointer",
      fontSize: "1rem",
      fontWeight: 700,
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      justifySelf: "start",
    },
    buttonDisabled: {
      background: "#94a3b8",
      cursor: "not-allowed",
    },
  };

  const styleSheet = `
    @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `;

  return (
    <div style={styles.container}>
      <style>{styleSheet}</style>
      <header style={styles.header}>
        <h1 style={styles.title}>Change Credentials</h1>
        <p style={styles.subtitle}>Update your profile information and password</p>
      </header>
      <div style={styles.formContainer}>
        {error && <div style={{ ...styles.message, ...styles.error }}>{error}</div>}
        {success && <div style={{ ...styles.message, ...styles.success }}>{success}</div>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.group}>
            <label style={styles.label}>User ID</label>
            <input
              name="id"
              value={form.id}
              onChange={handleChange}
              onFocus={() => setFocused('id')}
              onBlur={() => setFocused(null)}
              style={{ ...styles.input, ...(focused === 'id' && styles.inputFocus) }}
              placeholder="Enter your user id"
              required
            />
          </div>

          <div style={styles.row2}>
            <div style={styles.group}>
              <label style={styles.label}>First Name</label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                onFocus={() => setFocused('firstName')}
                onBlur={() => setFocused(null)}
                style={{ ...styles.input, ...(focused === 'firstName' && styles.inputFocus) }}
                placeholder="First name"
              />
            </div>
            <div style={styles.group}>
              <label style={styles.label}>Last Name</label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                onFocus={() => setFocused('lastName')}
                onBlur={() => setFocused(null)}
                style={{ ...styles.input, ...(focused === 'lastName' && styles.inputFocus) }}
                placeholder="Last name"
              />
            </div>
          </div>

          <div style={styles.row2}>
            <div style={styles.group}>
              <label style={styles.label}>Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                onFocus={() => setFocused('phone')}
                onBlur={() => setFocused(null)}
                style={{ ...styles.input, ...(focused === 'phone' && styles.inputFocus) }}
                placeholder="Phone number"
              />
            </div>
            <div style={styles.group}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
                style={{ ...styles.input, ...(focused === 'email' && styles.inputFocus) }}
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div style={styles.row2}>
            <div style={styles.group}>
              <label style={styles.label}>Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={form.currentPassword}
                onChange={handleChange}
                onFocus={() => setFocused('currentPassword')}
                onBlur={() => setFocused(null)}
                style={{ ...styles.input, ...(focused === 'currentPassword' && styles.inputFocus) }}
                placeholder="Enter current password"
              />
            </div>
            <div style={styles.group}>
              <label style={styles.label}>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                onFocus={() => setFocused('newPassword')}
                onBlur={() => setFocused(null)}
                style={{ ...styles.input, ...(focused === 'newPassword' && styles.inputFocus) }}
                placeholder="6 chars, 1 uppercase, 1 number, 1 special"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} style={{ ...styles.button, ...(loading && styles.buttonDisabled) }}>
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangeCredentials;


