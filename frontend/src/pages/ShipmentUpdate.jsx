// src/pages/ShipmentUpdate.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ShipmentUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState(null);
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const statuses = [
    { value: "pending", label: "Pending", color: "#6c757d" },
    { value: "shipped", label: "Shipped", color: "#28a745" },
    { value: "in-transit", label: "In Transit", color: "#ffc107" },
    { value: "delivered", label: "Delivered", color: "#17a2b8" },
    { value: "cancelled", label: "Cancelled", color: "#dc3545" }
  ];

  const fetchShipment = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`http://localhost:3000/api/shipments/${id}`);
      setShipment(data);
      setStatus(data.status || "pending");
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load shipment details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipment();
  }, [id]);

  const handleUpdate = async () => {
    setUpdating(true);
    setError("");
    try {
      await axios.put(`http://localhost:3000/api/shipments/${id}`, { status });
      setSuccess(true);
      setTimeout(() => {
        navigate("/shipments/control");
      }, 1500);
    } catch (err) {
      console.error(err);
      setError("Failed to update shipment");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (statusValue) => {
    const statusObj = statuses.find(s => s.value === statusValue);
    return statusObj ? statusObj.color : "#6c757d";
  };

  const getTotalQuantity = () => {
    return shipment?.products?.reduce((total, product) => total + product.quantity, 0) || 0;
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
      textDecoration: "none",
      display: "inline-block",
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
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "20px",
    },
    infoCard: {
      backgroundColor: "#f8f9fa",
      padding: "15px",
      borderRadius: "8px",
      border: "1px solid #e9ecef",
    },
    infoLabel: {
      fontSize: "0.9rem",
      fontWeight: "600",
      color: "#023E8A",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      marginBottom: "8px",
    },
    infoValue: {
      fontSize: "1.1rem",
      fontWeight: "500",
      color: "#495057",
    },
    shipmentId: {
      fontFamily: "monospace",
      backgroundColor: "#ffffff",
      padding: "6px 10px",
      borderRadius: "6px",
      border: "1px solid #e9ecef",
      fontSize: "1rem",
      fontWeight: "600",
      color: "#023E8A",
    },
    carrier: {
      backgroundColor: "#e3f2fd",
      color: "#1976d2",
      padding: "6px 12px",
      borderRadius: "12px",
      fontSize: "1rem",
      fontWeight: "500",
      display: "inline-block",
    },
    statusContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
    },
    currentStatusBadge: {
      padding: "8px 16px",
      borderRadius: "20px",
      fontSize: "0.9rem",
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      color: "#ffffff",
      display: "inline-block",
      width: "fit-content",
    },
    statusSelect: {
      padding: "12px 16px",
      border: "2px solid #e9ecef",
      borderRadius: "8px",
      fontSize: "1rem",
      fontFamily: "inherit",
      transition: "all 0.3s ease",
      backgroundColor: "#ffffff",
      outline: "none",
      cursor: "pointer",
      width: "100%",
      maxWidth: "200px",
    },
    statusSelectFocus: {
      borderColor: "#023E8A",
      boxShadow: "0 0 0 3px rgba(2, 62, 138, 0.1)",
    },
    productsList: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    productItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 15px",
      backgroundColor: "#f8f9fa",
      borderRadius: "8px",
      border: "1px solid #e9ecef",
    },
    productName: {
      fontSize: "1rem",
      fontWeight: "500",
      color: "#023E8A",
      flex: "1",
    },
    productQuantity: {
      backgroundColor: "#023E8A",
      color: "#ffffff",
      padding: "4px 8px",
      borderRadius: "12px",
      fontSize: "0.8rem",
      fontWeight: "600",
      minWidth: "50px",
      textAlign: "center",
    },
    summaryCard: {
      backgroundColor: "#e7f3ff",
      padding: "20px",
      borderRadius: "10px",
      border: "1px solid #b3d9ff",
      textAlign: "center",
    },
    summaryTitle: {
      fontSize: "1rem",
      fontWeight: "600",
      color: "#023E8A",
      marginBottom: "10px",
    },
    summaryValue: {
      fontSize: "2rem",
      fontWeight: "700",
      color: "#023E8A",
      margin: "0",
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
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <div style={styles.loadingText}>Loading shipment details...</div>
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

  if (!shipment) {
    return (
      <div style={styles.container}>
        <div style={styles.errorMessage}>
          <strong>Error:</strong> {error || "Shipment not found"}
        </div>
        <button 
          style={styles.backButton}
          onClick={() => navigate("/shipments")}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = styles.backButtonHover.backgroundColor;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = styles.backButton.backgroundColor;
          }}
        >
          Back to Shipments
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <button 
        style={styles.backButton}
        onClick={() => navigate("/shipments")}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = styles.backButtonHover.backgroundColor;
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = styles.backButton.backgroundColor;
        }}
      >
        ← Back to Shipments
      </button>

      <div style={styles.header}>
        <h1 style={styles.title}>Update Shipment</h1>
        <p style={styles.subtitle}>Modify shipment status and tracking information</p>
      </div>

      <div style={styles.contentContainer}>
        {error && (
          <div style={styles.errorMessage}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {success && (
          <div style={styles.successMessage}>
            <strong>Success:</strong> Shipment updated successfully! Redirecting...
          </div>
        )}

        {/* Shipment Information */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Shipment Information</h3>
          <div style={styles.infoGrid}>
            <div style={styles.infoCard}>
              <div style={styles.infoLabel}>Shipment ID</div>
              <div style={styles.shipmentId}>
                {shipment.shipmentId}
              </div>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.infoLabel}>Carrier</div>
              <div style={styles.carrier}>
                {shipment.carrier}
              </div>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.infoLabel}>Created Date</div>
              <div style={styles.infoValue}>
                {shipment.createdAt ? new Date(shipment.createdAt).toLocaleDateString() : 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Status Update */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Status Management</h3>
          <div style={styles.statusContainer}>
            <div>
              <div style={styles.infoLabel}>Current Status</div>
              <span 
                style={{
                  ...styles.currentStatusBadge,
                  backgroundColor: getStatusColor(shipment.status)
                }}
              >
                {shipment.status || 'Pending'}
              </span>
            </div>
            <div>
              <div style={styles.infoLabel}>Update Status</div>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={styles.statusSelect}
                onFocus={(e) => {
                  e.target.style.borderColor = styles.statusSelectFocus.borderColor;
                  e.target.style.boxShadow = styles.statusSelectFocus.boxShadow;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = styles.statusSelect.borderColor;
                  e.target.style.boxShadow = "none";
                }}
                disabled={updating}
              >
                {statuses.map(s => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Information */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Products in Shipment</h3>
          {shipment.products && shipment.products.length > 0 ? (
            <div style={styles.productsList}>
              {shipment.products.map((product, index) => (
                <div key={product.product?._id || index} style={styles.productItem}>
                  <span style={styles.productName}>
                    {product.product?.productName || 'Unknown Product'}
                  </span>
                  <span style={styles.productQuantity}>
                    {product.quantity}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{color: '#6c757d', fontStyle: 'italic'}}>No products in this shipment</p>
          )}
        </div>

        {/* Summary */}
        <div style={styles.summaryCard}>
          <div style={styles.summaryTitle}>Total Items in Shipment</div>
          <div style={styles.summaryValue}>{getTotalQuantity()}</div>
        </div>

        {/* Action Buttons */}
        <div style={styles.buttonContainer}>
          <button
            onClick={() => navigate("/shipments")}
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
            {updating ? "Updating..." : "Update Shipment"}
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

export default ShipmentUpdate;