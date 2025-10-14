import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authService } from "../services/authService";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      setError("Invalid reset link. Please request a new password reset.");
      return;
    }
    setToken(tokenParam);
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error when user starts typing
  };

  const validatePassword = (password) => {
    // Exactly 6 characters, one uppercase, one digit, one special character
    const strongRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6}$/;
    if (!strongRegex.test(password)) {
      return "Password must be exactly 6 characters and include 1 uppercase letter, 1 number, and 1 special character";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validation
    if (!formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword({ token, password: formData.password });
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
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
    inputError: {
      borderColor: "#dc3545",
      boxShadow: "0 0 0 3px rgba(220, 53, 69, 0.1)",
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
    errorText: {
      color: "#dc3545",
      fontSize: "0.9rem",
      marginTop: "5px",
    },
    successContainer: {
      textAlign: "center",
      padding: "20px",
    },
    successIcon: {
      fontSize: "4rem",
      marginBottom: "20px",
    },
    successTitle: {
      color: "#28a745",
      fontSize: "1.5rem",
      fontWeight: "600",
      marginBottom: "10px",
    },
    successMessage: {
      color: "#6c757d",
      fontSize: "1rem",
    },
    backToLogin: {
      marginTop: "20px",
      textAlign: "center",
    },
    backLink: {
      color: "#023E8A",
      textDecoration: "none",
      fontWeight: "500",
      fontSize: "0.9rem",
    },
    '@media (max-width: 968px)': {
      leftPanel: {
        display: "none",
      },
    },
  };

  if (success) {
    return (
      <div style={styles.container}>
        <div style={styles.rightPanel}>
          <div style={styles.formContainer}>
            <div style={styles.successContainer}>
              <div style={styles.successIcon}>✅</div>
              <h2 style={styles.successTitle}>Password Reset Successful!</h2>
              <p style={styles.successMessage}>
                Your password has been updated successfully. You will be redirected to the login page shortly.
              </p>
              <div style={styles.backToLogin}>
                <a href="/login" style={styles.backLink}>
                  Go to Login Page
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Left Panel - Branding */}
      <div style={styles.leftPanel}>
        <div style={styles.decorativeCircle1}></div>
        <div style={styles.decorativeCircle2}></div>
        
        <div style={styles.brandContent}>
          <h1 style={styles.logo}>Nation Motor Spares</h1>
          <p style={styles.tagline}>
            Create a new password to secure your account
          </p>
          
          <div style={styles.features}>
            <div style={styles.featureItem}>
              <span style={styles.featureIcon}>🔒</span>
              <span>Secure Password Reset</span>
            </div>
            <div style={styles.featureItem}>
              <span style={styles.featureIcon}>⚡</span>
              <span>Quick & Easy Process</span>
            </div>
            <div style={styles.featureItem}>
              <span style={styles.featureIcon}>🛡️</span>
              <span>Account Security</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Reset Password Form */}
      <div style={styles.rightPanel}>
        <div style={styles.formContainer}>
          <div style={styles.formHeader}>
            <h2 style={styles.title}>Reset Password</h2>
            <p style={styles.subtitle}>Enter your new password below</p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* New Password Field */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>New Password</label>
              <div style={styles.inputWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your new password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  required
                  maxLength={6}
                  style={{
                    ...styles.input,
                    ...(focusedField === 'password' && styles.inputFocused),
                    ...(error && styles.inputError)
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

            {/* Confirm Password Field */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Confirm Password</label>
              <div style={styles.inputWrapper}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('confirmPassword')}
                  onBlur={() => setFocusedField(null)}
                  required
                  maxLength={6}
                  style={{
                    ...styles.input,
                    ...(focusedField === 'confirmPassword' && styles.inputFocused),
                    ...(error && styles.inputError)
                  }}
                  disabled={loading}
                />
                <button
                  type="button"
                  style={styles.passwordToggle}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = styles.passwordToggleHover.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = styles.passwordToggle.color;
                  }}
                >
                  {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            {error && (
              <div style={styles.errorText}>{error}</div>
            )}

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
              disabled={loading || !token}
            >
              {loading && <span style={styles.spinner}></span>}
              {loading ? "Resetting..." : "Reset Password"}
            </button>

            <div style={styles.backToLogin}>
              <a href="/login" style={styles.backLink}>
                Back to Login
              </a>
            </div>
          </form>
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

export default ResetPasswordPage;
