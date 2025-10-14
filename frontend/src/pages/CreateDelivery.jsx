import React, { useState, useEffect } from "react";

const CreateDelivery = () => {
  const [saleId, setSaleId] = useState("");
  const [partner, setPartner] = useState("");
  const [location, setLocation] = useState("");
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

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/sales");
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch sales");
        // Filter sales to show only those not yet associated with a delivery, if applicable
        // For now, showing all sales as per original logic.
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

    if (!saleId || !partner || !location) {
      setError("Please fill out all fields to create a delivery.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/deliveries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ saleId, partner, location }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create delivery");

      setMessage(`Delivery scheduled successfully for Sale ID ${saleId} with ${partner}.`);
      setSaleId("");
      setPartner("");
      setLocation("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: "900px",
      margin: "0 auto",
      padding: "100px 30px 50px", // Pushed content down for floating nav
      background: "linear-gradient(135deg, #f5f7fa 0%, #e8efp5 100%)",
      minHeight: "100vh",
      fontFamily: "'Inter', sans-serif",
    },
    header: {
      textAlign: "center",
      marginBottom: "40px",
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
      margin: "0",
    },
    formContainer: {
      backgroundColor: "#ffffff",
      padding: "40px",
      borderRadius: "20px",
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)",
      border: "1px solid #e2e8f0",
      animation: "fadeInUp 0.8s ease-out",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "25px",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    label: {
      fontSize: "0.875rem",
      fontWeight: "600",
      color: "#1e293b",
    },
    input: {
      padding: "14px 18px",
      border: "2px solid #e2e8f0",
      borderRadius: "10px",
      fontSize: "1rem",
      outline: "none",
      transition: "all 0.3s ease",
    },
    select: {
      padding: "14px 18px",
      border: "2px solid #e2e8f0",
      borderRadius: "10px",
      fontSize: "1rem",
      outline: "none",
      cursor: "pointer",
      appearance: "none",
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23023E8A' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 18px center",
      transition: "all 0.3s ease",
    },
    button: {
      background: "linear-gradient(135deg, #023E8A 0%, #0353b8 100%)",
      color: "#ffffff",
      padding: "16px",
      border: "none",
      borderRadius: "10px",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      marginTop: "10px",
      transition: "all 0.3s ease",
    },
    buttonDisabled: {
      background: "linear-gradient(135deg, #94a3b8 0%, #64748b 100%)",
      cursor: "not-allowed",
    },
    message: {
      padding: "15px",
      borderRadius: "10px",
      textAlign: "center",
      fontWeight: "500",
      backgroundColor: "#dcfce7",
      color: "#166534",
      border: "1px solid #bbf7d0",
    },
    error: {
      padding: "15px",
      borderRadius: "10px",
      textAlign: "center",
      fontWeight: "500",
      backgroundColor: "#fee2e2",
      color: "#991b1b",
      border: "1px solid #fecaca",
    },
  };

  const styleSheet = `
    @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    input:focus, select:focus { border-color: #023E8A !important; box-shadow: 0 0 0 3px rgba(2, 62, 138, 0.1) !important; }
    button:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15); }
    button:active { transform: translateY(-1px); }
  `;

  return (
    <div style={styles.container}>
      <style>{styleSheet}</style>
      <div style={styles.header}>
        <h1 style={styles.title}>Create New Delivery</h1>
        <p style={styles.subtitle}>Assign a delivery partner and location to a completed sale.</p>
      </div>

      <div style={styles.formContainer}>
        <form onSubmit={handleSubmit} style={styles.form}>
          {error && <div style={styles.error}>{error}</div>}
          {message && <div style={styles.message}>{message}</div>}

          <div style={styles.formGroup}>
            <label style={styles.label}>Select Sale</label>
            <select
              value={saleId}
              onChange={(e) => setSaleId(e.target.value)}
              style={styles.select}
              disabled={loading}
              required
            >
              <option value="">-- Choose a Sale Record --</option>
              {sales.map((s) => (
                <option key={s._id} value={s._id}>
                  ID: {s._id.slice(-8)} — {s.product?.productName || "Product"} ({s.quantity} units)
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Delivery Partner</label>
            <select
              value={partner}
              onChange={(e) => setPartner(e.target.value)}
              style={styles.select}
              disabled={loading}
              required
            >
              <option value="">-- Assign a Partner --</option>
              {partners.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Delivery Location / Address</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., 123 Main Street, Colombo 05"
              style={styles.input}
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }}
            disabled={loading}
          >
            {loading ? "Scheduling..." : "Schedule Delivery"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateDelivery;