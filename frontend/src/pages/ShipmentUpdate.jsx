// src/pages/ShipmentUpdate.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import { useParams, useNavigate } from "react-router-dom";

const ShipmentUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const statuses = [
    { value: "pending", label: "Pending", color: "#64748b", bg: "#f1f5f9" },
    { value: "shipped", label: "Shipped", color: "#059669", bg: "#d1fae5" },
    { value: "in-transit", label: "In Transit", color: "#d97706", bg: "#fef3c7" },
    { value: "delivered", label: "Delivered", color: "#0284c7", bg: "#e0f2fe" },
    { value: "cancelled", label: "Cancelled", color: "#dc2626", bg: "#fee2e2" }
  ];

  useEffect(() => {
    const fetchShipment = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/shipments/${id}`);
        setShipment(data);
        setStatus(data.status || "pending");
      } catch (err) {
        console.error(err);
        setError("Failed to load shipment details. It may have been deleted or does not exist.");
      } finally {
        setLoading(false);
      }
    };
    fetchShipment();
  }, [id]);

  const handleUpdate = async () => {
    setUpdating(true);
    setError("");
    setSuccess(false);
    try {
      await api.put(`/shipments/${id}`, { status });
      setSuccess(true);
      setTimeout(() => {
        navigate("/shipments/control");
      }, 2000);
    } catch (err) {
      console.error(err);
      setError("Failed to update shipment status. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusStyle = (statusValue) => {
    const statusObj = statuses.find(s => s.value === statusValue) || statuses[0];
    return {
      color: statusObj.color,
      backgroundColor: statusObj.bg,
      border: `1px solid ${statusObj.color}`
    };
  };

  const totalQuantity = shipment?.products?.reduce((total, p) => total + p.quantity, 0) || 0;

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
      animation: "fadeInDown 0.6s ease-out"
    },
    title: {
      color: "#023E8A",
      fontSize: "3rem",
      fontWeight: "700",
      margin: "0 0 12px 0",
      letterSpacing: "-1px",
    },
    subtitle: {
      color: "#64748b",
      fontSize: "1.15rem",
    },
    mainContent: {
      backgroundColor: "#ffffff",
      padding: "40px",
      borderRadius: "20px",
      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
      animation: "fadeInUp 0.7s ease-out"
    },
    section: {
      marginBottom: "35px",
    },
    sectionTitle: {
      fontSize: "1.25rem",
      fontWeight: "600",
      color: "#1e293b",
      paddingBottom: "15px",
      borderBottom: "2px solid #f1f5f9",
      marginBottom: "25px",
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    infoGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "25px",
    },
    infoCard: {
      background: "#f8fafc",
      padding: "20px",
      borderRadius: "12px",
      border: "1px solid #e2e8f0",
    },
    infoLabel: {
      fontSize: "0.875rem",
      fontWeight: "500",
      color: "#64748b",
      marginBottom: "8px",
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    infoValue: {
      fontSize: "1.1rem",
      fontWeight: "600",
      color: "#023E8A",
    },
    infoValueMono: {
        fontFamily: "'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace",
        backgroundColor: '#eef2ff',
        padding: '4px 8px',
        borderRadius: '6px',
        display: 'inline-block',
        color: '#4338ca'
    },
    statusBadge: {
      padding: "8px 16px",
      borderRadius: "20px",
      fontSize: "0.9rem",
      fontWeight: "600",
      display: "inline-block",
      textTransform: "capitalize",
    },
    select: {
      padding: "14px 18px",
      border: "2px solid #e2e8f0",
      borderRadius: "10px",
      fontSize: "1rem",
      backgroundColor: "#ffffff",
      outline: "none",
      cursor: "pointer",
      width: '100%',
      maxWidth: '300px',
      transition: 'all 0.3s ease',
    },
    selectFocus: {
        borderColor: "#023E8A",
        boxShadow: "0 0 0 3px rgba(2, 62, 138, 0.1)",
    },
    productList: {
        listStyle: 'none',
        padding: '0',
        margin: '0',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    productItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px',
        backgroundColor: '#f8fafc',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
    },
    productName: {
        fontWeight: '500',
        color: '#1e293b'
    },
    productQuantity: {
        backgroundColor: '#023E8A',
        color: 'white',
        fontWeight: '700',
        fontSize: '0.875rem',
        padding: '5px 12px',
        borderRadius: '20px',
        minWidth: '40px',
        textAlign: 'center'
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "15px",
      marginTop: "40px",
      borderTop: '2px solid #f1f5f9',
      paddingTop: '25px'
    },
    button: {
      padding: "14px 28px",
      border: "none",
      borderRadius: "10px",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: 'center',
      gap: "8px",
    },
    updateButton: {
      background: "linear-gradient(135deg, #023E8A 0%, #0353b8 100%)",
      color: "#ffffff",
      boxShadow: "0 4px 12px rgba(2, 62, 138, 0.3)",
    },
    cancelButton: {
        backgroundColor: '#e2e8f0',
        color: '#334155',
    },
    buttonDisabled: {
      background: "#94a3b8",
      cursor: "not-allowed",
      boxShadow: "none",
      transform: 'none',
    },
    loadingContainer: {
      textAlign: "center",
      padding: "100px 20px",
    },
    loadingSpinner: {
        width: "60px",
        height: "60px",
        border: "5px solid #e2e8f0",
        borderTop: "5px solid #023E8A",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
        margin: "0 auto 25px auto",
    },
    loadingText: {
        color: "#64748b",
        fontSize: "1.2rem",
        fontWeight: "500"
    },
    message: {
        padding: "16px 20px",
        borderRadius: "10px",
        border: "1px solid transparent",
        fontSize: "1rem",
        fontWeight: "500",
        marginBottom: "25px",
        textAlign: "center",
        animation: 'fadeInUp 0.5s ease-out'
    },
    errorMessage: {
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        color: "#b91c1c",
        borderColor: "rgba(239, 68, 68, 0.2)",
    },
    successMessage: {
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        color: "#15803d",
        borderColor: "rgba(34, 197, 94, 0.2)",
    },
    buttonSpinner: {
        width: "20px",
        height: "20px",
        border: "3px solid rgba(255, 255, 255, 0.3)",
        borderTopColor: "#ffffff",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
    },
  };

  const styleSheet = `
    @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes spin { to { transform: rotate(360deg); } }
    .action-button:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.15); }
    .action-button:active:not(:disabled) { transform: translateY(0); }
  `;

  if (loading) {
    return (
      <div style={styles.container}>
        <style>{styleSheet}</style>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <div style={styles.loadingText}>Loading Shipment Details...</div>
        </div>
      </div>
    );
  }

  if (!shipment) {
    return (
      <div style={styles.container}>
        <style>{styleSheet}</style>
        <div style={{...styles.message, ...styles.errorMessage}}>
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{styleSheet}</style>
      <header style={styles.header}>
        <h1 style={styles.title}>Update Shipment</h1>
        <p style={styles.subtitle}>Manage the status and details of the shipment</p>
      </header>
      
      <div style={styles.mainContent}>
        {error && <div style={{...styles.message, ...styles.errorMessage}}>{error}</div>}
        {success && <div style={{...styles.message, ...styles.successMessage}}>Status updated! Redirecting...</div>}

        {/* Shipment Info Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <span>📦</span>
            Shipment Details
          </h2>
          <div style={styles.infoGrid}>
            <div style={styles.infoCard}>
              <div style={styles.infoLabel}>Shipment ID</div>
              <div style={{...styles.infoValue, ...styles.infoValueMono}}>{shipment.shipmentId}</div>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.infoLabel}>Carrier</div>
              <div style={styles.infoValue}>{shipment.carrier}</div>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.infoLabel}>Created On</div>
              <div style={styles.infoValue}>{new Date(shipment.createdAt).toLocaleDateString()}</div>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.infoLabel}>Total Items</div>
              <div style={styles.infoValue}>{totalQuantity}</div>
            </div>
          </div>
        </div>

        {/* Status Management Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <span>🔄</span>
            Status Management
          </h2>
          <div style={{display: 'flex', gap: '30px', alignItems: 'center', flexWrap: 'wrap'}}>
            <div style={styles.infoCard}>
              <div style={styles.infoLabel}>Current Status</div>
              <div style={{...styles.statusBadge, ...getStatusStyle(shipment.status)}}>
                {shipment.status}
              </div>
            </div>
            <div>
              <div style={styles.infoLabel}>Change Status To</div>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{...styles.select, ...(focusedField === 'status' && styles.selectFocus)}}
                onFocus={() => setFocusedField('status')} 
                onBlur={() => setFocusedField(null)}
                disabled={updating}
              >
                {statuses.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
             <span>📋</span>
             Products in Shipment
          </h2>
          <ul style={styles.productList}>
            {shipment.products?.map((p, i) => (
              <li key={p.product?._id || i} style={styles.productItem}>
                <span style={styles.productName}>{p.product?.productName || 'Product not found'}</span>
                <span style={styles.productQuantity}>Qty: {p.quantity}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Action Buttons */}
        <div style={styles.buttonContainer}>
          <button
            onClick={() => navigate("/shipments/control")}
            style={{...styles.button, ...styles.cancelButton}}
            disabled={updating}
            className="action-button"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            style={{...styles.button, ...styles.updateButton, ...(updating && styles.buttonDisabled)}}
            disabled={updating}
            className="action-button"
          >
            {updating ? <span style={styles.buttonSpinner}></span> : <span>✓</span>}
            {updating ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShipmentUpdate;
