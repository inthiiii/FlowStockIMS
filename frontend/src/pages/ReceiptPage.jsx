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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  // Enhanced email template with professional styling
  const generateEmailHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f7fa;
          }
          .email-container {
            max-width: 600px;
            margin: 40px auto;
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          }
          .email-header {
            background: linear-gradient(135deg, #023E8A 0%, #0353b8 100%);
            color: #ffffff;
            padding: 40px 30px;
            text-align: center;
          }
          .company-logo {
            font-size: 2.5rem;
            font-weight: 800;
            margin: 0 0 10px 0;
            letter-spacing: 1px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
          .company-tagline {
            font-size: 1rem;
            margin: 0 0 20px 0;
            opacity: 0.95;
          }
          .receipt-title {
            font-size: 1.3rem;
            font-weight: 600;
            margin: 20px 0 0 0;
            text-transform: uppercase;
            letter-spacing: 2px;
            background-color: rgba(255, 255, 255, 0.2);
            padding: 10px 20px;
            border-radius: 8px;
            display: inline-block;
          }
          .email-body {
            padding: 40px 30px;
          }
          .greeting {
            font-size: 1.2rem;
            color: #334155;
            margin-bottom: 20px;
            font-weight: 600;
          }
          .intro-text {
            font-size: 1rem;
            color: #64748b;
            line-height: 1.6;
            margin-bottom: 30px;
          }
          .info-section {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 20px;
            border: 1px solid #e2e8f0;
          }
          .section-title {
            font-size: 1rem;
            font-weight: 700;
            color: #023E8A;
            margin: 0 0 15px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 2px solid #023E8A;
            padding-bottom: 8px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #e2e8f0;
          }
          .info-row:last-child {
            border-bottom: none;
          }
          .info-label {
            font-weight: 500;
            color: #64748b;
            font-size: 0.95rem;
          }
          .info-value {
            font-weight: 600;
            color: #334155;
            text-align: right;
            font-size: 0.95rem;
          }
          .total-section {
            background: linear-gradient(135deg, #023E8A 0%, #0353b8 100%);
            color: #ffffff;
            text-align: center;
            padding: 30px;
            border-radius: 12px;
            margin: 30px 0;
            box-shadow: 0 4px 12px rgba(2, 62, 138, 0.3);
          }
          .total-label {
            font-size: 1rem;
            font-weight: 600;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
            opacity: 0.95;
          }
          .total-amount {
            font-size: 2.5rem;
            font-weight: 800;
            margin: 0;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
          .thank-you {
            background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
            padding: 25px;
            border-radius: 12px;
            text-align: center;
            font-size: 1.05rem;
            color: #1e40af;
            font-weight: 500;
            line-height: 1.6;
            border: 1px solid #93c5fd;
            margin: 30px 0;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: #ffffff;
            padding: 15px 40px;
            text-decoration: none;
            border-radius: 10px;
            font-weight: 700;
            font-size: 1rem;
            margin: 20px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
          }
          .footer {
            background-color: #f8fafc;
            padding: 30px;
            text-align: center;
            border-top: 2px solid #e2e8f0;
          }
          .footer-text {
            font-size: 0.9rem;
            color: #64748b;
            margin: 5px 0;
            line-height: 1.6;
          }
          .social-links {
            margin: 20px 0;
          }
          .social-link {
            display: inline-block;
            margin: 0 10px;
            color: #023E8A;
            text-decoration: none;
            font-size: 0.9rem;
            font-weight: 600;
          }
          .receipt-number {
            background-color: rgba(255, 255, 255, 0.3);
            padding: 6px 12px;
            border-radius: 6px;
            font-family: monospace;
            font-size: 0.9rem;
          }
          .highlight-box {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border-left: 4px solid #f59e0b;
            padding: 15px 20px;
            border-radius: 8px;
            margin: 20px 0;
            font-size: 0.95rem;
            color: #92400e;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <!-- Header -->
          <div class="email-header">
            <div class="company-logo">🏍️ Nation Motor Spares</div>
            <div class="company-tagline">Your trusted motorcycle spare parts supplier</div>
            <div class="receipt-title">Sales Receipt</div>
          </div>

          <!-- Body -->
          <div class="email-body">
            <div class="greeting">Hello ${sale.customerName}! 👋</div>
            <div class="intro-text">
              Thank you for your purchase! We're pleased to confirm your order and provide you with this receipt for your records.
            </div>

            <!-- Receipt Number -->
            <div class="highlight-box">
              <strong>Receipt Number:</strong> <span class="receipt-number">${sale._id?.substring(0, 8).toUpperCase()}</span><br>
              <strong>Date:</strong> ${new Date(sale.saleDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>

            <!-- Customer Details -->
            <div class="info-section">
              <div class="section-title">📋 Customer Information</div>
              <div class="info-row">
                <span class="info-label">Name</span>
                <span class="info-value">${sale.customerName}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Email</span>
                <span class="info-value">${sale.customerEmail}</span>
              </div>
              ${sale.customerPhone ? `
              <div class="info-row">
                <span class="info-label">Phone</span>
                <span class="info-value">${sale.customerPhone}</span>
              </div>
              ` : ''}
            </div>

            <!-- Product Details -->
            <div class="info-section">
              <div class="section-title">📦 Product Details</div>
              <div class="info-row">
                <span class="info-label">Product</span>
                <span class="info-value">${sale.product?.productName || 'N/A'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Quantity</span>
                <span class="info-value">${sale.quantity}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Unit Price</span>
                <span class="info-value">${formatCurrency(sale.pricePerUnit)}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Subtotal</span>
                <span class="info-value">${formatCurrency(sale.quantity * sale.pricePerUnit)}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Payment Type</span>
                <span class="info-value">${sale.saleType || 'N/A'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Status</span>
                <span class="info-value">${sale.paymentStatus}</span>
              </div>
            </div>

            <!-- Total -->
            <div class="total-section">
              <div class="total-label">Total Amount Paid</div>
              <div class="total-amount">${formatCurrency(sale.totalAmount)}</div>
            </div>

            <!-- Thank You Message -->
            <div class="thank-you">
              🎉 Thank you for choosing Nation Motor Spares! We appreciate your business and look forward to serving you again. If you have any questions about your order, please don't hesitate to contact us.
            </div>

            <!-- CTA Button -->
            <div style="text-align: center;">
              <a href="http://localhost:3000/contact" class="cta-button">Contact Support</a>
            </div>
          </div>

          <!-- Footer -->
          <div class="footer">
            <div class="footer-text">
              <strong>Nation Motor Spares</strong><br>
              123 Main Street, Colombo, Sri Lanka<br>
              Email: nationmotorscolombo@gmail.com | Phone: +94 11 234 5678
            </div>
            <div class="social-links">
              <a href="#" class="social-link">Website</a> |
              <a href="#" class="social-link">Facebook</a> |
              <a href="#" class="social-link">Instagram</a>
            </div>
            <div class="footer-text" style="margin-top: 15px; font-size: 0.85rem; opacity: 0.7;">
              © ${new Date().getFullYear()} Nation Motor Spares. All rights reserved.<br>
              This is an automated email. Please do not reply to this message.
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
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
          subject: `Your Sales Receipt #${sale._id?.substring(0, 8).toUpperCase()} - Nation Motor Spares`,
          message: generateEmailHTML(),
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

  const styles = {
    container: {
      maxWidth: "900px",
      margin: "0 auto",
      padding: "50px 30px",
      background: "linear-gradient(135deg, #f0f4f8 0%, #e8eef5 50%, #f5f7fa 100%)",
      minHeight: "100vh",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      position: "relative",
    },
    backgroundPattern: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.03,
      backgroundImage: "radial-gradient(circle at 20% 50%, rgba(2, 62, 138, 0.3) 0%, transparent 50%)",
      pointerEvents: "none",
      zIndex: 0,
    },
    content: {
      position: "relative",
      zIndex: 1,
    },
    backButton: {
      background: "linear-gradient(135deg, #64748b 0%, #475569 100%)",
      color: "#ffffff",
      padding: "12px 24px",
      border: "none",
      borderRadius: "10px",
      fontSize: "0.95rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      marginBottom: "30px",
      textDecoration: "none",
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      boxShadow: "0 4px 12px rgba(100, 116, 139, 0.3)",
    },
    receiptContainer: {
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      border: "1px solid rgba(226, 232, 240, 0.8)",
      borderRadius: "20px",
      maxWidth: "700px",
      margin: "0 auto",
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)",
      overflow: "hidden",
      animation: "fadeInUp 0.8s ease-out",
    },
    receiptHeader: {
      background: "linear-gradient(135deg, #023E8A 0%, #0353b8 100%)",
      color: "#ffffff",
      padding: "40px 35px",
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
    },
    headerDecoration: {
      position: "absolute",
      top: "-50px",
      right: "-50px",
      width: "200px",
      height: "200px",
      background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
      borderRadius: "50%",
    },
    companyIcon: {
      fontSize: "3rem",
      marginBottom: "10px",
      filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2))",
    },
    companyName: {
      fontSize: "2.2rem",
      fontWeight: "800",
      margin: "0 0 8px 0",
      letterSpacing: "1px",
      textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    },
    companyTagline: {
      fontSize: "1rem",
      margin: "0",
      opacity: "0.95",
      fontWeight: "400",
    },
    receiptTitle: {
      fontSize: "1.4rem",
      fontWeight: "700",
      margin: "25px 0 0 0",
      textTransform: "uppercase",
      letterSpacing: "2px",
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      padding: "12px 24px",
      borderRadius: "10px",
      display: "inline-block",
    },
    receiptBody: {
      padding: "45px 35px",
    },
    receiptInfo: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "25px",
      marginBottom: "30px",
    },
    infoSection: {
      background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
      padding: "25px",
      borderRadius: "14px",
      border: "1px solid #e2e8f0",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
    },
    sectionTitle: {
      fontSize: "0.95rem",
      fontWeight: "700",
      color: "#023E8A",
      marginBottom: "18px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      borderBottom: "2px solid #023E8A",
      paddingBottom: "10px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    infoRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "12px",
      padding: "8px 0",
      borderBottom: "1px solid #e2e8f0",
    },
    infoRowLast: {
      borderBottom: "none",
    },
    infoLabel: {
      fontSize: "0.9rem",
      fontWeight: "500",
      color: "#64748b",
      flex: "1",
    },
    infoValue: {
      fontSize: "0.95rem",
      fontWeight: "600",
      color: "#334155",
      textAlign: "right",
      flex: "1",
    },
    divider: {
      height: "2px",
      background: "linear-gradient(90deg, transparent 0%, #e2e8f0 50%, transparent 100%)",
      margin: "35px 0",
      border: "none",
    },
    totalSection: {
      background: "linear-gradient(135deg, #023E8A 0%, #0353b8 100%)",
      padding: "30px",
      borderRadius: "16px",
      textAlign: "center",
      marginBottom: "30px",
      boxShadow: "0 8px 24px rgba(2, 62, 138, 0.3)",
      position: "relative",
      overflow: "hidden",
    },
    totalDecoration: {
      position: "absolute",
      bottom: "-30px",
      left: "-30px",
      width: "150px",
      height: "150px",
      background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
      borderRadius: "50%",
    },
    totalLabel: {
      fontSize: "1.1rem",
      fontWeight: "600",
      color: "#ffffff",
      marginBottom: "12px",
      textTransform: "uppercase",
      letterSpacing: "1px",
      opacity: "0.95",
    },
    totalAmount: {
      fontSize: "3rem",
      fontWeight: "800",
      color: "#ffffff",
      margin: "0",
      fontFamily: "monospace",
      textShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
      position: "relative",
      zIndex: 1,
    },
    thankYouMessage: {
      textAlign: "center",
      fontSize: "1.1rem",
      color: "#1e40af",
      fontWeight: "500",
      marginBottom: "30px",
      padding: "25px",
      background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
      borderRadius: "14px",
      border: "1px solid #93c5fd",
      lineHeight: "1.7",
      boxShadow: "0 2px 8px rgba(59, 130, 246, 0.1)",
    },
    actionsContainer: {
      display: "flex",
      gap: "15px",
      justifyContent: "center",
      marginTop: "35px",
      flexWrap: "wrap",
    },
    printButton: {
      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      color: "#ffffff",
      padding: "14px 32px",
      border: "none",
      borderRadius: "12px",
      fontSize: "1rem",
      fontWeight: "700",
      cursor: "pointer",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      boxShadow: "0 6px 20px rgba(16, 185, 129, 0.3)",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    emailButton: {
      background: "linear-gradient(135deg, #023E8A 0%, #0353b8 100%)",
      color: "#ffffff",
      padding: "14px 32px",
      border: "none",
      borderRadius: "12px",
      fontSize: "1rem",
      fontWeight: "700",
      cursor: "pointer",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      boxShadow: "0 6px 20px rgba(2, 62, 138, 0.3)",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    emailButtonDisabled: {
      background: "linear-gradient(135deg, #94a3b8 0%, #64748b 100%)",
      cursor: "not-allowed",
      opacity: 0.7,
    },
    statusMessage: {
      width: "100%",
      marginTop: "20px",
      padding: "16px 20px",
      borderRadius: "12px",
      fontSize: "0.95rem",
      fontWeight: "600",
      textAlign: "center",
      animation: "slideInDown 0.3s ease-out",
    },
    successMessage: {
      background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
      color: "#065f46",
      border: "1px solid #6ee7b7",
    },
    errorMessage: {
      background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
      color: "#991b1b",
      border: "1px solid #fca5a5",
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
      fontSize: "1.2rem",
      fontWeight: "600",
      color: "#64748b",
    },
    receiptNumber: {
      fontFamily: "monospace",
      backgroundColor: "#f1f5f9",
      padding: "6px 12px",
      borderRadius: "8px",
      fontSize: "0.9rem",
      fontWeight: "700",
      color: "#023E8A",
    },
    dateStamp: {
      textAlign: "center",
      marginTop: "25px",
      padding: "12px",
      backgroundColor: "#f8fafc",
      borderRadius: "10px",
      fontSize: "0.85rem",
      color: "#64748b",
      fontWeight: "500",
      border: "1px dashed #e2e8f0",
    },
  };

  const styleSheet = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideInDown {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes shimmer {
      0% { background-position: -1000px 0; }
      100% { background-position: 1000px 0; }
    }
    .action-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
    }
    .action-btn:active {
      transform: translateY(-1px);
    }
    .back-btn:hover {
      transform: translateX(-4px);
    }
    .sending-shimmer {
      background: linear-gradient(90deg, #94a3b8 0%, #64748b 50%, #94a3b8 100%);
      background-size: 1000px 100%;
      animation: shimmer 2s infinite;
    }
    @media print {
      .print-hidden { display: none !important; }
      body { margin: 0; background: white; }
      @page { margin: 0.5cm; }
    }
  `;

  if (loading) {
    return (
      <div style={styles.container}>
        <style>{styleSheet}</style>
        <div style={styles.content}>
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner}></div>
            <div style={styles.loadingText}>Loading receipt...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !sale) {
    return (
      <div style={styles.container}>
        <style>{styleSheet}</style>
        <div style={styles.content}>
          <button 
            className="back-btn"
            style={styles.backButton}
            onClick={() => navigate("/sales")}
          >
            ← Back to Sales
          </button>
          <div style={{...styles.statusMessage, ...styles.errorMessage}}>
            <strong>Error:</strong> {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{styleSheet}</style>
      <div style={styles.backgroundPattern}></div>
      
      <div style={styles.content}>
        <div className="print-hidden">
          <button 
            className="back-btn action-btn"
            style={styles.backButton}
            onClick={() => navigate(`/sales/${id}`)}
          >
            ← Back to Sale Details
          </button>
        </div>

        <div style={styles.receiptContainer}>
          {/* Receipt Header */}
          <div style={styles.receiptHeader}>
            <div style={styles.headerDecoration}></div>
            <div style={styles.companyIcon}>🏍️</div>
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
                <h3 style={styles.sectionTitle}>
                  <span>👤</span> Customer Details
                </h3>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Name:</span>
                  <span style={styles.infoValue}>{sale.customerName}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Email:</span>
                  <span style={styles.infoValue}>{sale.customerEmail}</span>
                </div>
                {sale.customerPhone && (
                  <div style={{...styles.infoRow, ...styles.infoRowLast}}>
                    <span style={styles.infoLabel}>Phone:</span>
                    <span style={styles.infoValue}>{sale.customerPhone}</span>
                  </div>
                )}
              </div>

              {/* Sale Information */}
              <div style={styles.infoSection}>
                <h3 style={styles.sectionTitle}>
                  <span>📋</span> Sale Details
                </h3>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Receipt #:</span>
                  <span style={{...styles.infoValue, ...styles.receiptNumber}}>
                    {sale._id?.substring(0, 8).toUpperCase()}
                  </span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Date:</span>
                  <span style={styles.infoValue}>
                    {new Date(sale.saleDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                <div style={{...styles.infoRow, ...styles.infoRowLast}}>
                  <span style={styles.infoLabel}>Status:</span>
                  <span style={styles.infoValue}>{sale.paymentStatus}</span>
                </div>
              </div>
            </div>

            <hr style={styles.divider} />

            {/* Product Details */}
            <div style={styles.infoSection}>
              <h3 style={styles.sectionTitle}>
                <span>📦</span> Product Information
              </h3>
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
              {sale.saleType && (
                <div style={{...styles.infoRow, ...styles.infoRowLast}}>
                  <span style={styles.infoLabel}>Payment Type:</span>
                  <span style={styles.infoValue}>{sale.saleType}</span>
                </div>
              )}
            </div>

            <hr style={styles.divider} />

            {/* Total */}
            <div style={styles.totalSection}>
              <div style={styles.totalDecoration}></div>
              <div style={styles.totalLabel}>Total Amount</div>
              <div style={styles.totalAmount}>{formatCurrency(sale.totalAmount)}</div>
            </div>

            {/* Thank You Message */}
            <div style={styles.thankYouMessage}>
              🎉 Thank you for choosing Nation Motor Spares! We appreciate your business and look forward to serving you again. If you have any questions, please don't hesitate to contact us.
            </div>

            {/* Date Stamp */}
            <div style={styles.dateStamp}>
              📅 Generated on {new Date().toLocaleString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>

        {/* Action Buttons (Hidden in Print) */}
        <div style={styles.actionsContainer} className="print-hidden">
          <button
            onClick={handlePrint}
            className="action-btn"
            style={styles.printButton}
          >
            <span>🖨️</span>
            Print Receipt
          </button>

          <button
            onClick={handleSendEmail}
            disabled={sending}
            className={sending ? "sending-shimmer" : "action-btn"}
            style={{
              ...styles.emailButton,
              ...(sending ? styles.emailButtonDisabled : {})
            }}
          >
            <span>📧</span>
            {sending ? "Sending..." : "Email Receipt"}
          </button>
        </div>

        {/* Status Messages */}
        {sent && (
          <div style={{...styles.statusMessage, ...styles.successMessage}}>
            ✅ Email sent successfully to {sale.customerEmail}
          </div>
        )}
        {error && (
          <div style={{...styles.statusMessage, ...styles.errorMessage}}>
            ❌ {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiptPage;