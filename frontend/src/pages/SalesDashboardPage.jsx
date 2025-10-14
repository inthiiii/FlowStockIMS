import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const SalesDashboardPage = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [animatedValues, setAnimatedValues] = useState({
    totalSales: 0,
    salesCount: 0,
    avgSale: 0,
    returns: 0
  });

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3000/api/sales");
        const data = await response.json();
        setSales(data);
      } catch (err) {
        console.error("Error fetching sales:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  const totalSales = sales.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
  const avgSaleValue = sales.length > 0 ? totalSales / sales.length : 0;

  // Animate numbers when they change
  useEffect(() => {
    if (sales.length === 0) return;

    const duration = 1500;
    const steps = 60;
    const interval = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setAnimatedValues({
        totalSales: Math.floor(totalSales * easeOut),
        salesCount: Math.floor(sales.length * easeOut),
        avgSale: Math.floor(avgSaleValue * easeOut),
        returns: Math.floor(getReturnsData().total * easeOut)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedValues({
          totalSales,
          salesCount: sales.length,
          avgSale: avgSaleValue,
          returns: getReturnsData().total
        });
      }
    }, interval);

    return () => clearInterval(timer);
  }, [sales]);

  const getWeeklySales = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const weekData = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayName = days[date.getDay()];
      
      const daySales = sales.filter(sale => {
        const saleDate = new Date(sale.saleDate);
        return saleDate.toDateString() === date.toDateString();
      });

      const dayTotal = daySales.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
      
      weekData.push({
        day: dayName,
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        amount: dayTotal,
        count: daySales.length
      });
    }

    return weekData;
  };

  const getReturnsData = () => {
    const returns = sales.filter(
      (s) => s.paymentStatus === "Returned" || s.paymentStatus === "Cancelled"
    );
    const returnsByProduct = {};

    returns.forEach(sale => {
      const productName = sale.product?.productName || 'Unknown';
      if (!returnsByProduct[productName]) {
        returnsByProduct[productName] = {
          count: 0,
          totalAmount: 0
        };
      }
      returnsByProduct[productName].count += 1;
      returnsByProduct[productName].totalAmount += sale.totalAmount || 0;
    });

    return {
      total: returns.length,
      totalAmount: returns.reduce((sum, s) => sum + (s.totalAmount || 0), 0),
      byProduct: Object.entries(returnsByProduct)
        .map(([product, data]) => ({ product, ...data }))
        .sort((a, b) => b.count - a.count)
    };
  };

  const getPaymentBreakdown = () => {
    const breakdown = {
      Paid: 0,
      Pending: 0,
      Cancelled: 0,
      Returned: 0
    };

    sales.forEach(sale => {
      const status = sale.paymentStatus || 'Pending';
      if (breakdown.hasOwnProperty(status)) {
        breakdown[status]++;
      }
    });

    return breakdown;
  };

  const weeklyData = getWeeklySales();
  const returnsData = getReturnsData();
  const paymentBreakdown = getPaymentBreakdown();
  const maxWeeklyAmount = Math.max(...weeklyData.map(d => d.amount), 1);

  const analyzeSales = () => {
    setAnalyzing(true);

    setTimeout(() => {
      const insightsList = [];

      const highestSalesDay = weeklyData.reduce((max, d) => (d.amount > max.amount ? d : max), weeklyData[0] || { amount: 0, day: '', date: '' });
      const lowestSalesDay = weeklyData.reduce((min, d) => (d.amount < min.amount ? d : min), weeklyData[0] || { amount: 0, day: '', date: '' });

      const totalReturns = returnsData.total;
      const topReturnProduct = returnsData.byProduct.length > 0 ? returnsData.byProduct[0].product : null;

      const productRevenueMap = sales.reduce((acc, sale) => {
        const name = sale.product?.productName || "Unknown";
        acc[name] = (acc[name] || 0) + (sale.totalAmount || 0);
        return acc;
      }, {});
      const sortedProducts = Object.entries(productRevenueMap).sort((a, b) => b[1] - a[1]);
      const bestProduct = sortedProducts[0]?.[0] || "Unknown";
      const bestProductShare = sortedProducts.length > 0 ? (sortedProducts[0][1] / (totalSales || 1)) * 100 : 0;

      const hourBuckets = {};
      sales.forEach(sale => {
        const d = sale.saleDate ? new Date(sale.saleDate) : null;
        if (!d) return;
        const hour = d.getHours();
        hourBuckets[hour] = (hourBuckets[hour] || 0) + (sale.totalAmount || 0);
      });
      const hourEntries = Object.entries(hourBuckets);
      const peakHourEntry = hourEntries.length ? hourEntries.sort((a,b)=> b[1]-a[1])[0] : null;
      const peakHourText = peakHourEntry ? `${peakHourEntry[0]}:00 - ${Number(peakHourEntry[0]) + 1}:00` : null;

      if (highestSalesDay && highestSalesDay.amount >= 0) {
        insightsList.push(`📈 Highest sales: ${highestSalesDay.day} (${highestSalesDay.date}) — Rs.${highestSalesDay.amount.toLocaleString()}`);
      }
      if (lowestSalesDay && lowestSalesDay.amount >= 0) {
        insightsList.push(`📉 Lowest sales: ${lowestSalesDay.day} (${lowestSalesDay.date}) — consider promotions to improve this day.`);
      }

      insightsList.push(`🏆 Top product: ${bestProduct} (${bestProductShare.toFixed(1)}% of displayed revenue)`);

      if (totalReturns > 0 && topReturnProduct) {
        insightsList.push(`⚠️ ${totalReturns} return(s) recorded recently — most returns: ${topReturnProduct}. Investigate quality/delivery.`);
      } else {
        insightsList.push(`✅ No major returns detected this period.`);
      }

      if (paymentBreakdown.Pending > 0) {
        insightsList.push(`⌛ ${paymentBreakdown.Pending} payment(s) pending — follow up to close sales.`);
      }

      if (peakHourText) {
        insightsList.push(`🕒 Peak sales hour: ${peakHourText}. Consider targeting promotions in this time window.`);
      }

      setInsights(insightsList);
      setAnalyzing(false);
    }, 1200);
  };

  const styles = {
    container: {
      maxWidth: "1600px",
      margin: "0 auto",
      padding: "50px 30px",
      background: "linear-gradient(135deg, #f0f4f8 0%, #e8eef5 50%, #f5f7fa 100%)",
      minHeight: "100vh",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      position: "relative",
      overflow: "hidden"
    },
    backgroundPattern: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.03,
      backgroundImage: "radial-gradient(circle at 20% 50%, rgba(2, 62, 138, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(2, 62, 138, 0.3) 0%, transparent 50%)",
      pointerEvents: "none",
      zIndex: 0
    },
    content: {
      position: "relative",
      zIndex: 1
    },
    header: {
      textAlign: "center",
      marginBottom: "50px",
      animation: "fadeInDown 0.8s ease-out"
    },
    title: {
      color: "#023E8A",
      fontSize: "3.5rem",
      fontWeight: "800",
      margin: "0",
      marginBottom: "12px",
      letterSpacing: "-2px",
      textShadow: "0 2px 10px rgba(2, 62, 138, 0.1)",
      background: "linear-gradient(135deg, #023E8A 0%, #0353b8 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text"
    },
    subtitle: {
      color: "#64748b",
      fontSize: "1.2rem",
      margin: "0",
      fontWeight: "400",
      letterSpacing: "0.5px"
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "25px",
      marginBottom: "45px",
      animation: "fadeInUp 0.8s ease-out"
    },
    statCard: {
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      padding: "35px",
      borderRadius: "20px",
      border: "1px solid rgba(226, 232, 240, 0.6)",
      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08), 0 0 1px rgba(0, 0, 0, 0.1)",
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      position: "relative",
      overflow: "hidden",
      cursor: "pointer"
    },
    statCardGlow: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(2, 62, 138, 0.05) 0%, transparent 50%)",
      opacity: 0,
      transition: "opacity 0.3s ease",
      pointerEvents: "none"
    },
    statIcon: {
      fontSize: "3rem",
      marginBottom: "15px",
      display: "block",
      filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
      animation: "float 3s ease-in-out infinite"
    },
    statLabel: {
      fontSize: "0.9rem",
      fontWeight: "600",
      color: "#64748b",
      textTransform: "uppercase",
      letterSpacing: "1px",
      marginBottom: "12px"
    },
    statValue: {
      fontSize: "2.8rem",
      fontWeight: "800",
      background: "linear-gradient(135deg, #023E8A 0%, #0353b8 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      margin: "0",
      lineHeight: "1.2"
    },
    statSubtext: {
      fontSize: "0.9rem",
      color: "#94a3b8",
      marginTop: "10px",
      fontWeight: "500"
    },
    analyzeButton: {
      background: "linear-gradient(135deg, #023E8A 0%, #0353b8 100%)",
      color: "#fff",
      padding: "16px 40px",
      border: "none",
      borderRadius: "12px",
      fontWeight: "700",
      fontSize: "1.05rem",
      cursor: "pointer",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      display: "block",
      margin: "0 auto 35px auto",
      textTransform: "uppercase",
      letterSpacing: "1px",
      boxShadow: "0 8px 25px rgba(2, 62, 138, 0.35)",
      position: "relative",
      overflow: "hidden"
    },
    insightsBox: {
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      border: "1px solid rgba(226, 232, 240, 0.8)",
      borderRadius: "20px",
      padding: "35px",
      margin: "0 auto 40px auto",
      maxWidth: "1000px",
      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
      animation: "scaleIn 0.5s ease-out"
    },
    insightsTitle: {
      color: "#023E8A",
      marginBottom: "20px",
      fontSize: "1.5rem",
      fontWeight: "700",
      display: "flex",
      alignItems: "center",
      gap: "10px"
    },
    insightItem: {
      backgroundColor: "#ffffff",
      padding: "16px 22px",
      borderRadius: "12px",
      border: "1px solid #e2e8f0",
      marginBottom: "12px",
      fontSize: "1rem",
      color: "#334155",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
      transition: "all 0.3s ease",
      animation: "slideInLeft 0.5s ease-out",
      animationFillMode: "both"
    },
    chartSection: {
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      padding: "40px",
      borderRadius: "20px",
      border: "1px solid rgba(226, 232, 240, 0.8)",
      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
      marginBottom: "35px",
      animation: "fadeInUp 0.9s ease-out"
    },
    chartTitle: {
      color: "#023E8A",
      fontSize: "1.6rem",
      fontWeight: "700",
      marginBottom: "30px",
      paddingBottom: "18px",
      borderBottom: "3px solid #e2e8f0",
      display: "flex",
      alignItems: "center",
      gap: "10px"
    },
    barChart: {
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-around",
      height: "320px",
      padding: "25px",
      backgroundColor: "#f8fafc",
      borderRadius: "16px",
      border: "1px solid #e2e8f0",
      gap: "18px"
    },
    barContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      flex: "1",
      maxWidth: "110px"
    },
    bar: {
      width: "100%",
      background: "linear-gradient(180deg, #023E8A 0%, #0353b8 100%)",
      borderRadius: "12px 12px 0 0",
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      position: "relative",
      minHeight: "25px",
      boxShadow: "0 -4px 10px rgba(2, 62, 138, 0.2)",
      animation: "growUp 1s ease-out",
      animationFillMode: "both"
    },
    barLabel: {
      marginTop: "12px",
      fontSize: "0.9rem",
      fontWeight: "700",
      color: "#334155",
      textAlign: "center"
    },
    barValue: {
      fontSize: "0.75rem",
      color: "#64748b",
      marginTop: "4px",
      textAlign: "center",
      fontWeight: "500"
    },
    barAmount: {
      position: "absolute",
      top: "-30px",
      left: "50%",
      transform: "translateX(-50%)",
      fontSize: "0.85rem",
      fontWeight: "700",
      color: "#023E8A",
      whiteSpace: "nowrap",
      background: "#ffffff",
      padding: "4px 8px",
      borderRadius: "6px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
    },
    revenueChart: {
      backgroundColor: "#f8fafc",
      padding: "25px",
      borderRadius: "16px",
      border: "1px solid #e2e8f0",
      height: "280px",
      position: "relative"
    },
    revenueLine: {
      height: "100%",
      display: "flex",
      alignItems: "flex-end",
      gap: "12px",
      padding: "35px 15px 35px 15px"
    },
    revenueBar: {
      flex: "1",
      background: "linear-gradient(180deg, rgba(2, 62, 138, 0.7) 0%, rgba(3, 83, 184, 0.9) 100%)",
      borderRadius: "8px 8px 0 0",
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      minHeight: "15px",
      position: "relative",
      boxShadow: "0 -2px 6px rgba(2, 62, 138, 0.15)",
      animation: "growUp 1.2s ease-out",
      animationFillMode: "both"
    },
    paymentBreakdown: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
      gap: "20px",
      marginTop: "25px"
    },
    statusCard: {
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      padding: "25px",
      borderRadius: "16px",
      border: "1px solid #e2e8f0",
      textAlign: "center",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
      cursor: "pointer"
    },
    statusNumber: {
      fontSize: "2.5rem",
      fontWeight: "800",
      margin: "12px 0",
      lineHeight: "1"
    },
    statusLabel: {
      fontSize: "0.85rem",
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: "1px"
    },
    returnsSection: {
      background: "linear-gradient(135deg, #fff5f5 0%, #ffe5e5 100%)",
      padding: "40px",
      borderRadius: "20px",
      border: "1px solid #ffcccc",
      boxShadow: "0 10px 40px rgba(220, 53, 69, 0.15)",
      marginBottom: "35px",
      animation: "fadeInUp 1s ease-out"
    },
    returnsHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "25px",
      flexWrap: "wrap",
      gap: "20px"
    },
    returnsTitle: {
      color: "#dc3545",
      fontSize: "1.6rem",
      fontWeight: "700",
      margin: "0",
      display: "flex",
      alignItems: "center",
      gap: "10px"
    },
    returnsStats: {
      display: "flex",
      gap: "35px"
    },
    returnsStat: {
      textAlign: "center"
    },
    returnsStatValue: {
      fontSize: "2.2rem",
      fontWeight: "800",
      color: "#dc3545",
      margin: "0",
      lineHeight: "1"
    },
    returnsStatLabel: {
      fontSize: "0.85rem",
      color: "#6c757d",
      textTransform: "uppercase",
      marginTop: "8px",
      fontWeight: "600",
      letterSpacing: "0.5px"
    },
    productsList: {
      display: "flex",
      flexDirection: "column",
      gap: "14px",
      marginBottom: "25px"
    },
    productItem: {
      backgroundColor: "#ffffff",
      padding: "20px",
      borderRadius: "12px",
      border: "1px solid #ffcccc",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      transition: "all 0.3s ease",
      boxShadow: "0 2px 8px rgba(220, 53, 69, 0.08)"
    },
    productName: {
      fontSize: "1.05rem",
      fontWeight: "600",
      color: "#334155"
    },
    productStats: {
      display: "flex",
      gap: "25px",
      alignItems: "center"
    },
    productCount: {
      backgroundColor: "#dc3545",
      color: "#ffffff",
      padding: "6px 14px",
      borderRadius: "20px",
      fontSize: "0.85rem",
      fontWeight: "700",
      boxShadow: "0 2px 6px rgba(220, 53, 69, 0.3)"
    },
    productAmount: {
      fontSize: "1rem",
      fontWeight: "700",
      color: "#dc3545",
      fontFamily: "monospace"
    },
    reviewButton: {
      background: "linear-gradient(135deg, #dc3545 0%, #c82333 100%)",
      color: "#ffffff",
      padding: "14px 30px",
      border: "none",
      borderRadius: "12px",
      fontSize: "1rem",
      fontWeight: "700",
      cursor: "pointer",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      textDecoration: "none",
      display: "inline-block",
      boxShadow: "0 6px 20px rgba(220, 53, 69, 0.3)"
    },
    viewAllButton: {
      background: "linear-gradient(135deg, #023E8A 0%, #0353b8 100%)",
      color: "#ffffff",
      padding: "18px 45px",
      border: "none",
      borderRadius: "12px",
      fontSize: "1.15rem",
      fontWeight: "700",
      cursor: "pointer",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      textTransform: "uppercase",
      letterSpacing: "1px",
      textDecoration: "none",
      display: "inline-block",
      marginTop: "25px",
      boxShadow: "0 8px 25px rgba(2, 62, 138, 0.35)"
    },
    noData: {
      textAlign: "center",
      padding: "50px",
      color: "#64748b",
      fontStyle: "italic",
      fontSize: "1.1rem"
    },
    loadingContainer: {
      textAlign: "center",
      padding: "100px 20px",
      color: "#64748b"
    },
    loadingSpinner: {
      width: "60px",
      height: "60px",
      border: "5px solid #e2e8f0",
      borderTop: "5px solid #023E8A",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      margin: "0 auto 25px auto"
    },
    loadingText: {
      fontSize: "1.2rem",
      fontWeight: "600",
      color: "#64748b"
    }
  };

  const styleSheet = `
    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateY(-30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    
    @keyframes slideInLeft {
      from {
        opacity: 0;
        transform: translateX(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    @keyframes growUp {
      from {
        transform: scaleY(0);
        transform-origin: bottom;
      }
      to {
        transform: scaleY(1);
        transform-origin: bottom;
      }
    }
    
    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-10px);
      }
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @keyframes shimmer {
      0% {
        background-position: -1000px 0;
      }
      100% {
        background-position: 1000px 0;
      }
    }
    
    .stat-card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 20px 60px rgba(2, 62, 138, 0.15);
    }
    
    .stat-card:hover .stat-glow {
      opacity: 1;
    }
    
    .bar:hover {
      filter: brightness(1.1);
      transform: scaleY(1.05);
    }
    
    .revenue-bar:hover {
      filter: brightness(1.15);
    }
    
    .status-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    }
    
    .product-item:hover {
      transform: translateX(8px);
      box-shadow: 0 4px 15px rgba(220, 53, 69, 0.15);
    }
    
    .button-hover:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 35px rgba(2, 62, 138, 0.4);
    }
    
    .button-hover:active {
      transform: translateY(-1px);
    }
    
    .insight-item:hover {
      transform: translateX(5px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      border-color: #023E8A;
    }
    
    .analyzing-shimmer {
      background: linear-gradient(90deg, #023E8A 0%, #0353b8 50%, #023E8A 100%);
      background-size: 1000px 100%;
      animation: shimmer 2s infinite;
    }
  `;

  if (loading) {
    return (
      <div style={styles.container}>
        <style>{styleSheet}</style>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <div style={styles.loadingText}>Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{styleSheet}</style>
      <div style={styles.backgroundPattern}></div>
      
      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>Sales Dashboard</h1>
          <p style={styles.subtitle}>Comprehensive overview of your sales performance</p>
        </div>

        <button
          className={analyzing ? "analyzing-shimmer" : "button-hover"}
          style={styles.analyzeButton}
          onClick={analyzeSales}
          disabled={analyzing}
        >
          {analyzing ? "🔍 Analyzing..." : "🧠 Analyze Sales"}
        </button>

        {insights.length > 0 && (
          <div style={styles.insightsBox}>
            <h3 style={styles.insightsTitle}>
              <span>🤖</span> AI Sales Insights
            </h3>
            {insights.map((insight, idx) => (
              <div 
                key={idx} 
                className="insight-item"
                style={{
                  ...styles.insightItem,
                  animationDelay: `${idx * 0.1}s`
                }}
              >
                {insight}
              </div>
            ))}
          </div>
        )}

        <div style={styles.statsGrid}>
          <div className="stat-card" style={styles.statCard}>
            <div className="stat-glow" style={styles.statCardGlow}></div>
            <span style={styles.statIcon}>💰</span>
            <div style={styles.statLabel}>Total Revenue</div>
            <div style={styles.statValue}>Rs.{animatedValues.totalSales.toLocaleString()}</div>
            <div style={styles.statSubtext}>All-time sales revenue</div>
          </div>

          <div className="stat-card" style={styles.statCard}>
            <div className="stat-glow" style={styles.statCardGlow}></div>
            <span style={styles.statIcon}>📊</span>
            <div style={styles.statLabel}>Total Transactions</div>
            <div style={styles.statValue}>{animatedValues.salesCount}</div>
            <div style={styles.statSubtext}>Completed sales</div>
          </div>

          <div className="stat-card" style={styles.statCard}>
            <div className="stat-glow" style={styles.statCardGlow}></div>
            <span style={styles.statIcon}>📈</span>
            <div style={styles.statLabel}>Average Sale</div>
            <div style={styles.statValue}>Rs.{animatedValues.avgSale.toFixed(0)}</div>
            <div style={styles.statSubtext}>Per transaction</div>
          </div>

          <div className="stat-card" style={styles.statCard}>
            <div className="stat-glow" style={styles.statCardGlow}></div>
            <span style={styles.statIcon}>🔄</span>
            <div style={styles.statLabel}>Returns</div>
            <div style={styles.statValue}>{animatedValues.returns}</div>
            <div style={styles.statSubtext}>Total returned items</div>
          </div>
        </div>

        <div style={styles.chartSection}>
          <h2 style={styles.chartTitle}>
            <span>📊</span> Weekly Sales Performance (Last 7 Days)
          </h2>
          <div style={styles.barChart}>
            {weeklyData.map((day, index) => (
              <div key={index} style={styles.barContainer}>
                <div 
                  className="bar"
                  style={{
                    ...styles.bar,
                    height: `${(day.amount / maxWeeklyAmount) * 100}%`,
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  {day.amount > 0 && (
                    <span style={styles.barAmount}>Rs.{day.amount.toLocaleString()}</span>
                  )}
                </div>
                <div style={styles.barLabel}>{day.day}</div>
                <div style={styles.barValue}>{day.date}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.chartSection}>
          <h2 style={styles.chartTitle}>
            <span>📈</span> Revenue Trend Analysis
          </h2>
          <div style={styles.revenueChart}>
            <div style={styles.revenueLine}>
              {weeklyData.map((day, index) => (
                <div
                  key={index}
                  className="revenue-bar"
                  style={{
                    ...styles.revenueBar,
                    height: `${(day.amount / maxWeeklyAmount) * 100}%`,
                    animationDelay: `${index * 0.15}s`
                  }}
                  title={`${day.day}: Rs.${day.amount.toLocaleString()}`}
                ></div>
              ))}
            </div>
          </div>

          <h3 style={{...styles.chartTitle, marginTop: "35px", fontSize: "1.3rem"}}>
            <span>💳</span> Payment Status Breakdown
          </h3>
          <div style={styles.paymentBreakdown}>
            <div className="status-card" style={styles.statusCard}>
              <div style={{...styles.statusNumber, color: '#10b981'}}>
                {paymentBreakdown.Paid}
              </div>
              <div style={{...styles.statusLabel, color: '#10b981'}}>Paid</div>
            </div>
            <div className="status-card" style={styles.statusCard}>
              <div style={{...styles.statusNumber, color: '#f59e0b'}}>
                {paymentBreakdown.Pending}
              </div>
              <div style={{...styles.statusLabel, color: '#f59e0b'}}>Pending</div>
            </div>
            <div className="status-card" style={styles.statusCard}>
              <div style={{...styles.statusNumber, color: '#ef4444'}}>
                {paymentBreakdown.Cancelled}
              </div>
              <div style={{...styles.statusLabel, color: '#ef4444'}}>Cancelled</div>
            </div>
            <div className="status-card" style={styles.statusCard}>
              <div style={{...styles.statusNumber, color: '#64748b'}}>
                {paymentBreakdown.Returned}
              </div>
              <div style={{...styles.statusLabel, color: '#64748b'}}>Returned</div>
            </div>
          </div>
        </div>

        <div style={styles.returnsSection}>
          <div style={styles.returnsHeader}>
            <h2 style={styles.returnsTitle}>
              <span>⚠️</span> Returns Analysis
            </h2>
            <div style={styles.returnsStats}>
              <div style={styles.returnsStat}>
                <div style={styles.returnsStatValue}>{returnsData.total}</div>
                <div style={styles.returnsStatLabel}>Total Returns</div>
              </div>
              <div style={styles.returnsStat}>
                <div style={styles.returnsStatValue}>
                  Rs.{returnsData.totalAmount.toLocaleString()}
                </div>
                <div style={styles.returnsStatLabel}>Refund Amount</div>
              </div>
            </div>
          </div>

          {returnsData.byProduct.length > 0 ? (
            <>
              <div style={styles.productsList}>
                {returnsData.byProduct.map((item, index) => (
                  <div key={index} className="product-item" style={styles.productItem}>
                    <span style={styles.productName}>{item.product}</span>
                    <div style={styles.productStats}>
                      <span style={styles.productCount}>{item.count} returns</span>
                      <span style={styles.productAmount}>
                        Rs.{item.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Link 
                to="/products/control"
                className="button-hover"
                style={styles.reviewButton}
              >
                Review Products
              </Link>
            </>
          ) : (
            <div style={styles.noData}>No returns recorded</div>
          )}
        </div>

        <div style={{textAlign: "center"}}>
          <Link 
            to="/sales/list" 
            className="button-hover"
            style={styles.viewAllButton}
          >
            View All Sales
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SalesDashboardPage;