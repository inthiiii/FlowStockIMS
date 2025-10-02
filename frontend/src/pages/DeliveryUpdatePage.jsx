import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const DeliveryUpdatePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [delivery, setDelivery] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const statuses = [
    { value: "Pending", label: "Pending", color: "#6c757d" },
    { value: "Shipped", label: "Shipped", color: "#ffc107" },
    { value: "In-Transit", label: "In Transit", color: "#17a2b8" },
    { value: "Delivered", label: "Delivered", color: "#28a745" },
    { value: "Cancelled", label: "Cancelled", color: "#dc3545" }
  ];

  useEffect(() => {
    const fetchDelivery = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:3000/api/deliveries/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch delivery");
        setDelivery(data);
        setStatus(data.status || "Pending");
        setError("");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDelivery();
  }, [id]);

  const handleUpdate = async () => {
    setUpdating(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:3000/api/deliveries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update delivery");
      setSuccess(true);
      setTimeout(() => {
        navigate("/deliveries/list");
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (statusValue) => {
    const statusObj = statuses.find(s => s.value === statusValue);
    return statusObj ? statusObj.color : "#6c757d";
  };

  const styles = {
    container: {
      maxWidth: "800px",
      margin: "0 auto",
      padding: "40px 20px",
      backgroundColor: "#ffffff",
      minHeight: "100vh",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    backButton: {
      backgroundColor: "#6c757d",
      color: "#ffffff",
      padding: "10px 20px",
      border: "none",
      borderRadius: "6px",
      fontSize: "0.9rem",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.3s ease",
      marginBottom: "30px",
    },
    backButtonHover: {
      backgroundColor: "#5a6268",
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
    contentContainer: {
      backgroundColor: "#f8f9fa",
      padding: "40px",
      borderRadius: "12px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      border: "1px solid #e9ecef",
    },
    section: {
      backgroundColor: "#ffffff",
      padding: "25px",
      borderRadius: "10px",
      marginBottom: "25px",
      border: "1px solid #e9ecef",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
    },
    sectionTitle: {
      color: "#023E8A",
      fontSize: "1.3rem",
      fontWeight: "600",
      marginBottom: "20px",
      paddingBottom: "10px",
      borderBottom: "2px solid #e9ecef",
    },
    infoGrid: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "15px",
    },
    infoRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 15px",
      backgroundColor: "#f8f9fa",
      borderRadius: "8px",
      border: "1px solid #e9ecef",
    },
    infoLabel: {
      fontSize: "0.95rem",
      fontWeight: "600",
      color: "#023E8A",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    infoValue: {
      fontSize: "1rem",
      fontWeight: "500",
      color: "#495057",
      textAlign: "right",
    },
    saleId: {
      fontFamily: "monospace",
      backgroundColor: "#ffffff",
      padding: "4px 8px",
      borderRadius: "4px",
      border: "1px solid #e9ecef",
      fontSize: "0.9rem",
    },
    statusSection: {
      backgroundColor: "#ffffff",
      padding: "25px",
      borderRadius: "10px",
      border: "1px solid #e9ecef",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
      marginBottom: "25px",
    },
    currentStatusBadge: {
      padding: "8px 16px",
      borderRadius: "20px",
      fontSize: "0.95rem",
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      color: "#ffffff",
      display: "inline-block",
      marginBottom: "20px",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    label: {
      color: "#023E8A",
      fontSize: "1rem",
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
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
    selectFocus: {
      borderColor: "#023E8A",
      boxShadow: "0 0 0 3px rgba(2, 62, 138, 0.1)",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "center",
      gap: "15px",
      marginTop: "30px",
    },
    updateButton: {
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
      minWidth: "180px",
    },
    updateButtonHover: {
      backgroundColor: "#012a5c",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(2, 62, 138, 0.3)",
    },
    updateButtonDisabled: {
      backgroundColor: "#6c757d",
      cursor: "not-allowed",
      transform: "none",
      boxShadow: "none",
    },
    cancelButton: {
      backgroundColor: "#6c757d",
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
      minWidth: "180px",
    },
    cancelButtonHover: {
      backgroundColor: "#5a6268",
    },
    loadingContainer: {
      textAlign: "center",
      padding: "80px 20px",
      color: "#6c757d",
    },
    loadingSpinner: {
      width: "50px",
      height: "50px",
      border: "4px solid #f3f3f3",
      borderTop: "4px solid #023E8A",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      marginBottom: "20px",
      margin: "0 auto 20px auto",
    },
    loadingText: {
      fontSize: "1.2rem",
      fontWeight: "500",
    },
    buttonSpinner: {
      display: "inline-block",
      width: "20px",
      height: "20px",
      border: "2px solid #ffffff",
      borderTop: "2px solid transparent",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      marginRight: "10px",
    },
    errorMessage: {
      backgroundColor: "#f8d7da",
      color: "#721c24",
      padding: "12px 16px",
      borderRadius: "8px",
      border: "1px solid #f5c6cb",
      fontSize: "0.95rem",
      fontWeight: "500",
      marginBottom: "20px",
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
      marginBottom: "20px",
      textAlign: "center",
    },
    partnerBadge: {
      backgroundColor: "#e3f2fd",
      color: "#1976d2",
      padding: "4px 10px",
      borderRadius: "12px",
      fontSize: "0.9rem",
      fontWeight: "500",
      display: "inline-block",
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <div style={styles.loadingText}>Loading delivery details...</div>
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      </div>
    );
  }

  if (error && !delivery) {
    return (
      <div style={styles.container}>
        <button 
          style={styles.backButton}
          onClick={() => navigate("/deliveries/list")}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = styles.backButtonHover.backgroundColor;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = styles.backButton.backgroundColor;
          }}
        >
          ← Back to Deliveries
        </button>
        <div style={styles.errorMessage}>
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <button 
        style={styles.backButton}
        onClick={() => navigate("/deliveries/list")}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = styles.backButtonHover.backgroundColor;
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = styles.backButton.backgroundColor;
        }}
      >
        ← Back to Deliveries
      </button>

      <div style={styles.header}>
        <h1 style={styles.title}>Update Delivery Status</h1>
        <p style={styles.subtitle}>Modify delivery tracking and status information</p>
      </div>

      <div style={styles.contentContainer}>
        {error && (
          <div style={styles.errorMessage}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {success && (
          <div style={styles.successMessage}>
            <strong>Success:</strong> Delivery updated successfully! Redirecting...
          </div>
        )}

        {/* Delivery Information */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Delivery Information</h3>
          <div style={styles.infoGrid}>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Sale ID</span>
              <span style={{...styles.infoValue, ...styles.saleId}}>
                {delivery?.sale?._id || 'N/A'}
              </span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Customer Name</span>
              <span style={styles.infoValue}>
                {delivery?.sale?.customerName || 'N/A'}
              </span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Product</span>
              <span style={styles.infoValue}>
                {delivery?.sale?.product?.name || delivery?.sale?.product?.productName || 'N/A'}
              </span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Delivery Partner</span>
              <span style={styles.partnerBadge}>
                {delivery?.partner || 'N/A'}
              </span>
            </div>
            {delivery?.createdAt && (
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Created Date</span>
                <span style={styles.infoValue}>
                  {new Date(delivery.createdAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Status Update Section */}
        <div style={styles.statusSection}>
          <h3 style={styles.sectionTitle}>Status Management</h3>
          
          <div>
            <div style={styles.label}>Current Status</div>
            <span 
              style={{
                ...styles.currentStatusBadge,
                backgroundColor: getStatusColor(delivery?.status)
              }}
            >
              {delivery?.status || 'Pending'}
            </span>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Update Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={styles.select}
              onFocus={(e) => {
                e.target.style.borderColor = styles.selectFocus.borderColor;
                e.target.style.boxShadow = styles.selectFocus.boxShadow;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = styles.select.borderColor;
                e.target.style.boxShadow = "none";
              }}
              disabled={updating}
            >
              {statuses.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={styles.buttonContainer}>
          <button
            onClick={() => navigate("/deliveries/list")}
            style={styles.cancelButton}
            onMouseEnter={(e) => {
              if (!updating) {
                e.target.style.backgroundColor = styles.cancelButtonHover.backgroundColor;
              }
            }}
            onMouseLeave={(e) => {
              if (!updating) {
                e.target.style.backgroundColor = styles.cancelButton.backgroundColor;
              }
            }}
            disabled={updating}
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            style={{
              ...styles.updateButton,
              ...(updating ? styles.updateButtonDisabled : {})
            }}
            onMouseEnter={(e) => {
              if (!updating) {
                e.target.style.backgroundColor = styles.updateButtonHover.backgroundColor;
                e.target.style.transform = styles.updateButtonHover.transform;
                e.target.style.boxShadow = styles.updateButtonHover.boxShadow;
              }
            }}
            onMouseLeave={(e) => {
              if (!updating) {
                e.target.style.backgroundColor = styles.updateButton.backgroundColor;
                e.target.style.transform = "none";
                e.target.style.boxShadow = "none";
              }
            }}
            disabled={updating}
          >
            {updating && <span style={styles.buttonSpinner}></span>}
            {updating ? "Updating..." : "Update Delivery"}
          </button>
        </div>
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

export default DeliveryUpdatePage;