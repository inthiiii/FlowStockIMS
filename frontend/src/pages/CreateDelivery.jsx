import React, { useState, useEffect } from "react";

const CreateDelivery = () => {
  const [saleId, setSaleId] = useState("");
  const [partner, setPartner] = useState("");
  const [sales, setSales] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const partners = [
    "FastX Delivery",
    "BlueLine Couriers",
    "Urban Express",
    "SkyNet Logistics",
    "SwiftTrack",
  ];

  // fetch sales list from backend
  useEffect(() => {
    const fetchSales = async () => {
      try {
        // ✅ use relative path (proxy handles it)
        const res = await fetch("http://localhost:3000/api/sales");
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch sales");
        setSales(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchSales();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
  
    if (!saleId || !partner) {
      setError("Please fill all fields");
      setLoading(false);
      return;
    }
  
    try {
      const res = await fetch("http://localhost:3000/api/deliveries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ saleId, partner }),
      });
  
      const data = await res.json();
  
      if (!res.ok) throw new Error(data.message || "Failed to create delivery");
  
      setMessage(`Delivery created successfully with partner: ${partner}`);
      setSaleId("");
      setPartner("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
      overflow: "hidden",
    },
    buttonDisabled: {
      backgroundColor: "#6c757d",
      cursor: "not-allowed",
    },
    errorMessage: {
      backgroundColor: "#f8d7da",
      color: "#721c24",
      padding: "12px 16px",
      borderRadius: "8px",
      border: "1px solid #f5c6cb",
      fontSize: "0.95rem",
      fontWeight: "500",
    },
    successMessage: {
      backgroundColor: "#d1edff",
      color: "#0c5460",
      padding: "12px 16px",
      borderRadius: "8px",
      border: "1px solid #bee5eb",
      fontSize: "0.95rem",
      fontWeight: "500",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Create Delivery</h1>
        <p style={styles.subtitle}>Schedule delivery for a completed sale</p>
      </div>

      <div style={styles.formContainer}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Select Sale</label>
            <select
              value={saleId}
              onChange={(e) => setSaleId(e.target.value)}
              style={styles.select}
              disabled={loading}
            >
              <option value="">Select a sale</option>
              {sales.map((s) => (
                <option key={s._id} value={s._id}>
                  {s._id} — {s.product?.name || "Unnamed Product"}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Select Delivery Partner</label>
            <select
              value={partner}
              onChange={(e) => setPartner(e.target.value)}
              style={styles.select}
              disabled={loading}
            >
              <option value="">Select a delivery partner</option>
              {partners.map((p, i) => (
                <option key={i} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {error && <div style={styles.errorMessage}>Error: {error}</div>}
          {message && <div style={styles.successMessage}>{message}</div>}

          <button
            type="submit"
            style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }}
            disabled={loading}
          >
            {loading ? "Creating Delivery..." : "Create Delivery"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateDelivery;