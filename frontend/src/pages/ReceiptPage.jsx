import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ReceiptPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sale, setSale] = useState(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSale = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/api/sales/${id}`);
        if (!response.ok) {
          throw new Error("Receipt not found");
        }
        const data = await response.json();
        setSale(data);
      } catch (err) {
        console.error("Error fetching sale:", err);
        setError("Failed to load receipt");
      } finally {
        setLoading(false);
      }
    };

    fetchSale();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = async () => {
    if (!sale?.customerEmail) {
      setError("Customer email not available!");
      return;
    }

    setSending(true);
    setError("");
    setSent(false);

    try {
      const response = await fetch("http://localhost:3000/api/email/send-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: sale.customerEmail,
          from: "nationmotorscolombo@gmail.com",
          subject: `Your Sales Receipt - Nation Motors`,
          message: `
            <h3>Sales Receipt</h3>
            <p><b>Customer:</b> ${sale.customerName}</p>
            <p><b>Email:</b> ${sale.customerEmail}</p>
            <p><b>Product:</b> ${sale.product?.productName}</p>
            <p><b>Quantity:</b> ${sale.quantity}</p>
            <p><b>Price per Unit:</b> Rs.${sale.pricePerUnit}</p>
            <p><b>Total:</b> Rs.${sale.totalAmount}</p>
            <p><b>Date:</b> ${new Date(sale.saleDate).toLocaleDateString()}</p>
            <p>Thank you for your purchase!</p>
          `,
        }),
      });

      if (response.ok) {
        setSent(true);
        setTimeout(() => setSent(false), 5000);
      } else {
        const errData = await response.json();
        setError(errData.message || "Failed to send email");
      }
    } catch (err) {
      console.error(err);
      setError("Error sending email");
    } finally {
      setSending(false);
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
    receiptContainer: {
      backgroundColor: "#ffffff",
      border: "2px solid #e9ecef",
      borderRadius: "12px",
      maxWidth: "600px",
      margin: "0 auto",
      boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
    },
    receiptHeader: {
      backgroundColor: "#023E8A",
      color: "#ffffff",
      padding: "30px",
      textAlign: "center",
    },
    companyName: {
      fontSize: "2rem",
      fontWeight: "700",
      margin: "0 0 5px 0",
      letterSpacing: "1px",
    },
    companyTagline: {
      fontSize: "1rem",
      margin: "0",
      opacity: "0.9",
      fontWeight: "300",
    },
    receiptTitle: {
      fontSize: "1.5rem",
      fontWeight: "600",
      margin: "20px 0 0 0",
      textTransform: "uppercase",
      letterSpacing: "2px",
    },
    receiptBody: {
      padding: "40px 30px",
    },
    receiptInfo: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "30px",
      marginBottom: "30px",
    },
    infoSection: {
      backgroundColor: "#f8f9fa",
      padding: "20px",
      borderRadius: "8px",
      border: "1px solid #e9ecef",
    },
    sectionTitle: {
      fontSize: "1rem",
      fontWeight: "600",
      color: "#023E8A",
      marginBottom: "15px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      borderBottom: "2px solid #e9ecef",
      paddingBottom: "8px",
    },
    infoRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "10px",
      padding: "5px 0",
    },
    infoLabel: {
      fontSize: "0.9rem",
      fontWeight: "500",
      color: "#6c757d",
      flex: "1",
    },
    infoValue: {
      fontSize: "1rem",
      fontWeight: "600",
      color: "#495057",
      textAlign: "right",
      flex: "1",
    },
    divider: {
      height: "2px",
      backgroundColor: "#e9ecef",
      margin: "30px 0",
      border: "none",
    },
    totalSection: {
      backgroundColor: "#f8f9fa",
      padding: "25px",
      borderRadius: "8px",
      border: "2px solid #023E8A",
      textAlign: "center",
      marginBottom: "30px",
    },
    totalLabel: {
      fontSize: "1.2rem",
      fontWeight: "600",
      color: "#023E8A",
      marginBottom: "10px",
      textTransform: "uppercase",
      letterSpacing: "1px",
    },
    totalAmount: {
      fontSize: "2.5rem",
      fontWeight: "700",
      color: "#023E8A",
      margin: "0",
      fontFamily: "monospace",
    },
    thankYouMessage: {
      textAlign: "center",
      fontSize: "1.1rem",
      color: "#495057",
      fontStyle: "italic",
      marginBottom: "30px",
      padding: "20px",
      backgroundColor: "#e7f3ff",
      borderRadius: "8px",
      border: "1px solid #b3d9ff",
    },
    actionsContainer: {
      display: "flex",
      gap: "15px",
      justifyContent: "center",
      marginTop: "30px",
      flexWrap: "wrap",
    },
    printButton: {
      backgroundColor: "#28a745",
      color: "#ffffff",
      padding: "12px 25px",
      border: "none",
      borderRadius: "8px",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    printButtonHover: {
      backgroundColor: "#218838",
      transform: "translateY(-1px)",
    },
    emailButton: {
      backgroundColor: "#023E8A",
      color: "#ffffff",
      padding: "12px 25px",
      border: "none",
      borderRadius: "8px",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    emailButtonHover: {
      backgroundColor: "#012a5c",
      transform: "translateY(-1px)",
    },
    emailButtonDisabled: {
      backgroundColor: "#6c757d",
      cursor: "not-allowed",
      transform: "none",
    },
    statusMessage: {
      marginTop: "20px",
      padding: "12px 16px",
      borderRadius: "8px",
      fontSize: "0.95rem",
      fontWeight: "500",
      textAlign: "center",
    },
    successMessage: {
      backgroundColor: "#d1edff",
      color: "#0c5460",
      border: "1px solid #bee5eb",
    },
    errorMessage: {
      backgroundColor: "#f8d7da",
      color: "#721c24",
      border: "1px solid #f5c6cb",
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
    receiptNumber: {
      fontFamily: "monospace",
      backgroundColor: "#e9ecef",
      padding: "5px 10px",
      borderRadius: "4px",
      fontSize: "0.9rem",
    },
    dateStamp: {
      textAlign: "center",
      marginTop: "20px",
      padding: "10px",
      backgroundColor: "#f8f9fa",
      borderRadius: "6px",
      fontSize: "0.9rem",
      color: "#6c757d",
    },
    printHidden: {
      '@media print': {
        display: 'none',
      },
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <div style={styles.loadingText}>Loading receipt...</div>
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
              @media print {
                .print-hidden { display: none !important; }
              }
            `}
          </style>
        </div>
      </div>
    );
  }

  if (error && !sale) {
    return (
      <div style={styles.container}>
        <button 
          style={styles.backButton}
          onClick={() => navigate("/sales")}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = styles.backButtonHover.backgroundColor;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = styles.backButton.backgroundColor;
          }}
        >
          ← Back to Sales
        </button>
        <div style={styles.errorMessage}>
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div className="print-hidden">
        <button 
          style={styles.backButton}
          onClick={() => navigate(`/sales/${id}`)}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = styles.backButtonHover.backgroundColor;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = styles.backButton.backgroundColor;
          }}
        >
          ← Back to Sale Details
        </button>
      </div>

      <div style={styles.receiptContainer}>
        {/* Receipt Header */}
        <div style={styles.receiptHeader}>
          <h1 style={styles.companyName}>Nation Motor Spares</h1>
          <p style={styles.companyTagline}>Your trusted motorcycle spare parts supplier</p>
          <h2 style={styles.receiptTitle}>Sales Receipt</h2>
        </div>

        {/* Receipt Body */}
        <div style={styles.receiptBody}>
          {/* Receipt Info Grid */}
          <div style={styles.receiptInfo}>
            {/* Customer Information */}
            <div style={styles.infoSection}>
              <h3 style={styles.sectionTitle}>Customer Details</h3>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Name:</span>
                <span style={styles.infoValue}>{sale.customerName}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Email:</span>
                <span style={styles.infoValue}>{sale.customerEmail}</span>
              </div>
              {sale.customerPhone && (
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Phone:</span>
                  <span style={styles.infoValue}>{sale.customerPhone}</span>
                </div>
              )}
            </div>

            {/* Sale Information */}
            <div style={styles.infoSection}>
              <h3 style={styles.sectionTitle}>Sale Details</h3>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Receipt #:</span>
                <span style={{...styles.infoValue, ...styles.receiptNumber}}>
                  {sale._id?.substring(0, 8).toUpperCase()}
                </span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Date:</span>
                <span style={styles.infoValue}>
                  {new Date(sale.saleDate).toLocaleDateString()}
                </span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Status:</span>
                <span style={styles.infoValue}>{sale.paymentStatus}</span>
              </div>
            </div>
          </div>

          <hr style={styles.divider} />

          {/* Product Details */}
          <div style={styles.infoSection}>
            <h3 style={styles.sectionTitle}>Product Information</h3>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Product:</span>
              <span style={styles.infoValue}>{sale.product?.productName}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Quantity:</span>
              <span style={styles.infoValue}>{sale.quantity}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Unit Price:</span>
              <span style={styles.infoValue}>{formatCurrency(sale.pricePerUnit)}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Subtotal:</span>
              <span style={styles.infoValue}>{formatCurrency(sale.quantity * sale.pricePerUnit)}</span>
            </div>
          </div>

          <hr style={styles.divider} />

          {/* Total */}
          <div style={styles.totalSection}>
            <div style={styles.totalLabel}>Total Amount</div>
            <div style={styles.totalAmount}>{formatCurrency(sale.totalAmount)}</div>
          </div>

          {/* Thank You Message */}
          <div style={styles.thankYouMessage}>
            Thank you for choosing Nation Motor Spares! We appreciate your business and look forward to serving you again.
          </div>

          {/* Date Stamp */}
          <div style={styles.dateStamp}>
            Generated on {new Date().toLocaleString()}
          </div>
        </div>
      </div>

      {/* Action Buttons (Hidden in Print) */}
      <div style={styles.actionsContainer} className="print-hidden">
        <button
          onClick={handlePrint}
          style={styles.printButton}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = styles.printButtonHover.backgroundColor;
            e.target.style.transform = styles.printButtonHover.transform;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = styles.printButton.backgroundColor;
            e.target.style.transform = "none";
          }}
        >
          Print Receipt
        </button>

        <button
          onClick={handleSendEmail}
          disabled={sending}
          style={{
            ...styles.emailButton,
            ...(sending ? styles.emailButtonDisabled : {})
          }}
          onMouseEnter={(e) => {
            if (!sending) {
              e.target.style.backgroundColor = styles.emailButtonHover.backgroundColor;
              e.target.style.transform = styles.emailButtonHover.transform;
            }
          }}
          onMouseLeave={(e) => {
            if (!sending) {
              e.target.style.backgroundColor = styles.emailButton.backgroundColor;
              e.target.style.transform = "none";
            }
          }}
        >
          {sending ? "Sending..." : "Email Receipt"}
        </button>

        {/* Status Messages */}
        {sent && (
          <div style={{...styles.statusMessage, ...styles.successMessage}}>
            Email sent successfully to {sale.customerEmail}
          </div>
        )}
        {error && (
          <div style={{...styles.statusMessage, ...styles.errorMessage}}>
            {error}
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @media print {
            .print-hidden { display: none !important; }
            body { margin: 0; }
          }
        `}
      </style>
    </div>
  );
};

export default ReceiptPage;