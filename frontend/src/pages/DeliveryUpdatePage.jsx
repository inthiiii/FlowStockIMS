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
    { value: "Pending", label: "Pending" },
    { value: "Shipped", label: "Shipped" },
    { value: "In-Transit", label: "In Transit" },
    { value: "Delivered", label: "Delivered" },
    { value: "Cancelled", label: "Cancelled" },
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
    setSuccess(false);
    try {
      const res = await fetch(`http://localhost:3000/api/deliveries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update delivery");
      setSuccess(true);
      setTimeout(() => navigate("/deliveries/list"), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusStyle = (statusValue) => {
    switch (statusValue?.toLowerCase()) {
      case 'delivered': return { bg: '#dcfce7', text: '#166534' };
      case 'in-transit':
      case 'shipped': return { bg: '#fefce8', text: '#854d0e' };
      case 'cancelled': return { bg: '#fee2e2', text: '#991b1b' };
      case 'pending':
      default: return { bg: '#f1f5f9', text: '#334155' };
    }
  };
  
  const styles = {
    container: {
      maxWidth: "900px",
      margin: "0 auto",
      padding: "50px 30px",
      background: "linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%)",
      minHeight: "100vh",
      fontFamily: "'Inter', sans-serif",
    },
    header: {
      textAlign: "center",
      marginBottom: "30px",
      animation: "fadeInDown 0.6s ease-out",
    },
    title: {
      color: "#023E8A",
      fontSize: "2.8rem",
      fontWeight: "700",
      margin: "0 0 12px 0",
    },
    subtitle: {
      color: "#64748b",
      fontSize: "1.15rem",
    },
    backButton: {
      background: "#ffffff",
      color: "#475569",
      padding: "10px 20px",
      border: "1px solid #e2e8f0",
      borderRadius: "10px",
      fontSize: "0.9rem",
      fontWeight: "600",
      cursor: "pointer",
      textDecoration: "none",
      display: "inline-block",
      marginBottom: "20px",
    },
    contentContainer: {
      backgroundColor: "#ffffff",
      padding: "40px",
      borderRadius: "20px",
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)",
      border: "1px solid #e2e8f0",
      animation: "fadeInUp 0.8s ease-out",
    },
    section: {
      marginBottom: "30px",
    },
    sectionTitle: {
      color: "#023E8A",
      fontSize: "1.25rem",
      fontWeight: "600",
      paddingBottom: "12px",
      borderBottom: "1px solid #e2e8f0",
      marginBottom: "20px",
    },
    infoGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "20px",
    },
    infoItem: {
      background: "#f8fafc",
      padding: "15px",
      borderRadius: "10px",
      border: "1px solid #e2e8f0",
    },
    infoLabel: {
      fontSize: "0.875rem",
      fontWeight: "500",
      color: "#64748b",
      marginBottom: "6px",
      display: "block",
    },
    infoValue: {
      fontSize: "1rem",
      fontWeight: "600",
      color: "#1e293b",
    },
    saleId: {
      fontFamily: "monospace",
    },
    statusBadge: {
      padding: "6px 14px",
      borderRadius: "20px",
      fontSize: "0.8rem",
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      display: "inline-block",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    select: {
      padding: "14px 18px",
      border: "2px solid #e2e8f0",
      borderRadius: "10px",
      fontSize: "1rem",
      cursor: "pointer",
      appearance: "none",
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23023E8A' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 18px center",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "15px",
      marginTop: "30px",
      paddingTop: "20px",
      borderTop: "1px solid #e2e8f0",
    },
    actionButton: {
      padding: "12px 28px",
      border: "none",
      borderRadius: "10px",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    message: {
      padding: "15px",
      marginBottom: "20px",
      borderRadius: "10px",
      textAlign: "center",
      fontWeight: "500",
      border: "1px solid transparent",
    },
    loadingContainer: {
      textAlign: "center",
      padding: "120px 20px",
      color: "#64748b",
      fontSize: "1.2rem",
    },
  };

  const styleSheet = `
    @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    select:focus { border-color: #023E8A !important; box-shadow: 0 0 0 3px rgba(2, 62, 138, 0.1) !important; outline: none; }
    button:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15); }
    button:active:not(:disabled) { transform: translateY(-1px); }
  `;

  if (loading) {
    return <div style={styles.loadingContainer}>Loading Delivery Details...</div>;
  }
  
  const currentStatusStyle = getStatusStyle(delivery?.status);

  return (
    <div style={styles.container}>
      <style>{styleSheet}</style>
      <button style={styles.backButton} onClick={() => navigate("/deliveries/list")}>
        ← Back to Deliveries
      </button>

      <div style={styles.header}>
        <h1 style={styles.title}>Update Delivery Status</h1>
        <p style={styles.subtitle}>Manage and track the delivery process for a sale.</p>
      </div>

      <div style={styles.contentContainer}>
        {error && <div style={{...styles.message, backgroundColor: "#fee2e2", color: "#991b1b", borderColor: "#fecaca"}}>{error}</div>}
        {success && <div style={{...styles.message, backgroundColor: "#dcfce7", color: "#166534", borderColor: "#bbf7d0"}}>Delivery updated! Redirecting...</div>}

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Delivery Information</h2>
          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Sale ID</span>
              <span style={{...styles.infoValue, ...styles.saleId}}>{delivery?.sale?._id || 'N/A'}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Customer</span>
              <span style={styles.infoValue}>{delivery?.sale?.customerName || 'N/A'}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Product</span>
              <span style={styles.infoValue}>{delivery?.sale?.product?.productName || 'N/A'}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Partner</span>
              <span style={styles.infoValue}>{delivery?.partner || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Status Management</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <div>
              <span style={styles.infoLabel}>Current Status</span>
              <span style={{...styles.statusBadge, backgroundColor: currentStatusStyle.bg, color: currentStatusStyle.text}}>
                {delivery?.status || 'Pending'}
              </span>
            </div>
            <div style={{...styles.formGroup, flex: '1', minWidth: '250px'}}>
              <label style={styles.infoLabel}>Change Status To</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} style={styles.select} disabled={updating}>
                {statuses.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div style={styles.buttonContainer}>
          <button
            onClick={() => navigate("/deliveries/list")}
            style={{...styles.actionButton, background: '#f1f5f9', color: '#475569' }}
            disabled={updating}
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            style={{
              ...styles.actionButton, 
              background: 'linear-gradient(135deg, #023E8A 0%, #0353b8 100%)',
              color: '#ffffff',
              ...(updating && { background: '#94a3b8', cursor: 'not-allowed' })
            }}
            disabled={updating}
          >
            {updating ? "Updating..." : "Update Delivery"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryUpdatePage;