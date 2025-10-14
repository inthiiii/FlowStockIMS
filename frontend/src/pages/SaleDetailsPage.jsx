import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

const SaleDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSale = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/api/sales/${id}`);
        if (!response.ok) throw new Error("Sale not found or an error occurred.");
        const data = await response.json();
        setSale(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSale();
  }, [id]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid': return { bg: '#dcfce7', text: '#166534' }; // Green
      case 'pending': return { bg: '#fefce8', text: '#854d0e' }; // Yellow
      case 'cancelled': return { bg: '#fee2e2', text: '#991b1b' }; // Red
      case 'refunded': return { bg: '#f1f5f9', text: '#334155' }; // Gray
      default: return { bg: '#f1f5f9', text: '#334155' };
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
    }).format(amount || 0);
  };

  const styles = {
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "100px 30px 50px", // Pushed content down for floating nav
      background: "linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%)",
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
      fontSize: "3rem",
      fontWeight: "700",
      letterSpacing: "-1px",
      margin: "0 0 12px 0",
    },
    subtitle: {
      color: "#64748b",
      fontSize: "1.15rem",
      margin: "0",
    },
    saleId: {
      fontFamily: "monospace",
      backgroundColor: "#e2e8f0",
      padding: "4px 10px",
      borderRadius: "6px",
      fontSize: "0.9rem",
      color: "#475569",
      display: "inline-block",
      marginTop: "12px",
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
    contentContainer: {
      backgroundColor: "#ffffff",
      padding: "40px",
      borderRadius: "20px",
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)",
      border: "1px solid #e2e8f0",
      animation: "fadeInUp 0.8s ease-out",
    },
    summaryCard: {
      textAlign: "center",
      marginBottom: "40px",
      padding: "25px",
      background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
      borderRadius: "16px",
      border: "1px solid #e2e8f0",
    },
    summaryTitle: {
      fontSize: "1rem",
      color: "#64748b",
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      marginBottom: "8px",
    },
    summaryAmount: {
      fontSize: "3rem",
      color: "#16a34a",
      fontWeight: "700",
      lineHeight: "1.1",
    },
    detailsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
      gap: "25px",
      marginBottom: "40px",
    },
    detailCard: {
      background: "#f8fafc",
      padding: "25px",
      borderRadius: "16px",
      border: "1px solid #e2e8f0",
    },
    cardTitle: {
      color: "#023E8A",
      fontSize: "1.25rem",
      fontWeight: "600",
      marginBottom: "20px",
      paddingBottom: "12px",
      borderBottom: "1px solid #e2e8f0",
    },
    detailRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 0",
      borderBottom: "1px solid #f1f5f9",
    },
    detailLabel: {
      fontSize: "0.9rem",
      fontWeight: "500",
      color: "#64748b",
    },
    detailValue: {
      fontSize: "1rem",
      fontWeight: "600",
      color: "#1e293b",
      textAlign: "right",
    },
    statusBadge: {
      padding: "6px 14px",
      borderRadius: "20px",
      fontSize: "0.8rem",
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    actionsContainer: {
      display: "flex",
      gap: "15px",
      justifyContent: "center",
    },
    actionButton: {
      color: "#ffffff",
      padding: "14px 28px",
      border: "none",
      borderRadius: "10px",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      textDecoration: "none",
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      transition: "all 0.3s ease",
    },
    loadingContainer: {
      textAlign: "center",
      padding: "120px 20px",
    },
    errorContainer: {
      textAlign: "center",
      padding: "60px 20px",
      backgroundColor: "#fee2e2",
      border: "1px solid #fecaca",
      borderRadius: "16px",
      color: "#991b1b",
    },
  };

  const styleSheet = `
    @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    a, button { transition: all 0.3s ease; }
    a:hover, button:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15); }
    a:active, button:active { transform: translateY(-1px); }
  `;

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>Loading sale details...</div>
      </div>
    );
  }

  if (error || !sale) {
    return (
      <div style={styles.container}>
        <style>{styleSheet}</style>
        <Link to="/sales/list" style={styles.backButton}>← Back to Sales</Link>
        <div style={styles.errorContainer}>
          <h2 style={{marginTop: 0}}>Sale Not Found</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const statusStyle = getStatusColor(sale.paymentStatus);

  return (
    <div style={styles.container}>
      <style>{styleSheet}</style>
      <Link to="/sales/list" style={styles.backButton}>← Back to Sales</Link>

      <div style={styles.header}>
        <h1 style={styles.title}>Sale Details</h1>
        <p style={styles.subtitle}>Complete transaction information and actions</p>
        <span style={styles.saleId}>ID: {sale._id}</span>
      </div>

      <div style={styles.contentContainer}>
        <div style={styles.summaryCard}>
          <div style={styles.summaryTitle}>Total Amount</div>
          <div style={styles.summaryAmount}>{formatCurrency(sale.totalAmount)}</div>
        </div>

        <div style={styles.detailsGrid}>
          {/* Customer & Transaction */}
          <div style={styles.detailCard}>
            <h3 style={styles.cardTitle}>Transaction Info</h3>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Customer Name</span>
              <span style={styles.detailValue}>{sale.customerName || 'N/A'}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Customer Email</span>
              <a href={`mailto:${sale.customerEmail}`} style={{...styles.detailValue, color: '#023E8A', textDecoration: 'none'}}>{sale.customerEmail || 'N/A'}</a>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Sale Date</span>
              <span style={styles.detailValue}>{new Date(sale.saleDate).toLocaleDateString()}</span>
            </div>
            <div style={{...styles.detailRow, borderBottom: 'none'}}>
              <span style={styles.detailLabel}>Payment Status</span>
              <span style={{...styles.statusBadge, backgroundColor: statusStyle.bg, color: statusStyle.text}}>
                {sale.paymentStatus || 'Pending'}
              </span>
            </div>
          </div>

          {/* Product Details */}
          <div style={styles.detailCard}>
            <h3 style={styles.cardTitle}>Product Details</h3>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Product</span>
              <span style={styles.detailValue}>{sale.product?.productName || 'N/A'}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Quantity Sold</span>
              <span style={styles.detailValue}>{sale.quantity} units</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Price Per Unit</span>
              <span style={styles.detailValue}>{formatCurrency(sale.pricePerUnit)}</span>
            </div>
            <div style={{...styles.detailRow, borderBottom: 'none'}}>
              <span style={{...styles.detailLabel, fontWeight: '700'}}>Total Amount</span>
              <span style={{...styles.detailValue, color: '#16a34a', fontSize: '1.2rem'}}>{formatCurrency(sale.totalAmount)}</span>
            </div>
          </div>
        </div>

        <div style={styles.actionsContainer}>
          <Link to={`/sales/${id}/receipt`} style={{...styles.actionButton, background: 'linear-gradient(135deg, #023E8A 0%, #0353b8 100%)'}}>
            🖨️ View Receipt
          </Link>
          <Link to={`/sales/edit/${id}`} style={{...styles.actionButton, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'}}>
            ✏️ Edit Sale
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SaleDetailsPage;