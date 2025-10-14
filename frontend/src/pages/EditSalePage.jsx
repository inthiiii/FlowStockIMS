import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditSalePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sale, setSale] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    quantity: "",
    pricePerUnit: "",
    paymentStatus: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSale = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/sales/${id}`);
        if (!response.ok) throw new Error("Failed to fetch sale details");
        const data = await response.json();
        setSale(data);
      } catch (err) {
        setError("Error loading sale details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchSale();
  }, [id]);

  const handleChange = (e) => {
    setSale({ ...sale, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const response = await fetch(`http://localhost:3000/api/sales/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...sale,
          quantity: Number(sale.quantity),
          pricePerUnit: Number(sale.pricePerUnit),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update sale");
      }
      
      setMessage("Sale updated successfully!");
      setTimeout(() => navigate(`/sales/${id}`), 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  const styles = {
    container: {
      maxWidth: "900px",
      margin: "0 auto",
      padding: "100px 30px 50px", // Pushed content down for floating nav
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
      margin: 0,
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
      transition: "all 0.3s ease",
    },
    formContainer: {
      backgroundColor: "#ffffff",
      padding: "40px",
      borderRadius: "20px",
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)",
      border: "1px solid #e2e8f0",
      animation: "fadeInUp 0.8s ease-out",
    },
    formGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "25px",
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    inputGroupFull: {
      gridColumn: "1 / -1",
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
      width: "100%",
      boxSizing: "border-box",
      transition: "all 0.3s ease",
    },
    select: {
      padding: "14px 18px",
      border: "2px solid #e2e8f0",
      borderRadius: "10px",
      fontSize: "1rem",
      width: "100%",
      boxSizing: "border-box",
      transition: "all 0.3s ease",
      cursor: "pointer",
    },
    submitButton: {
      background: "linear-gradient(135deg, #023E8A 0%, #0353b8 100%)",
      color: "#ffffff",
      padding: "16px",
      border: "none",
      borderRadius: "10px",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      width: "100%",
      marginTop: "10px",
      transition: "all 0.3s ease",
    },
    message: {
      padding: "15px",
      marginBottom: "20px",
      borderRadius: "10px",
      textAlign: "center",
      fontWeight: "500",
      backgroundColor: "#dcfce7",
      color: "#166534",
      border: "1px solid #bbf7d0",
    },
    error: {
      padding: "15px",
      marginBottom: "20px",
      borderRadius: "10px",
      textAlign: "center",
      fontWeight: "500",
      backgroundColor: "#fee2e2",
      color: "#991b1b",
      border: "1px solid #fecaca",
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
    input:focus, select:focus { border-color: #023E8A !important; box-shadow: 0 0 0 3px rgba(2, 62, 138, 0.1) !important; outline: none; }
    button:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15); }
    button:active { transform: translateY(-1px); }
  `;

  if (loading) {
    return <div style={styles.loadingContainer}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <style>{styleSheet}</style>

      <button style={styles.backButton} onClick={() => navigate(`/sales/${id}`)}>
        ← Back to Details
      </button>

      <div style={styles.header}>
        <h1 style={styles.title}>Edit Sale</h1>
      </div>

      <div style={styles.formContainer}>
        {message && <p style={styles.message}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Customer Name</label>
              <input type="text" name="customerName" value={sale.customerName || ""} onChange={handleChange} style={styles.input} required />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Customer Email</label>
              <input type="email" name="customerEmail" value={sale.customerEmail || ""} onChange={handleChange} style={styles.input} required />
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Customer Phone</label>
              <input type="text" name="customerPhone" value={sale.customerPhone || ""} onChange={handleChange} style={styles.input} />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Quantity</label>
              <input type="number" name="quantity" value={sale.quantity || ""} onChange={handleChange} style={styles.input} required />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Price per Unit (LKR)</label>
              <input type="number" name="pricePerUnit" value={sale.pricePerUnit || ""} onChange={handleChange} style={styles.input} step="0.01" required />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Payment Status</label>
              <select name="paymentStatus" value={sale.paymentStatus || ""} onChange={handleChange} style={styles.select} required>
                <option value="" disabled>Select Status</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>
            
            <div style={{...styles.inputGroup, ...styles.inputGroupFull}}>
              <button type="submit" style={styles.submitButton}>
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSalePage;