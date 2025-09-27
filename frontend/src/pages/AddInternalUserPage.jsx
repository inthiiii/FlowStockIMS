import React, { useState } from 'react';
import axios from 'axios';

const AddInternalUserPage = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    phoneNumber: '', 
    address: '', 
    role: 'staff' 
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const roles = [
    { value: 'manager', label: 'Manager', description: 'Supervises operations and manages staff' },
    { value: 'staff', label: 'Staff', description: 'Regular employee handling daily tasks' },
    { value: 'peon', label: 'Peon', description: 'Support staff for general duties' },
    { value: 'delivery_staff', label: 'Delivery Staff', description: 'Handles product deliveries' },
    { value: 'other', label: 'Other', description: 'Other specialized roles' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post('http://localhost:3000/api/internal-users', formData);
      if (response.status === 201) {
        setSuccess(true);
        setFormData({ name: '', phoneNumber: '', address: '', role: 'staff' });
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error adding user');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (error) setError(null); // Clear error when user starts typing
  };

  const selectedRole = roles.find(role => role.value === formData.role);

  const styles = {
    container: {
      maxWidth: "700px",
      margin: "0 auto",
      padding: "40px 20px",
      backgroundColor: "#ffffff",
      minHeight: "100vh",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    header: {
      textAlign: "center",
      marginBottom: "40px",
    },
    title: {
      color: "#023E8A",
      fontSize: "2.5rem",
      fontWeight: "600",
      margin: "0",
      marginBottom: "10px",
    },
    subtitle: {
      color: "#6c757d",
      fontSize: "1.1rem",
      margin: "0",
      fontWeight: "400",
    },
    formContainer: {
      backgroundColor: "#f8f9fa",
      padding: "40px",
      borderRadius: "12px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      border: "1px solid #e9ecef",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "25px",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
    },
    label: {
      color: "#023E8A",
      fontSize: "0.95rem",
      fontWeight: "600",
      marginBottom: "8px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    input: {
      padding: "12px 16px",
      border: "2px solid #e9ecef",
      borderRadius: "8px",
      fontSize: "1rem",
      fontFamily: "inherit",
      transition: "all 0.3s ease",
      backgroundColor: "#ffffff",
      outline: "none",
    },
    select: {
      padding: "12px 16px",
      border: "2px solid #e9ecef",
      borderRadius: "8px",
      fontSize: "1rem",
      fontFamily: "inherit",
      transition: "all 0.3s ease",
      backgroundColor: "#ffffff",
      outline: "none",
      cursor: "pointer",
    },
    textarea: {
      padding: "12px 16px",
      border: "2px solid #e9ecef",
      borderRadius: "8px",
      fontSize: "1rem",
      fontFamily: "inherit",
      transition: "all 0.3s ease",
      backgroundColor: "#ffffff",
      outline: "none",
      resize: "vertical",
      minHeight: "80px",
    },
    inputFocus: {
      borderColor: "#023E8A",
      boxShadow: "0 0 0 3px rgba(2, 62, 138, 0.1)",
    },
    formRow: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "25px",
    },
    button: {
      backgroundColor: "#023E8A",
      color: "#ffffff",
      padding: "15px 30px",
      border: "none",
      borderRadius: "8px",
      fontSize: "1.1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      marginTop: "20px",
      position: "relative",
    },
    buttonHover: {
      backgroundColor: "#012a5c",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(2, 62, 138, 0.3)",
    },
    buttonDisabled: {
      backgroundColor: "#6c757d",
      cursor: "not-allowed",
      transform: "none",
      boxShadow: "none",
    },
    errorMessage: {
      backgroundColor: "#f8d7da",
      color: "#721c24",
      padding: "12px 16px",
      borderRadius: "8px",
      border: "1px solid #f5c6cb",
      fontSize: "0.95rem",
      fontWeight: "500",
      margin: "0",
      textAlign: "center",
    },
    successMessage: {
      backgroundColor: "#d1edff",
      color: "#0c5460",
      padding: "12px 16px",
      borderRadius: "8px",
      border: "1px solid #bee5eb",
      fontSize: "0.95rem",
      fontWeight: "500",
      margin: "0",
      textAlign: "center",
    },
    roleInfo: {
      backgroundColor: "#ffffff",
      padding: "15px",
      borderRadius: "8px",
      border: "1px solid #d1ecf1",
      backgroundColor: "#e7f3ff",
      marginTop: "10px",
    },
    roleInfoTitle: {
      color: "#023E8A",
      fontSize: "0.9rem",
      fontWeight: "600",
      marginBottom: "5px",
    },
    roleInfoDescription: {
      color: "#0c5460",
      fontSize: "0.85rem",
      margin: "0",
    },
    loadingSpinner: {
      display: "inline-block",
      width: "20px",
      height: "20px",
      border: "2px solid #ffffff",
      borderTop: "2px solid transparent",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      marginRight: "10px",
    },
    requiredIndicator: {
      color: "#dc3545",
      marginLeft: "4px",
      fontWeight: "bold",
    },
    helpText: {
      fontSize: "0.85rem",
      color: "#6c757d",
      marginTop: "5px",
      fontStyle: "italic",
    },
    phoneInput: {
      position: "relative",
    },
    phonePrefix: {
      position: "absolute",
      left: "16px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#6c757d",
      fontSize: "1rem",
      pointerEvents: "none",
    },
    phoneInputField: {
      paddingLeft: "45px",
    },
    '@media (max-width: 768px)': {
      formRow: {
        gridTemplateColumns: "1fr",
      },
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Add Internal User</h1>
        <p style={styles.subtitle}>Register a new team member to the system</p>
      </div>

      <div style={styles.formContainer}>
        {error && (
          <div style={styles.errorMessage}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {success && (
          <div style={styles.successMessage}>
            <strong>Success:</strong> User added successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Full Name<span style={styles.requiredIndicator}>*</span>
              </label>
              <input
                type="text"
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                style={styles.input}
                onFocus={(e) => {
                  e.target.style.borderColor = styles.inputFocus.borderColor;
                  e.target.style.boxShadow = styles.inputFocus.boxShadow;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = styles.input.borderColor;
                  e.target.style.boxShadow = "none";
                }}
                required
                disabled={loading}
              />
              <p style={styles.helpText}>Enter the employee's full name</p>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Phone Number<span style={styles.requiredIndicator}>*</span>
              </label>
              <div style={styles.phoneInput}>
                <span style={styles.phonePrefix}>+94</span>
                <input
                  type="tel"
                  placeholder="771234567"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  style={{...styles.input, ...styles.phoneInputField}}
                  onFocus={(e) => {
                    e.target.style.borderColor = styles.inputFocus.borderColor;
                    e.target.style.boxShadow = styles.inputFocus.boxShadow;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = styles.input.borderColor;
                    e.target.style.boxShadow = "none";
                  }}
                  required
                  disabled={loading}
                  pattern="[0-9]{9}"
                />
              </div>
              <p style={styles.helpText}>Enter mobile number without country code</p>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Address<span style={styles.requiredIndicator}>*</span>
            </label>
            <textarea
              placeholder="Enter complete address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              style={styles.textarea}
              onFocus={(e) => {
                e.target.style.borderColor = styles.inputFocus.borderColor;
                e.target.style.boxShadow = styles.inputFocus.boxShadow;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = styles.textarea.borderColor;
                e.target.style.boxShadow = "none";
              }}
              required
              disabled={loading}
            />
            <p style={styles.helpText}>Enter the employee's residential address</p>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Role<span style={styles.requiredIndicator}>*</span>
            </label>
            <select
              value={formData.role}
              onChange={(e) => handleInputChange('role', e.target.value)}
              style={styles.select}
              onFocus={(e) => {
                e.target.style.borderColor = styles.inputFocus.borderColor;
                e.target.style.boxShadow = styles.inputFocus.boxShadow;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = styles.select.borderColor;
                e.target.style.boxShadow = "none";
              }}
              disabled={loading}
            >
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
            
            {selectedRole && (
              <div style={styles.roleInfo}>
                <div style={styles.roleInfoTitle}>{selectedRole.label}</div>
                <p style={styles.roleInfoDescription}>{selectedRole.description}</p>
              </div>
            )}
          </div>

          <button 
            type="submit" 
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {})
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = styles.buttonHover.backgroundColor;
                e.target.style.transform = styles.buttonHover.transform;
                e.target.style.boxShadow = styles.buttonHover.boxShadow;
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = styles.button.backgroundColor;
                e.target.style.transform = "none";
                e.target.style.boxShadow = "none";
              }
            }}
            disabled={loading}
          >
            {loading && (
              <span style={styles.loadingSpinner}></span>
            )}
            {loading ? "Adding User..." : "Add User"}
          </button>
        </form>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default AddInternalUserPage;