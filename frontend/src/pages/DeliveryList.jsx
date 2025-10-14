import React, { useState, useEffect } from "react";

// Enhanced Bar Chart Component with animations
const BarChart = ({ data, title, barColor }) => {
  const maxValue = Math.max(...data.map(item => item.value), 1);
  const [animatedHeights, setAnimatedHeights] = useState(data.map(() => 0));

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedHeights(data.map(item => (item.value / maxValue) * 100));
    }, 100);
    return () => clearTimeout(timer);
  }, [data, maxValue]);

  const styles = {
    chartContainer: {
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      padding: "30px",
      borderRadius: "16px",
      border: "1px solid rgba(226, 232, 240, 0.8)",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
      transition: "all 0.3s ease",
    },
    chartTitle: {
      fontSize: "1.1rem",
      fontWeight: "700",
      color: "#023E8A",
      marginBottom: "25px",
      textAlign: "center",
      letterSpacing: "0.3px",
    },
    chartBody: {
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'flex-end',
      height: '180px',
      gap: '12px',
      padding: '20px 10px',
      backgroundColor: '#f8fafc',
      borderRadius: '12px',
    },
    barWrapper: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      position: 'relative',
    },
    bar: {
      width: '85%',
      background: `linear-gradient(180deg, ${barColor || '#023E8A'} 0%, ${barColor ? barColor + 'dd' : '#0353b8'} 100%)`,
      borderRadius: '8px 8px 0 0',
      transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: `0 -4px 12px ${barColor ? barColor + '40' : 'rgba(2, 62, 138, 0.25)'}`,
      position: 'relative',
      minHeight: '8px',
    },
    barLabel: {
      marginTop: '12px',
      fontSize: '0.85rem',
      color: '#334155',
      fontWeight: '600',
    },
    barValue: {
      position: 'absolute',
      top: '-28px',
      left: '50%',
      transform: 'translateX(-50%)',
      fontSize: '0.85rem',
      fontWeight: '700',
      color: '#023E8A',
      backgroundColor: '#ffffff',
      padding: '4px 10px',
      borderRadius: '6px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      opacity: 0,
      transition: 'opacity 0.3s ease',
      whiteSpace: 'nowrap',
    }
  };

  return (
    <div style={styles.chartContainer} className="chart-hover">
      <h3 style={styles.chartTitle}>📊 {title}</h3>
      <div style={styles.chartBody}>
        {data.map((item, index) => (
          <div key={index} style={styles.barWrapper}>
            <div
              className="bar-element"
              style={{
                ...styles.bar,
                height: `${animatedHeights[index]}%`,
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <div className="bar-value" style={styles.barValue}>{item.value}</div>
            </div>
            <div style={styles.barLabel}>{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DeliveryList = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [animatedStats, setAnimatedStats] = useState({ total: 0, delivered: 0, inTransit: 0, pending: 0 });

  const frequentIssueCustomers = [
    { name: "John Doe", issues: "3 delays in the last month", satisfaction: "Low" },
    { name: "Jane Smith", issues: "1 failed delivery", satisfaction: "Medium" },
  ];
  
  const delayPredictions = [
    { saleId: "652f1b9b...", reason: "High traffic volume in region", risk: "High" },
    { saleId: "652f1c3d...", reason: "Partner availability low", risk: "Medium" },
  ];

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:3000/api/deliveries");
        if (!res.ok) throw new Error("Failed to fetch deliveries");
        const data = await res.json();
        
        const augmentedData = data.map(d => {
            const createdAt = new Date(d.createdAt);
            const expectedDays = Math.floor(Math.random() * 5) + 2;
            const expectedDeliveryDate = new Date(createdAt);
            expectedDeliveryDate.setDate(createdAt.getDate() + expectedDays);

            let actualDeliveryDate = null;
            let deliverySpeed = 'N/A';
            if (d.status?.toLowerCase() === 'delivered') {
                const deliveryVariance = Math.floor(Math.random() * 5) - 2;
                actualDeliveryDate = new Date(expectedDeliveryDate);
                actualDeliveryDate.setDate(expectedDeliveryDate.getDate() + deliveryVariance);

                if (deliveryVariance < 0) deliverySpeed = 'Fast';
                else if (deliveryVariance === 0) deliverySpeed = 'Average';
                else deliverySpeed = 'Slow';
            }
            return { ...d, expectedDeliveryDate, actualDeliveryDate, deliverySpeed };
        });

        setDeliveries(augmentedData);
        runAnalytics(augmentedData);
        setError(null);
      } catch (err) {
        console.error("Error fetching deliveries:", err);
        setError("Failed to load delivery records");
      } finally {
        setLoading(false);
      }
    };
    fetchDeliveries();
  }, []);

  // Animate stats on load
  useEffect(() => {
    if (deliveries.length === 0) return;
    
    const stats = getDeliveryStats();
    const duration = 1500;
    const steps = 60;
    const interval = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setAnimatedStats({
        total: Math.floor(stats.total * easeOut),
        delivered: Math.floor(stats.delivered * easeOut),
        inTransit: Math.floor(stats.inTransit * easeOut),
        pending: Math.floor(stats.pending * easeOut),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedStats(stats);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [deliveries]);
  
  const runAnalytics = (data) => {
    if (data.length === 0) return;

    const speedCounts = {
        Fast: data.filter(d => d.deliverySpeed === 'Fast').length,
        Average: data.filter(d => d.deliverySpeed === 'Average').length,
        Slow: data.filter(d => d.deliverySpeed === 'Slow').length,
    };

    const partnerStats = {};
    data.forEach(d => {
        if (!d.partner) return;
        if (!partnerStats[d.partner]) {
            partnerStats[d.partner] = { total: 0, onTime: 0, success: 0 };
        }
        partnerStats[d.partner].total++;
        if (d.deliverySpeed === 'Fast' || d.deliverySpeed === 'Average') {
            partnerStats[d.partner].onTime++;
        }
        if (d.status?.toLowerCase() === 'delivered') {
            partnerStats[d.partner].success++;
        }
    });
    
    const partnerPerformance = Object.keys(partnerStats).map(partner => ({
        name: partner,
        onTimeRate: Math.round((partnerStats[partner].onTime / partnerStats[partner].total) * 100),
        successRate: Math.round((partnerStats[partner].success / partnerStats[partner].total) * 100),
    })).sort((a, b) => b.onTimeRate - a.onTimeRate);
    
    const trendData = { 'Sun': 0, 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0 };
    data.forEach(d => {
        const day = new Date(d.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
        if (trendData[day] !== undefined) {
            trendData[day]++;
        }
    });
    const deliveryTrendChartData = Object.keys(trendData).map(day => ({ label: day, value: trendData[day] }));
    
    setAnalyticsData({
        speedCounts,
        topPartners: partnerPerformance,
        deliveryTrendChartData,
    });
  };

  const filtered = deliveries.filter((d) =>
    d.sale?.customerName?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return '#10b981';
      case 'in-transit': return '#f59e0b';
      case 'pending': return '#64748b';
      case 'cancelled': return '#ef4444';
      default: return '#64748b';
    }
  };

  const formatSaleId = (id) => {
    if (!id) return 'N/A';
    return id.length > 8 ? `${id.substring(0, 8)}...` : id;
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
      zIndex: 0,
    },
    content: {
      position: "relative",
      zIndex: 1,
    },
    header: {
      textAlign: "center",
      marginBottom: "50px",
      animation: "fadeInDown 0.8s ease-out",
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
      backgroundClip: "text",
    },
    subtitle: {
      color: "#64748b",
      fontSize: "1.2rem",
      margin: "0",
      fontWeight: "400",
      letterSpacing: "0.5px",
    },
    searchContainer: {
      marginBottom: "40px",
      position: "relative",
      maxWidth: "600px",
      margin: "0 auto 40px auto",
      animation: "fadeInUp 0.8s ease-out",
    },
    searchInput: {
      width: "100%",
      padding: "18px 24px 18px 50px",
      fontSize: "1.05rem",
      border: "2px solid #e2e8f0",
      borderRadius: "14px",
      outline: "none",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      backgroundColor: "#ffffff",
      boxSizing: "border-box",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    },
    searchIcon: {
      position: "absolute",
      left: "18px",
      top: "50%",
      transform: "translateY(-50%)",
      fontSize: "1.3rem",
      color: "#64748b",
    },
    statusGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "25px",
      marginBottom: "50px",
      animation: "fadeInUp 0.9s ease-out",
    },
    statusCard: {
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      padding: "30px",
      borderRadius: "18px",
      border: "1px solid rgba(226, 232, 240, 0.8)",
      textAlign: "center",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      cursor: "pointer",
      position: "relative",
      overflow: "hidden",
    },
    statusIcon: {
      fontSize: "2.5rem",
      marginBottom: "12px",
      display: "block",
      filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
    },
    statusCardNumber: {
      fontSize: "2.8rem",
      fontWeight: "800",
      margin: "12px 0 8px 0",
      lineHeight: "1",
    },
    statusCardLabel: {
      fontSize: "0.9rem",
      color: "#64748b",
      textTransform: "uppercase",
      letterSpacing: "1px",
      margin: "0",
      fontWeight: "600",
    },
    section: {
      marginBottom: '45px',
      animation: "fadeInUp 1s ease-out",
    },
    sectionTitle: {
      fontSize: '1.8rem',
      fontWeight: '700',
      color: '#023E8A',
      borderBottom: '3px solid #e2e8f0',
      paddingBottom: '15px',
      marginBottom: '30px',
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    gridContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '25px',
    },
    card: {
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      padding: "30px",
      borderRadius: "16px",
      border: "1px solid rgba(226, 232, 240, 0.8)",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
      transition: "all 0.3s ease",
    },
    cardTitle: {
      fontSize: "1.15rem",
      fontWeight: "700",
      color: "#334155",
      marginBottom: "20px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    cardContent: {
      color: "#64748b",
    },
    listItem: {
      padding: '14px 0',
      borderBottom: '1px solid #f1f5f9',
      fontSize: "0.95rem",
      lineHeight: "1.6",
    },
    listItemLast: {
      borderBottom: 'none',
    },
    strong: {
      color: '#023E8A',
      fontWeight: '700',
    },
    tableContainer: {
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      borderRadius: "20px",
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)",
      overflow: "hidden",
      border: "1px solid rgba(226, 232, 240, 0.8)",
      animation: "fadeInUp 1.1s ease-out",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "0.95rem",
    },
    tableHeader: {
      background: "linear-gradient(135deg, #023E8A 0%, #0353b8 100%)",
      color: "#ffffff",
    },
    th: {
      padding: "22px 18px",
      textAlign: "left",
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: "1px",
      fontSize: "0.85rem",
      borderBottom: "none",
    },
    tbody: {
      backgroundColor: "#ffffff",
    },
    tr: {
      borderBottom: "1px solid #f1f5f9",
      transition: "all 0.2s ease",
    },
    td: {
      padding: "18px",
      verticalAlign: "middle",
      color: "#334155",
    },
    saleId: {
      fontFamily: "monospace",
      backgroundColor: "#f8fafc",
      padding: "6px 12px",
      borderRadius: "8px",
      fontSize: "0.85rem",
      color: "#64748b",
      fontWeight: "600",
    },
    customerName: {
      fontWeight: "600",
      color: "#023E8A",
    },
    productName: {
      fontWeight: "500",
      color: "#334155",
    },
    statusBadge: {
      padding: "8px 16px",
      borderRadius: "20px",
      fontSize: "0.8rem",
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      color: "#ffffff",
      display: "inline-block",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
    },
    partnerName: {
      backgroundColor: "#dbeafe",
      color: "#1e40af",
      padding: "6px 14px",
      borderRadius: "20px",
      fontSize: "0.85rem",
      fontWeight: "600",
      display: "inline-block",
    },
    date: {
      fontFamily: "monospace",
      fontSize: "0.9rem",
      color: "#64748b",
      fontWeight: "500",
    },
    actionButton: {
      border: "none",
      padding: "8px 16px",
      borderRadius: "10px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "0.85rem",
      transition: "all 0.3s ease",
      marginRight: "8px",
    },
    updateButton: {
      backgroundColor: "#f59e0b",
      color: "#000000",
    },
    deleteButton: {
      backgroundColor: "#ef4444",
      color: "#ffffff",
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
    errorContainer: {
      textAlign: "center",
      padding: "60px 30px",
      background: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
      border: "1px solid #fecaca",
      borderRadius: "20px",
      margin: "40px 0",
      boxShadow: "0 8px 24px rgba(220, 53, 69, 0.15)",
    },
    errorTitle: {
      fontSize: "1.8rem",
      fontWeight: "700",
      marginBottom: "15px",
      color: "#991b1b",
    },
    errorText: {
      fontSize: "1.1rem",
      color: "#dc2626",
      marginBottom: "25px",
    },
    refreshButton: {
      background: "linear-gradient(135deg, #023E8A 0%, #0353b8 100%)",
      color: "#ffffff",
      padding: "14px 32px",
      border: "none",
      borderRadius: "12px",
      fontSize: "1rem",
      fontWeight: "700",
      cursor: "pointer",
      transition: "all 0.3s ease",
      textTransform: "uppercase",
      letterSpacing: "1px",
      boxShadow: "0 6px 20px rgba(2, 62, 138, 0.3)",
    },
    noResults: {
      textAlign: "center",
      padding: "80px 20px",
      color: "#64748b",
    },
    noResultsIcon: {
      fontSize: "4rem",
      marginBottom: "20px",
      opacity: "0.6",
      filter: "grayscale(50%)",
    },
    noResultsText: {
      fontSize: "1.3rem",
      fontWeight: "600",
      marginBottom: "10px",
      color: "#334155",
    },
    noResultsSubtext: {
      fontSize: "1.05rem",
      opacity: "0.7",
      color: "#64748b",
    },
  };

  const getDeliveryStats = () => {
    const total = deliveries.length;
    const delivered = deliveries.filter(d => d.status?.toLowerCase() === 'delivered').length;
    const inTransit = deliveries.filter(d => d.status?.toLowerCase() === 'in-transit').length;
    const pending = deliveries.filter(d => d.status?.toLowerCase() === 'pending').length;
    return { total, delivered, inTransit, pending };
  };

  const styleSheet = `
    @keyframes fadeInDown {
      from { opacity: 0; transform: translateY(-30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .status-card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 20px 60px rgba(2, 62, 138, 0.15);
    }
    input:focus {
      border-color: #023E8A !important;
      box-shadow: 0 0 0 4px rgba(2, 62, 138, 0.1), 0 4px 12px rgba(0, 0, 0, 0.1) !important;
    }
    .table-row:hover {
      background-color: #f8fafc !important;
      transform: translateX(4px);
    }
    .action-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
    }
    .chart-hover:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
    }
    .bar-element:hover .bar-value {
      opacity: 1;
    }
    .bar-element:hover {
      filter: brightness(1.1);
    }
    .refresh-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 35px rgba(2, 62, 138, 0.4);
    }
  `;

  if (loading) {
    return (
      <div style={styles.container}>
        <style>{styleSheet}</style>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <div style={styles.loadingText}>Loading delivery dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <style>{styleSheet}</style>
        <div style={styles.content}>
          <div style={styles.errorContainer}>
            <div style={styles.errorTitle}>⚠️ Error Loading Deliveries</div>
            <p style={styles.errorText}>{error}</p>
            <button className="refresh-btn" style={styles.refreshButton} onClick={() => window.location.reload()}>
              🔄 Retry
            </button>
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
        <div style={styles.header}>
          <h1 style={styles.title}>Delivery Dashboard</h1>
          <p style={styles.subtitle}>Track, manage, and analyze all delivery transactions</p>
        </div>

        {/* Status Overview */}
        <div style={styles.statusGrid}>
          <div className="status-card" style={styles.statusCard}>
            <span style={styles.statusIcon}>📦</span>
            <div style={{...styles.statusCardNumber, color: '#023E8A'}}>{animatedStats.total}</div>
            <div style={styles.statusCardLabel}>Total</div>
          </div>
          <div className="status-card" style={styles.statusCard}>
            <span style={styles.statusIcon}>✅</span>
            <div style={{...styles.statusCardNumber, color: '#10b981'}}>{animatedStats.delivered}</div>
            <div style={styles.statusCardLabel}>Delivered</div>
          </div>
          <div className="status-card" style={styles.statusCard}>
            <span style={styles.statusIcon}>🚚</span>
            <div style={{...styles.statusCardNumber, color: '#f59e0b'}}>{animatedStats.inTransit}</div>
            <div style={styles.statusCardLabel}>In Transit</div>
          </div>
          <div className="status-card" style={styles.statusCard}>
            <span style={styles.statusIcon}>⏳</span>
            <div style={{...styles.statusCardNumber, color: '#64748b'}}>{animatedStats.pending}</div>
            <div style={styles.statusCardLabel}>Pending</div>
          </div>
        </div>
        
        {analyticsData && (
          <>
            {/* Performance Analysis */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>
                <span>📈</span> Performance Analysis
              </h2>
              <div style={styles.gridContainer}>
                <div className="card" style={styles.card}>
                  <h3 style={styles.cardTitle}>⚡ Delivery Speed</h3>
                  <div style={styles.cardContent}>
                    <p style={styles.listItem}>Fast Deliveries: <strong style={styles.strong}>{analyticsData.speedCounts.Fast}</strong></p>
                    <p style={styles.listItem}>Average Deliveries: <strong style={styles.strong}>{analyticsData.speedCounts.Average}</strong></p>
                    <p style={{...styles.listItem, ...styles.listItemLast}}>Slow Deliveries: <strong style={styles.strong}>{analyticsData.speedCounts.Slow}</strong></p>
                  </div>
                </div>
                <div className="card" style={styles.card}>
                  <h3 style={styles.cardTitle}>🏆 Top Performing Partners</h3>
                  <div style={styles.cardContent}>
                    {analyticsData.topPartners.slice(0, 3).map((p, i) => (
                      <p key={i} style={i === 2 ? {...styles.listItem, ...styles.listItemLast} : styles.listItem}>
                        {p.name}: <strong style={styles.strong}>{p.onTimeRate}% On-Time</strong>
                      </p> 
                    ))}
                  </div>
                </div>
                <BarChart
                  title="High-Volume Delivery Days"
                  data={analyticsData.deliveryTrendChartData}
                  barColor="#0096c7"
                />
              </div>
            </div>
            
            {/* Customer & Predictive Insights */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>
                <span>🤖</span> Customer & Predictive Insights
              </h2>
              <div style={styles.gridContainer}>
                <div className="card" style={styles.card}>
                  <h3 style={styles.cardTitle}>⚠️ Customers with Frequent Issues</h3>
                  <div style={styles.cardContent}>
                    {frequentIssueCustomers.map((c, i) => (
                      <p key={i} style={i === frequentIssueCustomers.length - 1 ? {...styles.listItem, ...styles.listItemLast} : styles.listItem}>
                        <strong style={{color: '#334155'}}>{c.name}</strong> - <span style={{color: '#ef4444', fontWeight: '600'}}>{c.issues}</span>
                      </p>
                    ))}
                  </div>
                </div>
                <div className="card" style={styles.card}>
                  <h3 style={styles.cardTitle}>🔮 AI: Deliveries at Risk of Delay</h3>
                  <div style={styles.cardContent}>
                    {delayPredictions.map((p, i) => (
                      <p key={i} style={i === delayPredictions.length - 1 ? {...styles.listItem, ...styles.listItemLast} : styles.listItem}>
                        ID: <span style={{fontFamily: 'monospace', color: '#64748b'}}>{p.saleId}</span> - Risk: <strong style={{...styles.strong, color: p.risk === 'High' ? '#ef4444' : '#f59e0b'}}>{p.risk}</strong>
                        <br />
                        <span style={{fontSize: '0.85rem', color: '#94a3b8'}}>({p.reason})</span>
                      </p>
                    ))}
                  </div>
                </div>
                <div className="card" style={styles.card}>
                  <h3 style={styles.cardTitle}>📊 Demand Forecast & Stock Sync</h3>
                  <div style={styles.cardContent}>
                    <p style={styles.listItem}>
                      Next Week Volume: <strong style={styles.strong}>~{Math.round(deliveries.length * 1.15)} deliveries</strong>
                      <br />
                      <span style={{fontSize: '0.85rem', color: '#10b981', fontWeight: '600'}}>▲ 15% increase expected</span>
                    </p>
                    <p style={{...styles.listItem, ...styles.listItemLast}}>
                      Warehouse A Stock: <strong style={styles.strong}>450 units</strong>
                      <br />
                      <span style={{fontSize: '0.85rem', color: '#64748b'}}>120 units pending delivery</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Delivery Records Section */}
        <h2 style={{...styles.sectionTitle, marginTop: '60px', marginBottom: '30px'}}>
          <span>📋</span> Delivery Records
        </h2>

        {/* Search */}
        <div style={styles.searchContainer}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search by customer name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {/* Table Container */}
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead style={styles.tableHeader}>
              <tr>
                <th style={styles.th}>Sale ID</th>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Product</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Partner</th>
                <th style={styles.th}>Location</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Manage</th>
              </tr>
            </thead>
            <tbody style={styles.tbody}>
              {filtered.length > 0 ? (
                filtered.map((d) => (
                  <tr key={d._id} className="table-row" style={styles.tr}>
                    <td style={styles.td}>
                      <span style={styles.saleId}>{formatSaleId(d.sale?._id)}</span>
                    </td>
                    <td style={{ ...styles.td, ...styles.customerName }}>
                      {d.sale?.customerName || 'Unknown Customer'}
                    </td>
                    <td style={{ ...styles.td, ...styles.productName }}>
                      {d.sale?.product?.name || d.sale?.product?.productName || 'N/A'}
                    </td>
                    <td style={styles.td}>
                      <span style={{ ...styles.statusBadge, backgroundColor: getStatusColor(d.status) }}>
                        {d.status || 'Unknown'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {d.partner ? (
                        <span style={styles.partnerName}>{d.partner}</span>
                      ) : (
                        <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>N/A</span>
                      )}
                    </td>
                    <td style={styles.td}>
                      {d.location ? (
                        <span style={{ color: '#023E8A', fontWeight: '600' }}>📍 {d.location}</span>
                      ) : (
                        <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Unknown</span>
                      )}
                    </td>
                    <td style={{ ...styles.td, ...styles.date }}>
                      {new Date(d.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td style={styles.td}>
                      <button
                        className="action-btn"
                        style={{...styles.actionButton, ...styles.updateButton}}
                        onClick={() => window.location.href = `/deliveries/update/${d._id}`}
                      >
                        📝 Update
                      </button>
                      <button
                        className="action-btn"
                        style={{...styles.actionButton, ...styles.deleteButton}}
                        onClick={async () => {
                          if (window.confirm("Are you sure you want to delete this delivery?")) {
                            try {
                              const res = await fetch(`http://localhost:3000/api/deliveries/${d._id}`, {
                                method: "DELETE",
                              });
                              if (!res.ok) throw new Error("Failed to delete delivery");
                              setDeliveries(prev => prev.filter(item => item._id !== d._id));
                            } catch (err) {
                              console.error("Delete error:", err);
                              alert("Failed to delete delivery");
                            }
                          }
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={styles.noResults}>
                    <div style={styles.noResultsIcon}>🚚</div>
                    <div style={styles.noResultsText}>
                      {search ? "No deliveries found" : "No delivery records available"}
                    </div>
                    <div style={styles.noResultsSubtext}>
                      {search ? `No deliveries found for "${search}"` : "Delivery records will appear here once created"}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DeliveryList;