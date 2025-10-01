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

  // Fetch existing sale data
  useEffect(() => {
    const fetchSale = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/sales/${id}`);
        if (!response.ok) throw new Error("Failed to fetch sale details");
        const data = await response.json();
        setSale(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Error loading sale details");
        setLoading(false);
      }
    };
    fetchSale();
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    setSale({ ...sale, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/sales/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: sale.customerName,
          customerEmail: sale.customerEmail,
          customerPhone: sale.customerPhone,
          quantity: Number(sale.quantity),
          pricePerUnit: Number(sale.pricePerUnit),
          paymentStatus: sale.paymentStatus,
        }),
      });

      if (!response.ok) throw new Error("Failed to update sale");
      const updatedSale = await response.json();

      setMessage("Sale updated successfully!");
      setTimeout(() => navigate(`/sales/${id}`), 1500); // Redirect back to details page
    } catch (err) {
      console.error(err);
      setError("Error updating sale");
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
    title: {
      textAlign: "center",
      fontSize: "2rem",
      fontWeight: "600",
      color: "#023E8A",
      marginBottom: "30px",
    },
    form: {
      backgroundColor: "#f8f9fa",
      padding: "30px",
      borderRadius: "12px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      border: "1px solid #e9ecef",
    },
    label: {
      display: "block",
      fontSize: "1rem",
      fontWeight: "600",
      color: "#495057",
      marginBottom: "8px",
    },
    input: {
      width: "100%",
      padding: "10px",
      fontSize: "1rem",
      borderRadius: "6px",
      border: "1px solid #ced4da",
      marginBottom: "20px",
    },
    select: {
      width: "100%",
      padding: "10px",
      fontSize: "1rem",
      borderRadius: "6px",
      border: "1px solid #ced4da",
      marginBottom: "20px",
    },
    button: {
      backgroundColor: "#023E8A",
      color: "#fff",
      padding: "12px 25px",
      fontSize: "1rem",
      fontWeight: "600",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "block",
      width: "100%",
    },
    buttonHover: {
      backgroundColor: "#012a5c",
    },
    message: {
      color: "#28a745",
      textAlign: "center",
      marginBottom: "15px",
      fontWeight: "600",
    },
    error: {
      color: "#dc3545",
      textAlign: "center",
      marginBottom: "15px",
      fontWeight: "600",
    },
    backButton: {
      display: "inline-block",
      marginBottom: "20px",
      backgroundColor: "#6c757d",
      color: "#fff",
      padding: "10px 20px",
      borderRadius: "6px",
      textDecoration: "none",
      cursor: "pointer",
      fontWeight: "500",
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <p style={{ textAlign: "center", color: "#6c757d" }}>Loading sale details...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <button
        style={styles.backButton}
        onClick={() => navigate(`/sales/${id}`)}
      >
        ← Back to Sale Details
      </button>

      <h1 style={styles.title}>Edit Sale</h1>

      {message && <p style={styles.message}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}

      <form style={styles.form} onSubmit={handleSubmit}>
        <label style={styles.label}>Customer Name</label>
        <input
          type="text"
          name="customerName"
          value={sale.customerName || ""}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <label style={styles.label}>Customer Email</label>
        <input
          type="email"
          name="customerEmail"
          value={sale.customerEmail || ""}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <label style={styles.label}>Customer Phone</label>
        <input
          type="text"
          name="customerPhone"
          value={sale.customerPhone || ""}
          onChange={handleChange}
          style={styles.input}
        />

        <label style={styles.label}>Quantity</label>
        <input
          type="number"
          name="quantity"
          value={sale.quantity || ""}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <label style={styles.label}>Price per Unit (LKR)</label>
        <input
          type="number"
          name="pricePerUnit"
          value={sale.pricePerUnit || ""}
          onChange={handleChange}
          style={styles.input}
          step="0.01"
          required
        />

        <label style={styles.label}>Payment Status</label>
        <select
          name="paymentStatus"
          value={sale.paymentStatus || ""}
          onChange={handleChange}
          style={styles.select}
          required
        >
          <option value="">Select Status</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Refunded">Refunded</option>
        </select>

        <button
          type="submit"
          style={styles.button}
          onMouseEnter={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditSalePage;