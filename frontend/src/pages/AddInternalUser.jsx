import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AddInternalUserPage() {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    address: "",
    role: "staff",
  });
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [errors, setErrors] = useState({});

  const roles = [
    { value: "manager", label: "Manager", icon: "👔" },
    { value: "staff", label: "Staff", icon: "👨‍💼" },
    { value: "peon", label: "Peon", icon: "👷" },
    { value: "delivery_staff", label: "Delivery Staff", icon: "🚚" },
    { value: "other", label: "Other", icon: "👤" },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/internal-users");
      setUsers(res.data);
    } catch (err) {
      showToast("error", "Failed to fetch users.");
    }
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  const validatePhone = (phone) => {
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length === 9 && /^\d{9}$/.test(digitsOnly);
  };

  const handleChange = (field, value) => {
    if (field === "phoneNumber") {
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length <= 9) {
        setFormData({ ...formData, [field]: digitsOnly });
        if (errors.phoneNumber) {
          setErrors({ ...errors, phoneNumber: null });
        }
      }
      return;
    }
    
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!validatePhone(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be exactly 9 digits";
    }
    
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    } else if (formData.address.trim().length < 10) {
      newErrors.address = "Address must be at least 10 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast("error", "Please fix the errors in the form");
      return;
    }
    
    setLoading(true);
    try {
      let res;
      if (userId) {
        res = await axios.put(
          `http://localhost:3000/api/internal-users/${userId}`,
          formData
        );
        showToast(
          "success",
          `Updated employee ${res.data.name} (${res.data.employeeId}) successfully`
        );
      } else {
        res = await axios.post(
          "http://localhost:3000/api/internal-users",
          formData
        );
        showToast(
          "success",
          `Added employee ${res.data.name} (${res.data.employeeId}) successfully`
        );
      }
      setUserId(null);
      setFormData({ name: "", phoneNumber: "", address: "", role: "staff" });
      setErrors({});
      fetchUsers();
    } catch (err) {
      showToast(
        "error",
        err.response?.data?.message || "Error while saving the employee."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (u) => {
    setUserId(u._id);
    setFormData({
      name: u.name,
      phoneNumber: u.phoneNumber,
      address: u.address,
      role: u.role,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id, name, employeeId) => {
    if (!window.confirm(`Delete ${name} (${employeeId})?`)) return;
    setLoading(true);
    try {
      await axios.delete(`http://localhost:3000/api/internal-users/${id}`);
      showToast("success", `Deleted ${name} (${employeeId}) successfully`);
      fetchUsers();
    } catch {
      showToast("error", "Failed to delete user.");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: "1600px",
      margin: "0 auto",
      padding: "50px 30px",
      background: "linear-gradient(135deg, #f0f4f8 0%, #e8eef5 50%, #f5f7fa 100%)",
      minHeight: "100vh",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      position: "relative",
    },
    backgroundPattern: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.03,
      backgroundImage: "radial-gradient(circle at 20% 50%, rgba(2, 62, 138, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(2, 62, 138, 0.3) 0%, transparent 50%)",
      pointerEvents: "none",
      zIndex: 0,
    },
    content: {
      position: "relative",
      zIndex: 1,
    },
    toast: {
      position: "fixed",
      top: "20px",
      right: "20px",
      zIndex: 9999,
      padding: "20px 24px",
      borderRadius: "16px",
      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      fontWeight: "600",
      fontSize: "1rem",
      maxWidth: "400px",
      animation: "slideInRight 0.4s ease-out",
    },
    toastSuccess: {
      background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
      color: "#065f46",
      border: "2px solid #6ee7b7",
    },
    toastError: {
      background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
      color: "#991b1b",
      border: "2px solid #fca5a5",
    },
    header: {
      textAlign: "center",
      marginBottom: "50px",
      animation: "fadeInDown 0.8s ease-out",
    },
    title: {
      color: "#023E8A",
      fontSize: "3.5rem",
      fontWeight: "800",
      margin: "0",
      marginBottom: "12px",
      letterSpacing: "-2px",
      textShadow: "0 2px 10px rgba(2, 62, 138, 0.1)",
      background: "linear-gradient(135deg, #023E8A 0%, #0353b8 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    },
    subtitle: {
      color: "#64748b",
      fontSize: "1.2rem",
      margin: "0",
      fontWeight: "400",
      letterSpacing: "0.5px",
    },
    formContainer: {
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      padding: "50px",
      borderRadius: "20px",
      border: "1px solid rgba(226, 232, 240, 0.8)",
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)",
      maxWidth: "900px",
      margin: "0 auto 50px auto",
      animation: "fadeInUp 0.8s ease-out",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "28px",
    },
    formRow: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "28px",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
    },
    label: {
      color: "#1e293b",
      fontSize: "0.875rem",
      fontWeight: "700",
      marginBottom: "10px",
      letterSpacing: "0.5px",
      textTransform: "uppercase",
    },
    required: {
      color: "#ef4444",
      marginLeft: "4px",
    },
    input: {
      padding: "14px 18px",
      border: "2px solid #e2e8f0",
      borderRadius: "12px",
      fontSize: "1rem",
      fontFamily: "inherit",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      backgroundColor: "#ffffff",
      outline: "none",
      color: "#1e293b",
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
    },
    inputFocused: {
      borderColor: "#023E8A",
      boxShadow: "0 0 0 4px rgba(2, 62, 138, 0.1), 0 2px 4px rgba(0, 0, 0, 0.05)",
      transform: "translateY(-1px)",
    },
    inputError: {
      borderColor: "#ef4444",
    },
    phoneInputWrapper: {
      position: "relative",
    },
    phonePrefix: {
      position: "absolute",
      left: "18px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#64748b",
      fontWeight: "600",
      fontSize: "1rem",
      pointerEvents: "none",
    },
    phoneInput: {
      paddingLeft: "55px",
    },
    textarea: {
      padding: "14px 18px",
      border: "2px solid #e2e8f0",
      borderRadius: "12px",
      fontSize: "1rem",
      fontFamily: "inherit",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      backgroundColor: "#ffffff",
      outline: "none",
      color: "#1e293b",
      resize: "vertical",
      minHeight: "100px",
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
    },
    select: {
      padding: "14px 40px 14px 18px",
      border: "2px solid #e2e8f0",
      borderRadius: "12px",
      fontSize: "1rem",
      fontFamily: "inherit",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      backgroundColor: "#ffffff",
      outline: "none",
      color: "#1e293b",
      cursor: "pointer",
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
      appearance: "none",
      backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23023E8A' d='M6 9L1 4h10z'/%3E%3C/svg%3E\")",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 16px center",
    },
    errorMessage: {
      color: "#ef4444",
      fontSize: "0.875rem",
      marginTop: "6px",
      fontWeight: "500",
      display: "flex",
      alignItems: "center",
      gap: "4px",
    },
    charCount: {
      fontSize: "0.75rem",
      color: "#94a3b8",
      marginTop: "4px",
      textAlign: "right",
    },
    buttonGroup: {
      display: "flex",
      gap: "15px",
      marginTop: "10px",
    },
    submitButton: {
      background: "linear-gradient(135deg, #023E8A 0%, #0353b8 100%)",
      color: "#ffffff",
      padding: "16px 40px",
      border: "none",
      borderRadius: "12px",
      fontSize: "1.05rem",
      fontWeight: "700",
      cursor: "pointer",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      boxShadow: "0 6px 20px rgba(2, 62, 138, 0.3)",
    },
    submitButtonDisabled: {
      background: "linear-gradient(135deg, #94a3b8 0%, #64748b 100%)",
      cursor: "not-allowed",
      opacity: 0.7,
    },
    cancelButton: {
      background: "#ffffff",
      color: "#64748b",
      padding: "16px 40px",
      border: "2px solid #e2e8f0",
      borderRadius: "12px",
      fontSize: "1.05rem",
      fontWeight: "700",
      cursor: "pointer",
      transition: "all 0.3s ease",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    tableContainer: {
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      padding: "40px",
      borderRadius: "20px",
      border: "1px solid rgba(226, 232, 240, 0.8)",
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)",
      maxWidth: "1400px",
      margin: "0 auto",
      animation: "fadeInUp 1s ease-out",
    },
    tableTitle: {
      color: "#023E8A",
      fontSize: "1.8rem",
      fontWeight: "700",
      margin: "0 0 30px 0",
      letterSpacing: "-0.5px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "0.95rem",
    },
    tableHeader: {
      background: "linear-gradient(135deg, #023E8A 0%, #0353b8 100%)",
      color: "#ffffff",
    },
    th: {
      padding: "18px 15px",
      textAlign: "left",
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: "1px",
      fontSize: "0.85rem",
    },
    tr: {
      borderBottom: "1px solid #f1f5f9",
      transition: "all 0.2s ease",
    },
    td: {
      padding: "18px 15px",
      verticalAlign: "middle",
      color: "#334155",
    },
    employeeId: {
      fontFamily: "monospace",
      backgroundColor: "#f8fafc",
      padding: "4px 10px",
      borderRadius: "6px",
      fontSize: "0.9rem",
      fontWeight: "700",
      color: "#023E8A",
    },
    roleBadge: {
      padding: "6px 12px",
      borderRadius: "20px",
      fontSize: "0.85rem",
      fontWeight: "600",
      textTransform: "capitalize",
      display: "inline-block",
    },
    actionButtons: {
      display: "flex",
      gap: "10px",
      justifyContent: "flex-end",
    },
    editButton: {
      background: "linear-gradient(135deg, #023E8A 0%, #0353b8 100%)",
      color: "#ffffff",
      padding: "8px 16px",
      border: "none",
      borderRadius: "8px",
      fontSize: "0.85rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      boxShadow: "0 2px 8px rgba(2, 62, 138, 0.2)",
    },
    deleteButton: {
      background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
      color: "#ffffff",
      padding: "8px 16px",
      border: "none",
      borderRadius: "8px",
      fontSize: "0.85rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      boxShadow: "0 2px 8px rgba(239, 68, 68, 0.2)",
    },
    noData: {
      textAlign: "center",
      padding: "60px 20px",
      color: "#64748b",
      fontSize: "1.1rem",
    },
  };

  const styleSheet = `
    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(100px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes fadeInDown {
      from { opacity: 0; transform: translateY(-30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    input:focus, textarea:focus, select:focus {
      border-color: #023E8A !important;
      box-shadow: 0 0 0 4px rgba(2, 62, 138, 0.1), 0 2px 4px rgba(0, 0, 0, 0.05) !important;
      transform: translateY(-1px);
    }
    .action-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }
    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(2, 62, 138, 0.4);
    }
    .cancel-btn:hover {
      background-color: #f8fafc;
      border-color: #cbd5e1;
    }
    .table-row:hover {
      background-color: #f8fafc !important;
    }
    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr !important;
      }
    }
  `;

  const getRoleBadgeStyle = (role) => {
    const colors = {
      manager: { bg: "#dbeafe", color: "#1e40af", border: "#93c5fd" },
      staff: { bg: "#f3e8ff", color: "#6b21a8", border: "#c4b5fd" },
      peon: { bg: "#fef3c7", color: "#92400e", border: "#fbbf24" },
      delivery_staff: { bg: "#d1fae5", color: "#065f46", border: "#6ee7b7" },
      other: { bg: "#f1f5f9", color: "#475569", border: "#cbd5e1" },
    };
    return {
      ...styles.roleBadge,
      backgroundColor: colors[role]?.bg || colors.other.bg,
      color: colors[role]?.color || colors.other.color,
      border: `2px solid ${colors[role]?.border || colors.other.border}`,
    };
  };

  return (
    <div style={styles.container}>
      <style>{styleSheet}</style>
      <div style={styles.backgroundPattern}></div>
      
      <div style={styles.content}>
        {/* Toast Notification */}
        {toast && (
          <div
            style={{
              ...styles.toast,
              ...(toast.type === "success" ? styles.toastSuccess : styles.toastError)
            }}
          >
            <span style={{fontSize: "1.5rem"}}>
              {toast.type === "success" ? "✅" : "❌"}
            </span>
            <span>{toast.message}</span>
          </div>
        )}

        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>
            {userId ? "Edit Internal User" : "Add Internal User"}
          </h1>
          <p style={styles.subtitle}>
            {userId
              ? "Update the employee details below"
              : "Register a new internal employee"}
          </p>
        </div>

        {/* Form Section */}
        <div style={styles.formContainer}>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formRow} className="form-row">
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  👤 Full Name<span style={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  style={{
                    ...styles.input,
                    ...(focusedField === 'name' ? styles.inputFocused : {}),
                    ...(errors.name ? styles.inputError : {})
                  }}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter full name"
                  disabled={loading}
                />
                {errors.name && (
                  <div style={styles.errorMessage}>
                    <span>⚠️</span>
                    {errors.name}
                  </div>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  📞 Phone Number<span style={styles.required}>*</span>
                </label>
                <div style={styles.phoneInputWrapper}>
                  <span style={styles.phonePrefix}>+94</span>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => handleChange("phoneNumber", e.target.value)}
                    style={{
                      ...styles.input,
                      ...styles.phoneInput,
                      ...(focusedField === 'phoneNumber' ? styles.inputFocused : {}),
                      ...(errors.phoneNumber ? styles.inputError : {})
                    }}
                    onFocus={() => setFocusedField('phoneNumber')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="771234567"
                    maxLength="9"
                    disabled={loading}
                  />
                </div>
                {errors.phoneNumber && (
                  <div style={styles.errorMessage}>
                    <span>⚠️</span>
                    {errors.phoneNumber}
                  </div>
                )}
                {formData.phoneNumber && !errors.phoneNumber && (
                  <div style={styles.charCount}>
                    {formData.phoneNumber.length}/9 digits
                  </div>
                )}
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                📍 Address<span style={styles.required}>*</span>
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                style={{
                  ...styles.textarea,
                  ...(focusedField === 'address' ? styles.inputFocused : {}),
                  ...(errors.address ? styles.inputError : {})
                }}
                onFocus={() => setFocusedField('address')}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter full address"
                disabled={loading}
              />
              {errors.address && (
                <div style={styles.errorMessage}>
                  <span>⚠️</span>
                  {errors.address}
                </div>
              )}
              {formData.address && (
                <div style={styles.charCount}>
                  {formData.address.length} characters
                </div>
              )}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                💼 Role<span style={styles.required}>*</span>
              </label>
              <select
                value={formData.role}
                onChange={(e) => handleChange("role", e.target.value)}
                style={{
                  ...styles.select,
                  ...(focusedField === 'role' ? styles.inputFocused : {})
                }}
                onFocus={() => setFocusedField('role')}
                onBlur={() => setFocusedField(null)}
                disabled={loading}
              >
                {roles.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.icon} {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.buttonGroup}>
              <button
                type="submit"
                disabled={loading}
                className="submit-btn"
                style={{
                  ...styles.submitButton,
                  ...(loading ? styles.submitButtonDisabled : {})
                }}
              >
                {loading
                  ? userId
                    ? "⏳ Updating..."
                    : "⏳ Adding..."
                  : userId
                  ? "✓ Update User"
                  : "✓ Add User"}
              </button>
              {userId && (
                <button
                  type="button"
                  onClick={() => {
                    setUserId(null);
                    setFormData({ name: "", phoneNumber: "", address: "", role: "staff" });
                    setErrors({});
                  }}
                  className="cancel-btn"
                  style={styles.cancelButton}
                >
                  ✕ Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* User Table */}
        <div style={styles.tableContainer}>
          <h2 style={styles.tableTitle}>Registered Employees</h2>
          <div style={{overflowX: "auto"}}>
            <table style={styles.table}>
              <thead style={styles.tableHeader}>
                <tr>
                  <th style={styles.th}>Employee ID</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Phone</th>
                  <th style={styles.th}>Address</th>
                  <th style={styles.th}>Role</th>
                  <th style={{...styles.th, textAlign: "right"}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((u, i) => (
                    <tr
                      key={u._id}
                      className="table-row"
                      style={{
                        ...styles.tr,
                        backgroundColor: i % 2 === 0 ? "#ffffff" : "#f8fafc"
                      }}
                    >
                      <td style={styles.td}>
                        <span style={styles.employeeId}>{u.employeeId || "-"}</span>
                      </td>
                      <td style={styles.td}><strong>{u.name}</strong></td>
                      <td style={styles.td}>+94{u.phoneNumber}</td>
                      <td style={styles.td}>{u.address}</td>
                      <td style={styles.td}>
                        <span style={getRoleBadgeStyle(u.role)}>
                          {roles.find(r => r.value === u.role)?.icon} {u.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.actionButtons}>
                          <button
                            onClick={() => handleEdit(u)}
                            className="action-btn"
                            style={styles.editButton}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(u._id, u.name, u.employeeId)}
                            className="action-btn"
                            style={styles.deleteButton}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={styles.noData}>
                      <div style={{fontSize: "3rem", marginBottom: "15px", opacity: 0.5}}>👥</div>
                      No employees found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}