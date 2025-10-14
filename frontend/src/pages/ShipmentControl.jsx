import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ShipmentControl = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [analyzing, setAnalyzing] = useState(false);
  const [insights, setInsights] = useState([]);
  const [animatedStats, setAnimatedStats] = useState({ total: 0, active: 0, filtered: 0 });
  const navigate = useNavigate();

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("http://localhost:3000/api/shipments");
      setShipments(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load shipments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  // Animate stats on load
  useEffect(() => {
    if (shipments.length === 0) return;
    
    const activeCount = shipments.filter(s => s.status !== 'delivered' && s.status !== 'cancelled').length;
    const filteredCount = getFilteredShipments().length;
    
    const duration = 1500;
    const steps = 60;
    const interval = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setAnimatedStats({
        total: Math.floor(shipments.length * easeOut),
        active: Math.floor(activeCount * easeOut),
        filtered: Math.floor(filteredCount * easeOut),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedStats({
          total: shipments.length,
          active: activeCount,
          filtered: filteredCount,
        });
      }
    }, interval);

    return () => clearInterval(timer);
  }, [shipments, searchTerm, statusFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this shipment?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/shipments/${id}`);
      fetchShipments();
    } catch (err) {
      console.error(err);
      alert("Failed to delete shipment");
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'shipped': return '#10b981';
      case 'in-transit': return '#f59e0b';
      case 'delivered': return '#06b6d4';
      case 'pending': return '#64748b';
      case 'cancelled': return '#ef4444';
      default: return '#64748b';
    }
  };

  const getFilteredShipments = () => {
    return shipments.filter(shipment => {
      const matchesSearch = 
        shipment.shipmentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.carrier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.products?.some(p => 
          p.product?.productName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      const matchesStatus = statusFilter === "all" || shipment.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  };

  // AI Analysis Feature
  const analyzeShipments = () => {
    setAnalyzing(true);
    
    setTimeout(() => {
      const insightsList = [];
      
      // 1. Carrier Performance Analysis
      const carrierStats = {};
      shipments.forEach(s => {
        if (!carrierStats[s.carrier]) {
          carrierStats[s.carrier] = { total: 0, delivered: 0, cancelled: 0 };
        }
        carrierStats[s.carrier].total++;
        if (s.status === 'delivered') carrierStats[s.carrier].delivered++;
        if (s.status === 'cancelled') carrierStats[s.carrier].cancelled++;
      });
      
      const carrierPerformance = Object.entries(carrierStats)
        .map(([carrier, stats]) => ({
          carrier,
          successRate: ((stats.delivered / stats.total) * 100).toFixed(1)
        }))
        .sort((a, b) => b.successRate - a.successRate);
      
      if (carrierPerformance.length > 0) {
        const best = carrierPerformance[0];
        insightsList.push(`🏆 Best Carrier: ${best.carrier} with ${best.successRate}% delivery success rate`);
        
        if (carrierPerformance.length > 1) {
          const worst = carrierPerformance[carrierPerformance.length - 1];
          insightsList.push(`⚠️ ${worst.carrier} has the lowest success rate (${worst.successRate}%) - consider alternatives`);
        }
      }
      
      // 2. Status Distribution
      const statusCounts = {
        pending: shipments.filter(s => s.status === 'pending').length,
        shipped: shipments.filter(s => s.status === 'shipped').length,
        inTransit: shipments.filter(s => s.status === 'in-transit').length,
        delivered: shipments.filter(s => s.status === 'delivered').length,
        cancelled: shipments.filter(s => s.status === 'cancelled').length,
      };
      
      if (statusCounts.pending > 5) {
        insightsList.push(`📋 ${statusCounts.pending} shipments pending - prioritize processing to avoid delays`);
      }
      
      if (statusCounts.cancelled > 0) {
        const cancelRate = ((statusCounts.cancelled / shipments.length) * 100).toFixed(1);
        insightsList.push(`❌ ${statusCounts.cancelled} cancelled shipments (${cancelRate}%) - investigate root causes`);
      }
      
      // 3. Active Shipments
      const active = statusCounts.shipped + statusCounts.inTransit;
      if (active > 0) {
        insightsList.push(`🚚 ${active} shipments currently in transit - monitor for timely delivery`);
      }
      
      // 4. Product Analysis
      const productFrequency = {};
      shipments.forEach(s => {
        s.products?.forEach(p => {
          const name = p.product?.productName || 'Unknown';
          productFrequency[name] = (productFrequency[name] || 0) + p.quantity;
        });
      });
      
      const topProducts = Object.entries(productFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);
      
      if (topProducts.length > 0) {
        insightsList.push(`📦 Most shipped: ${topProducts[0][0]} (${topProducts[0][1]} units)`);
      }
      
      // 5. Overall Health
      const deliveryRate = ((statusCounts.delivered / shipments.length) * 100).toFixed(1);
      if (deliveryRate > 80) {
        insightsList.push(`✅ Excellent delivery rate: ${deliveryRate}% - operations running smoothly`);
      } else if (deliveryRate < 50) {
        insightsList.push(`🔴 Low delivery rate: ${deliveryRate}% - immediate attention required`);
      }
      
      setInsights(insightsList);
      setAnalyzing(false);
    }, 1200);
  };

  const filteredShipments = getFilteredShipments();

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
    controlsContainer: {
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      padding: "30px",
      borderRadius: "20px",
      marginBottom: "35px",
      border: "1px solid rgba(226, 232, 240, 0.8)",
      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.06)",
      animation: "fadeInUp 0.8s ease-out",
    },
    controlsRow: {
      display: "flex",
      gap: "20px",
      alignItems: "center",
      flexWrap: "wrap",
    },
    searchInput: {
      flex: "1",
      padding: "16px 50px 16px 20px",
      border: "2px solid #e2e8f0",
      borderRadius: "14px",
      fontSize: "1.05rem",
      outline: "none",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      minWidth: "300px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
      backgroundColor: "#ffffff",
    },
    searchIcon: {
      position: "absolute",
      right: "20px",
      top: "50%",
      transform: "translateY(-50%)",
      fontSize: "1.3rem",
      color: "#64748b",
      pointerEvents: "none",
    },
    select: {
      padding: "14px 40px 14px 18px",
      border: "2px solid #e2e8f0",
      borderRadius: "12px",
      fontSize: "1rem",
      outline: "none",
      backgroundColor: "#ffffff",
      cursor: "pointer",
      minWidth: "180px",
      fontWeight: "600",
      transition: "all 0.3s ease",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
      appearance: "none",
      backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23023E8A' d='M6 9L1 4h10z'/%3E%3C/svg%3E\")",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 16px center",
    },
    addButton: {
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
    analyzeButton: {
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
    insightsBox: {
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      border: "1px solid rgba(226, 232, 240, 0.8)",
      borderRadius: "20px",
      padding: "35px",
      margin: "0 0 35px 0",
      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
      animation: "scaleIn 0.5s ease-out",
    },
    insightsTitle: {
      color: "#023E8A",
      marginBottom: "20px",
      fontSize: "1.5rem",
      fontWeight: "700",
      display: "flex",
      alignItems: "center",
      gap: "10px",
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
      animationFillMode: "both",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "20px",
      marginBottom: "35px",
      animation: "fadeInUp 0.9s ease-out",
    },
    statCard: {
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      padding: "30px",
      borderRadius: "18px",
      border: "1px solid rgba(226, 232, 240, 0.8)",
      textAlign: "center",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      cursor: "pointer",
    },
    statIcon: {
      fontSize: "2.5rem",
      marginBottom: "12px",
      display: "block",
      filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
    },
    statNumber: {
      fontSize: "2.8rem",
      fontWeight: "800",
      margin: "12px 0 8px 0",
      lineHeight: "1",
    },
    statLabel: {
      fontSize: "0.9rem",
      color: "#64748b",
      textTransform: "uppercase",
      letterSpacing: "1px",
      fontWeight: "600",
    },
    tableContainer: {
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      borderRadius: "20px",
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)",
      overflow: "hidden",
      border: "1px solid rgba(226, 232, 240, 0.8)",
      animation: "fadeInUp 1s ease-out",
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
    shipmentId: {
      fontFamily: "monospace",
      backgroundColor: "#f8fafc",
      padding: "6px 12px",
      borderRadius: "8px",
      fontSize: "0.85rem",
      fontWeight: "700",
      color: "#023E8A",
    },
    carrier: {
      backgroundColor: "#dbeafe",
      color: "#1e40af",
      padding: "6px 14px",
      borderRadius: "20px",
      fontSize: "0.85rem",
      fontWeight: "600",
      display: "inline-block",
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
    productsList: {
      maxWidth: "350px",
      fontSize: "0.9rem",
      lineHeight: "1.6",
    },
    productItem: {
      backgroundColor: "#f8fafc",
      padding: "4px 10px",
      borderRadius: "6px",
      margin: "3px",
      display: "inline-block",
      fontSize: "0.85rem",
      border: "1px solid #e2e8f0",
      fontWeight: "500",
    },
    actionsContainer: {
      display: "flex",
      gap: "10px",
      alignItems: "center",
      flexWrap: "wrap",
    },
    updateButton: {
      background: "linear-gradient(135deg, #023E8A 0%, #0353b8 100%)",
      color: "#ffffff",
      padding: "10px 20px",
      border: "none",
      borderRadius: "10px",
      fontSize: "0.85rem",
      fontWeight: "700",
      cursor: "pointer",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      boxShadow: "0 4px 12px rgba(2, 62, 138, 0.3)",
    },
    deleteButton: {
      background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
      color: "#ffffff",
      padding: "10px 20px",
      border: "none",
      borderRadius: "10px",
      fontSize: "0.85rem",
      fontWeight: "700",
      cursor: "pointer",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
    },
    loadingContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      gap: "30px",
    },
    loadingSpinner: {
      width: "60px",
      height: "60px",
      border: "5px solid #e2e8f0",
      borderTop: "5px solid #023E8A",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
    loadingText: {
      fontSize: "1.2rem",
      fontWeight: "600",
      color: "#64748b",
    },
    shipmentCard: {
      background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
      borderRadius: "12px",
      padding: "20px",
      marginBottom: "15px",
      border: "1px solid #e2e8f0",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
      animation: "slideInRight 0.5s ease-out",
      animationFillMode: "both",
    },
    errorContainer: {
      textAlign: "center",
      padding: "60px 30px",
      background: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
      border: "1px solid #fecaca",
      borderRadius: "20px",
      margin: "40px 0",
      boxShadow: "0 10px 40px rgba(220, 53, 69, 0.15)",
    },
    errorTitle: {
      fontSize: "1.8rem",
      fontWeight: "700",
      marginBottom: "15px",
      color: "#991b1b",
    },
    noResults: {
      textAlign: "center",
      padding: "80px 20px",
      color: "#64748b",
    },
    noResultsIcon: {
      fontSize: "5rem",
      marginBottom: "20px",
      opacity: "0.6",
    },
    noResultsText: {
      fontSize: "1.4rem",
      fontWeight: "600",
      marginBottom: "10px",
      color: "#334155",
    },
    noResultsSubtext: {
      fontSize: "1.05rem",
      color: "#64748b",
    },
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
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes slideInLeft {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes shimmer {
      0% { background-position: -1000px 0; }
      100% { background-position: 1000px 0; }
    }
    .stat-card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 20px 60px rgba(2, 62, 138, 0.15);
    }
    .table-row:hover {
      background-color: #f8fafc !important;
      transform: translateX(4px);
    }
    input:focus, select:focus {
      border-color: #023E8A !important;
      box-shadow: 0 0 0 4px rgba(2, 62, 138, 0.1), 0 4px 12px rgba(0, 0, 0, 0.08) !important;
      transform: translateY(-1px);
    }
    .action-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    }
    .action-btn:active {
      transform: translateY(-1px);
    }
    .analyzing-shimmer {
      background: linear-gradient(90deg, #023E8A 0%, #0353b8 50%, #023E8A 100%);
      background-size: 1000px 100%;
      animation: shimmer 2s infinite;
    }
    .insight-item:hover {
      transform: translateX(5px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      border-color: #023E8A;
    }
  `;

  if (loading) {
    return (
      <div style={styles.container}>
        <style>{styleSheet}</style>
        <div style={styles.backgroundPattern}></div>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <div style={styles.loadingText}>Loading shipment data...</div>
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
            <div style={styles.errorTitle}>⚠️ Error Loading Shipments</div>
            <p style={{fontSize: "1.1rem", color: "#dc2626", marginBottom: "25px"}}>{error}</p>
            <button 
              className="action-btn"
              style={{...styles.updateButton, padding: "14px 32px"}}
              onClick={() => window.location.reload()}
            >
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
          <h1 style={styles.title}>Shipment Control</h1>
          <p style={styles.subtitle}>Manage and track all shipment records</p>
        </div>

        {/* Controls */}
        <div style={styles.controlsContainer}>
          <div style={styles.controlsRow}>
            <div style={{ position: "relative", flex: 1 }}>
              <input
                type="text"
                placeholder="Search shipments by ID, carrier, or product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
              <span style={styles.searchIcon}>🔍</span>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={styles.select}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="shipped">Shipped</option>
              <option value="in-transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <button
              className={analyzing ? "analyzing-shimmer" : "action-btn"}
              style={styles.analyzeButton}
              onClick={analyzeShipments}
              disabled={analyzing}
            >
              {analyzing ? "🔍 Analyzing..." : "🧠 Analyze Data"}
            </button>

            <button
              className="action-btn"
              style={styles.addButton}
              onClick={() => navigate("/shipments/create")}
            >
              <span>+</span> Add Shipment
            </button>
          </div>
        </div>

        {/* AI Insights */}
        {insights.length > 0 && (
          <div style={styles.insightsBox}>
            <h3 style={styles.insightsTitle}>
              <span>🤖</span> AI Shipment Insights
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

        {/* Stats */}
        <div style={styles.statsGrid}>
          <div className="stat-card" style={styles.statCard}>
            <span style={styles.statIcon}>📦</span>
            <div style={{...styles.statNumber, color: '#023E8A'}}>{animatedStats.total}</div>
            <div style={styles.statLabel}>Total Shipments</div>
          </div>
          <div className="stat-card" style={styles.statCard}>
            <span style={styles.statIcon}>🚚</span>
            <div style={{...styles.statNumber, color: '#10b981'}}>{animatedStats.active}</div>
            <div style={styles.statLabel}>Active Shipments</div>
          </div>
          <div className="stat-card" style={styles.statCard}>
            <span style={styles.statIcon}>🔎</span>
            <div style={{...styles.statNumber, color: '#f59e0b'}}>{animatedStats.filtered}</div>
            <div style={styles.statLabel}>Filtered Results</div>
          </div>
        </div>

        {/* Table */}
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead style={styles.tableHeader}>
              <tr>
                <th style={styles.th}>Shipment ID</th>
                <th style={styles.th}>Carrier</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Products</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody style={styles.tbody}>
              {filteredShipments.length > 0 ? (
                filteredShipments.map((shipment, index) => (
                  <tr
                    key={shipment._id}
                    className="table-row"
                    style={{
                      ...styles.tr,
                      animation: `slideInRight 0.5s ease-out ${index * 0.05}s both`
                    }}
                  >
                    <td style={styles.td}>
                      <span style={styles.shipmentId}>
                        {shipment.shipmentId}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.carrier}>
                        🚛 {shipment.carrier}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span 
                        style={{
                          ...styles.statusBadge,
                          backgroundColor: getStatusColor(shipment.status)
                        }}
                      >
                        {shipment.status || 'Pending'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.productsList}>
                        {shipment.products && shipment.products.length > 0 ? (
                          shipment.products.map((p, idx) => (
                            <span key={idx} style={styles.productItem}>
                              📦 {p.product?.productName || 'Unknown'} ({p.quantity})
                            </span>
                          ))
                        ) : (
                          <span style={{fontStyle: 'italic', color: '#94a3b8'}}>No products</span>
                        )}
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actionsContainer}>
                        <button
                          onClick={() => navigate(`/shipments/update/${shipment._id}`)}
                          className="action-btn"
                          style={styles.updateButton}
                        >
                          ✏️ Update
                        </button>
                        <button
                          onClick={() => handleDelete(shipment._id)}
                          className="action-btn"
                          style={styles.deleteButton}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={styles.noResults}>
                    <div style={styles.noResultsIcon}>📦</div>
                    <div style={styles.noResultsText}>
                      {searchTerm || statusFilter !== "all" ? "No shipments match your criteria" : "No shipments available"}
                    </div>
                    <div style={styles.noResultsSubtext}>
                      {searchTerm || statusFilter !== "all" 
                        ? "Try adjusting your search or filter settings" 
                        : "Create a new shipment to get started"}
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

export default ShipmentControl;