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
        if (!response.ok) {
          throw new Error("Sale not found");
        }
        const data = await response.json();
        setSale(data);
        setError("");
      } catch (err) {
        console.error("Error fetching sale:", err);
        setError("Failed to load sale details");
      } finally {
        setLoading(false);
      }
    };

    fetchSale();
  }, [id]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid': return '#28a745';
      case 'pending': return '#ffc107';
      case 'cancelled': return '#dc3545';
      case 'refunded': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  const styles = {
    container: {
      maxWidth: "900px",
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
    detailsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "25px",
      marginBottom: "30px",
    },
    detailCard: {
      backgroundColor: "#ffffff",
      padding: "20px",
      borderRadius: "10px",
      border: "1px solid #e9ecef",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
    },
    cardTitle: {
      color: "#023E8A",
      fontSize: "1.2rem",
      fontWeight: "600",
      marginBottom: "15px",
      paddingBottom: "10px",
      borderBottom: "2px solid #e9ecef",
    },
    detailRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "12px",
      padding: "8px 0",
    },
    detailLabel: {
      fontSize: "0.95rem",
      fontWeight: "600",
      color: "#6c757d",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    detailValue: {
      fontSize: "1rem",
      fontWeight: "500",
      color: "#495057",
      textAlign: "right",
    },
    customerName: {
      color: "#023E8A",
      fontWeight: "600",
      fontSize: "1.1rem",
    },
    email: {
      color: "#0066cc",
      textDecoration: "none",
      fontSize: "1rem",
    },
    productName: {
      color: "#023E8A",
      fontWeight: "600",
      fontSize: "1.1rem",
    },
    quantity: {
      backgroundColor: "#023E8A",
      color: "#ffffff",
      padding: "4px 10px",
      borderRadius: "12px",
      fontSize: "0.9rem",
      fontWeight: "600",
    },
    totalAmount: {
      fontSize: "1.3rem",
      fontWeight: "700",
      color: "#28a745",
      fontFamily: "monospace",
    },
    statusBadge: {
      padding: "6px 12px",
      borderRadius: "20px",
      fontSize: "0.85rem",
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      color: "#ffffff",
      display: "inline-block",
    },
    summaryCard: {
      backgroundColor: "#ffffff",
      padding: "25px",
      borderRadius: "10px",
      border: "1px solid #e9ecef",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
      textAlign: "center",
      marginBottom: "30px",
    },
    summaryTitle: {
      color: "#023E8A",
      fontSize: "1.1rem",
      fontWeight: "600",
      marginBottom: "10px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    summaryAmount: {
      fontSize: "2.5rem",
      fontWeight: "700",
      color: "#28a745",
      margin: "0",
      fontFamily: "monospace",
    },
    actionsContainer: {
      display: "flex",
      gap: "15px",
      justifyContent: "center",
      flexWrap: "wrap",
    },
    receiptButton: {
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
      textDecoration: "none",
      display: "inline-block",
    },
    receiptButtonHover: {
      backgroundColor: "#012a5c",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(2, 62, 138, 0.3)",
    },
    editButton: {
      backgroundColor: "#28a745",
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
      textDecoration: "none",
      display: "inline-block",
    },
    editButtonHover: {
      backgroundColor: "#218838",
      transform: "translateY(-2px)",
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
    errorContainer: {
      textAlign: "center",
      padding: "60px 20px",
      color: "#dc3545",
      backgroundColor: "#f8d7da",
      border: "1px solid #f5c6cb",
      borderRadius: "12px",
      margin: "20px 0",
    },
    errorTitle: {
      fontSize: "1.5rem",
      fontWeight: "600",
      marginBottom: "10px",
      color: "#721c24",
    },
    saleId: {
      fontFamily: "monospace",
      backgroundColor: "#f8f9fa",
      padding: "4px 8px",
      borderRadius: "4px",
      fontSize: "0.9rem",
      color: "#495057",
    },
    timestamp: {
      fontSize: "0.9rem",
      color: "#6c757d",
      fontStyle: "italic",
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <div style={styles.loadingText}>Loading sale details...</div>
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

  if (error || !sale) {
    return (
      <div style={styles.container}>
        <button 
          style={styles.backButton}
          onClick={() => navigate("/sales/list")}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = styles.backButtonHover.backgroundColor;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = styles.backButton.backgroundColor;
          }}
        >
          ← Back to Sales
        </button>
        <div style={styles.errorContainer}>
          <div style={styles.errorTitle}>Sale Not Found</div>
          <p>{error || "The requested sale could not be found."}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <button 
        style={styles.backButton}
        onClick={() => navigate("/sales/list")}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = styles.backButtonHover.backgroundColor;
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = styles.backButton.backgroundColor;
        }}
      >
        ← Back to Sales
      </button>

      <div style={styles.header}>
        <h1 style={styles.title}>Sale Details</h1>
        <p style={styles.subtitle}>Complete transaction information and actions</p>
        {sale._id && (
          <p style={styles.timestamp}>
            Sale ID: <span style={styles.saleId}>{sale._id}</span>
          </p>
        )}
      </div>

      <div style={styles.contentContainer}>
        {/* Summary Card */}
        <div style={styles.summaryCard}>
          <div style={styles.summaryTitle}>Total Amount</div>
          <div style={styles.summaryAmount}>
            {formatCurrency(sale.totalAmount)}
          </div>
        </div>

        {/* Details Grid */}
        <div style={styles.detailsGrid}>
          {/* Customer Information */}
          <div style={styles.detailCard}>
            <h3 style={styles.cardTitle}>Customer Information</h3>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Name</span>
              <span style={{...styles.detailValue, ...styles.customerName}}>
                {sale.customerName || 'N/A'}
              </span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Email</span>
              <a 
                href={`mailto:${sale.customerEmail}`} 
                style={{...styles.detailValue, ...styles.email}}
              >
                {sale.customerEmail || 'N/A'}
              </a>
            </div>
            {sale.customerPhone && (
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Phone</span>
                <a 
                  href={`tel:${sale.customerPhone}`} 
                  style={{...styles.detailValue, ...styles.email}}
                >
                  {sale.customerPhone}
                </a>
              </div>
            )}
          </div>

          {/* Product Information */}
          <div style={styles.detailCard}>
            <h3 style={styles.cardTitle}>Product Information</h3>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Product</span>
              <span style={{...styles.detailValue, ...styles.productName}}>
                {sale.product?.productName || 'N/A'}
              </span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Quantity</span>
              <span style={styles.quantity}>
                {sale.quantity || 0}
              </span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Unit Price</span>
              <span style={styles.detailValue}>
                {formatCurrency(sale.pricePerUnit || 0)}
              </span>
            </div>
          </div>

          {/* Transaction Information */}
          <div style={styles.detailCard}>
            <h3 style={styles.cardTitle}>Transaction Details</h3>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Status</span>
              <span 
                style={{
                  ...styles.statusBadge,
                  backgroundColor: getStatusColor(sale.paymentStatus)
                }}
              >
                {sale.paymentStatus || 'Pending'}
              </span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Date</span>
              <span style={styles.detailValue}>
                {sale.saleDate ? new Date(sale.saleDate).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Total</span>
              <span style={{...styles.detailValue, ...styles.totalAmount}}>
                {formatCurrency(sale.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={styles.actionsContainer}>
          <Link 
            to={`/sales/${id}/receipt`}
            style={styles.receiptButton}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = styles.receiptButtonHover.backgroundColor;
              e.target.style.transform = styles.receiptButtonHover.transform;
              e.target.style.boxShadow = styles.receiptButtonHover.boxShadow;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = styles.receiptButton.backgroundColor;
              e.target.style.transform = "none";
              e.target.style.boxShadow = "none";
            }}
          >
            View Receipt
          </Link>
          <Link 
            to={`/sales/edit/${id}`}
            style={styles.editButton}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = styles.editButtonHover.backgroundColor;
              e.target.style.transform = styles.editButtonHover.transform;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = styles.editButton.backgroundColor;
              e.target.style.transform = "none";
            }}
          >
            Edit Sale
          </Link>
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

export default SaleDetailsPage;