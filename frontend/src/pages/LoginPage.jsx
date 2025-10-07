import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Backend expects email, map username -> email
      await authService.login({ email: formData.username, password: formData.password });
      navigate("/dashboard");
    } catch (e) {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = () => {
    navigate("/register");
  };

  const styles = {
    container: {
      display: "flex",
      minHeight: "100vh",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    leftPanel: {
      flex: "1",
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
    brandContent: {
      zIndex: 2,
      textAlign: "center",
      maxWidth: "500px",
    },
    logo: {
      fontSize: "3rem",
      fontWeight: "700",
      marginBottom: "20px",
      textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
    },
    tagline: {
      fontSize: "1.3rem",
      fontWeight: "300",
      opacity: "0.9",
      lineHeight: "1.6",
      marginBottom: "40px",
    },
    features: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      marginTop: "40px",
    },
    featureItem: {
      display: "flex",
      alignItems: "center",
      gap: "15px",
      fontSize: "1.1rem",
    },
    featureIcon: {
      fontSize: "1.5rem",
    },
    rightPanel: {
      flex: "1",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "40px",
      backgroundColor: "#f8f9fa",
    },
    formContainer: {
      background: "#ffffff",
      padding: "50px",
      borderRadius: "20px",
      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
      width: "100%",
      maxWidth: "450px",
    },
    formHeader: {
      textAlign: "center",
      marginBottom: "40px",
    },
    title: {
      color: "#023E8A",
      fontSize: "2.2rem",
      fontWeight: "700",
      marginBottom: "10px",
    },
    subtitle: {
      color: "#6c757d",
      fontSize: "1rem",
      fontWeight: "400",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "25px",
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    label: {
      color: "#023E8A",
      fontSize: "0.9rem",
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    inputWrapper: {
      position: "relative",
    },
    input: {
      width: "100%",
      padding: "15px 45px 15px 15px",
      borderRadius: "10px",
      border: "2px solid #e9ecef",
      outline: "none",
      fontSize: "1rem",
      transition: "all 0.3s ease",
      backgroundColor: "#ffffff",
      boxSizing: "border-box",
    },
    inputFocused: {
      borderColor: "#023E8A",
      boxShadow: "0 0 0 3px rgba(2, 62, 138, 0.1)",
    },
    inputIcon: {
      position: "absolute",
      right: "15px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#6c757d",
      fontSize: "1.2rem",
    },
    passwordToggle: {
      position: "absolute",
      right: "15px",
      top: "50%",
      transform: "translateY(-50%)",
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: "1.2rem",
      color: "#6c757d",
      transition: "color 0.3s ease",
    },
    passwordToggleHover: {
      color: "#023E8A",
    },
    rememberForgot: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: "0.9rem",
    },
    checkbox: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      color: "#495057",
    },
    forgotLink: {
      color: "#023E8A",
      textDecoration: "none",
      fontWeight: "500",
      transition: "color 0.3s ease",
    },
    forgotLinkHover: {
      color: "#012a5c",
      textDecoration: "underline",
    },
    button: {
      background: "linear-gradient(135deg, #023E8A 0%, #0056b3 100%)",
      color: "#ffffff",
      padding: "16px",
      borderRadius: "10px",
      border: "none",
      cursor: "pointer",
      fontSize: "1.1rem",
      fontWeight: "600",
      transition: "all 0.3s ease",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      position: "relative",
      overflow: "hidden",
    },
    buttonHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 6px 20px rgba(2, 62, 138, 0.4)",
    },
    buttonDisabled: {
      background: "#6c757d",
      cursor: "not-allowed",
      transform: "none",
    },
    signupContainer: {
      marginTop: "16px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "8px",
      color: "#6c757d",
      fontSize: "0.95rem",
    },
    signupButton: {
      background: "none",
      border: "none",
      color: "#023E8A",
      fontWeight: "600",
      cursor: "pointer",
      padding: 0,
      textDecoration: "underline",
    },
    spinner: {
      display: "inline-block",
      width: "20px",
      height: "20px",
      border: "2px solid #ffffff",
      borderTop: "2px solid transparent",
      borderRadius: "50%",
      animation: "spin 0.8s linear infinite",
      marginRight: "10px",
    },
    footer: {
      textAlign: "center",
      marginTop: "30px",
      color: "#6c757d",
      fontSize: "0.9rem",
    },
    '@media (max-width: 968px)': {
      leftPanel: {
        display: "none",
      },
    },
  };

  return (
    <div style={styles.container}>
      {/* Left Panel - Branding */}
      <div style={styles.leftPanel}>
        <div style={styles.decorativeCircle1}></div>
        <div style={styles.decorativeCircle2}></div>
        
        <div style={styles.brandContent}>
          <h1 style={styles.logo}>Nation Motor Spares</h1>
          <p style={styles.tagline}>
            Your trusted motorcycle spare parts supplier in <br></br>Sri Lanka
          </p>
          
          <div style={styles.features}>
            <div style={styles.featureItem}>
              <span style={styles.featureIcon}>✓</span>
              <span>Comprehensive Inventory Management</span>
            </div>
            <div style={styles.featureItem}>
              <span style={styles.featureIcon}>✓</span>
              <span>Real-time Sales Tracking</span>
            </div>
            <div style={styles.featureItem}>
              <span style={styles.featureIcon}>✓</span>
              <span>Efficient Delivery System</span>
            </div>
            <div style={styles.featureItem}>
              <span style={styles.featureIcon}>✓</span>
              <span>Advanced Analytics Dashboard</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div style={styles.rightPanel}>
        <div style={styles.formContainer}>
          <div style={styles.formHeader}>
            <h2 style={styles.title}>Welcome Back</h2>
            <p style={styles.subtitle}>Sign in to access your admin dashboard</p>
          </div>

          <form onSubmit={handleLogin} style={styles.form}>
            {/* Username Field */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Username</label>
              <div style={styles.inputWrapper}>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                  required
                  style={{
                    ...styles.input,
                    ...(focusedField === 'username' && styles.inputFocused)
                  }}
                  disabled={loading}
                />
                <span style={styles.inputIcon}>👤</span>
              </div>
            {error && (
              <div style={{ color: "#dc3545", fontSize: "0.9rem" }}>{error}</div>
            )}
            </div>

            {/* Password Field */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  required
                  style={{
                    ...styles.input,
                    ...(focusedField === 'password' && styles.inputFocused)
                  }}
                  disabled={loading}
                />
                <button
                  type="button"
                  style={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = styles.passwordToggleHover.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = styles.passwordToggle.color;
                  }}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div style={styles.rememberForgot}>
              <label style={styles.checkbox}>
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a
                href="/forgot-password"
                style={styles.forgotLink}
                onMouseEnter={(e) => {
                  e.target.style.color = styles.forgotLinkHover.color;
                  e.target.style.textDecoration = styles.forgotLinkHover.textDecoration;
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = styles.forgotLink.color;
                  e.target.style.textDecoration = styles.forgotLink.textDecoration;
                }}
              >
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                ...styles.button,
                ...(loading && styles.buttonDisabled)
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = styles.buttonHover.transform;
                  e.currentTarget.style.boxShadow = styles.buttonHover.boxShadow;
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "none";
                }
              }}
              disabled={loading}
            >
              {loading && <span style={styles.spinner}></span>}
              {loading ? "Signing In..." : "Login"}
            </button>

            <div style={styles.signupContainer}>
              <span>Don't have an account?</span>
              <button type="button" style={styles.signupButton} onClick={handleSignup}>
                Sign Up
              </button>
            </div>
          </form>

          <div style={styles.footer}>
            <p>© 2025 Nation Motor Spares. All rights reserved.</p>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @media (max-width: 968px) {
            .left-panel {
              display: none;
            }
          }
        `}
      </style>
    </div>
  );
};

export default LoginPage;