import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const SalesDashboardPage = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

    // AI insights state
    const [insights, setInsights] = useState([]);
    const [analyzing, setAnalyzing] = useState(false);

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

  // Get sales by week (last 7 days)
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

  // Get returns data
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

  // Get payment status breakdown
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

    // 🧠 AI-like insights generator (runs locally on client)
    const analyzeSales = () => {
      setAnalyzing(true);
  
      // small delay to show "Analyzing..." UI; remove setTimeout if you want instant
      setTimeout(() => {
        const insightsList = [];
  
        // best/worst day
        const highestSalesDay = weeklyData.reduce((max, d) => (d.amount > max.amount ? d : max), weeklyData[0] || { amount: 0, day: '', date: '' });
        const lowestSalesDay = weeklyData.reduce((min, d) => (d.amount < min.amount ? d : min), weeklyData[0] || { amount: 0, day: '', date: '' });
  
        // returns
        const totalReturns = returnsData.total;
        const topReturnProduct = returnsData.byProduct.length > 0 ? returnsData.byProduct[0].product : null;
  
        // top selling product by revenue
        const productRevenueMap = sales.reduce((acc, sale) => {
          const name = sale.product?.productName || "Unknown";
          acc[name] = (acc[name] || 0) + (sale.totalAmount || 0);
          return acc;
        }, {});
        const sortedProducts = Object.entries(productRevenueMap).sort((a, b) => b[1] - a[1]);
        const bestProduct = sortedProducts[0]?.[0] || "Unknown";
        const bestProductShare = sortedProducts.length > 0 ? (sortedProducts[0][1] / (totalSales || 1)) * 100 : 0;
  
        // peak hour analysis (group by hour)
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
  
        // produce insights
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
      }, 800);
    };

  const styles = {
    container: {
      maxWidth: "1400px",
      margin: "0 auto",
      padding: "40px 20px",
      backgroundColor: "#ffffff",
      minHeight: "100vh",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    header: {
      textAlign: "center",
      marginBottom: "40px",
    },
    title: {
      color: "#023E8A",
      fontSize: "2.8rem",
      fontWeight: "700",
      margin: "0",
      marginBottom: "10px",
    },
    subtitle: {
      color: "#6c757d",
      fontSize: "1.2rem",
      margin: "0",
      fontWeight: "400",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "25px",
      marginBottom: "40px",
    },
    statCard: {
      backgroundColor: "#ffffff",
      padding: "30px",
      borderRadius: "15px",
      border: "1px solid #e9ecef",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
      transition: "all 0.3s ease",
      position: "relative",
      overflow: "hidden",
    },
    statCardHover: {
      transform: "translateY(-5px)",
      boxShadow: "0 8px 25px rgba(2, 62, 138, 0.15)",
    },
    statIcon: {
      position: "absolute",
      top: "20px",
      right: "20px",
      fontSize: "2.5rem",
      opacity: "0.1",
    },
    statLabel: {
      fontSize: "0.95rem",
      fontWeight: "600",
      color: "#6c757d",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      marginBottom: "10px",
    },
    statValue: {
      fontSize: "2.5rem",
      fontWeight: "700",
      color: "#023E8A",
      margin: "0",
    },
    statSubtext: {
      fontSize: "0.9rem",
      color: "#6c757d",
      marginTop: "8px",
    },
    chartSection: {
      backgroundColor: "#f8f9fa",
      padding: "30px",
      borderRadius: "15px",
      border: "1px solid #e9ecef",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
      marginBottom: "30px",
    },
    chartTitle: {
      color: "#023E8A",
      fontSize: "1.5rem",
      fontWeight: "600",
      marginBottom: "25px",
      paddingBottom: "15px",
      borderBottom: "2px solid #e9ecef",
    },
    barChart: {
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-around",
      height: "300px",
      padding: "20px",
      backgroundColor: "#ffffff",
      borderRadius: "10px",
      border: "1px solid #e9ecef",
      gap: "15px",
    },
    barContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      flex: "1",
      maxWidth: "100px",
    },
    bar: {
      width: "100%",
      backgroundColor: "#023E8A",
      borderRadius: "8px 8px 0 0",
      transition: "all 0.3s ease",
      position: "relative",
      minHeight: "20px",
    },
    barHover: {
      backgroundColor: "#012a5c",
    },
    barLabel: {
      marginTop: "10px",
      fontSize: "0.85rem",
      fontWeight: "600",
      color: "#495057",
      textAlign: "center",
    },
    barValue: {
      fontSize: "0.75rem",
      color: "#6c757d",
      marginTop: "3px",
      textAlign: "center",
    },
    barAmount: {
      position: "absolute",
      top: "-25px",
      left: "50%",
      transform: "translateX(-50%)",
      fontSize: "0.8rem",
      fontWeight: "600",
      color: "#023E8A",
      whiteSpace: "nowrap",
    },
    revenueChart: {
      backgroundColor: "#ffffff",
      padding: "20px",
      borderRadius: "10px",
      border: "1px solid #e9ecef",
      height: "250px",
      position: "relative",
    },
    revenueLine: {
      height: "100%",
      display: "flex",
      alignItems: "flex-end",
      gap: "10px",
      padding: "30px 10px 30px 10px",
    },
    revenueBar: {
      flex: "1",
      backgroundColor: "rgba(2, 62, 138, 0.6)",
      borderRadius: "4px",
      transition: "all 0.3s ease",
      minHeight: "10px",
      position: "relative",
    },
    revenueBarHover: {
      backgroundColor: "rgba(2, 62, 138, 0.9)",
    },
    paymentBreakdown: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
      gap: "15px",
      marginTop: "20px",
    },
    statusCard: {
      backgroundColor: "#ffffff",
      padding: "20px",
      borderRadius: "10px",
      border: "1px solid #e9ecef",
      textAlign: "center",
    },
    statusNumber: {
      fontSize: "2rem",
      fontWeight: "700",
      margin: "10px 0",
    },
    statusLabel: {
      fontSize: "0.85rem",
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    returnsSection: {
      backgroundColor: "#fff5f5",
      padding: "30px",
      borderRadius: "15px",
      border: "1px solid #ffcccc",
      boxShadow: "0 4px 12px rgba(220, 53, 69, 0.1)",
      marginBottom: "30px",
    },
    returnsHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
      flexWrap: "wrap",
      gap: "15px",
    },
    returnsTitle: {
      color: "#dc3545",
      fontSize: "1.5rem",
      fontWeight: "600",
      margin: "0",
    },
    returnsStats: {
      display: "flex",
      gap: "30px",
    },
    returnsStat: {
      textAlign: "center",
    },
    returnsStatValue: {
      fontSize: "1.8rem",
      fontWeight: "700",
      color: "#dc3545",
      margin: "0",
    },
    returnsStatLabel: {
      fontSize: "0.85rem",
      color: "#6c757d",
      textTransform: "uppercase",
    },
    productsList: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      marginBottom: "20px",
    },
    productItem: {
      backgroundColor: "#ffffff",
      padding: "15px",
      borderRadius: "8px",
      border: "1px solid #ffcccc",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    productName: {
      fontSize: "1rem",
      fontWeight: "600",
      color: "#495057",
    },
    productStats: {
      display: "flex",
      gap: "20px",
      alignItems: "center",
    },
    productCount: {
      backgroundColor: "#dc3545",
      color: "#ffffff",
      padding: "4px 10px",
      borderRadius: "12px",
      fontSize: "0.85rem",
      fontWeight: "600",
    },
    productAmount: {
      fontSize: "0.9rem",
      fontWeight: "600",
      color: "#dc3545",
      fontFamily: "monospace",
    },
    reviewButton: {
      backgroundColor: "#dc3545",
      color: "#ffffff",
      padding: "12px 24px",
      border: "none",
      borderRadius: "8px",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      textDecoration: "none",
      display: "inline-block",
    },
    reviewButtonHover: {
      backgroundColor: "#c82333",
      transform: "translateY(-2px)",
    },
    viewAllButton: {
      backgroundColor: "#023E8A",
      color: "#ffffff",
      padding: "15px 35px",
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
      marginTop: "20px",
    },
    viewAllButtonHover: {
      backgroundColor: "#012a5c",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(2, 62, 138, 0.3)",
    },
    noData: {
      textAlign: "center",
      padding: "40px",
      color: "#6c757d",
      fontStyle: "italic",
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
      margin: "0 auto 20px auto",
    },
    analyzeButton: {
      backgroundColor: "#023E8A",
      color: "#fff",
      padding: "12px 25px",
      border: "none",
      borderRadius: "8px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "block",
      margin: "0 auto 30px auto",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    analyzeButtonHover: {
      backgroundColor: "#012a5c",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 10px rgba(2,62,138,0.3)",
    },
    insightsBox: {
      backgroundColor: "#f8f9fa",
      border: "1px solid #dee2e6",
      borderRadius: "10px",
      padding: "20px 25px",
      margin: "20px auto",
      maxWidth: "900px",
      boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
    },
    insightItem: {
      backgroundColor: "#ffffff",
      padding: "12px 18px",
      borderRadius: "6px",
      border: "1px solid #e9ecef",
      marginBottom: "10px",
      fontSize: "1rem",
      color: "#495057",
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <p>Loading dashboard...</p>
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

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Sales Dashboard</h1>
        <p style={styles.subtitle}>Comprehensive overview of your sales performance</p>
      </div>

        {/* Analyze Sales button */}
  <button
    style={styles.analyzeButton}
    onClick={analyzeSales}
    onMouseEnter={(e) => {
      e.target.style.backgroundColor = styles.analyzeButtonHover.backgroundColor;
      e.target.style.transform = styles.analyzeButtonHover.transform;
      e.target.style.boxShadow = styles.analyzeButtonHover.boxShadow;
    }}
    onMouseLeave={(e) => {
      e.target.style.backgroundColor = styles.analyzeButton.backgroundColor;
      e.target.style.transform = "none";
      e.target.style.boxShadow = "none";
    }}
  >
    {analyzing ? "Analyzing..." : "Analyze Sales"}
  </button>

    {/* AI Insights */}
    {insights.length > 0 && (
    <div style={styles.insightsBox}>
      <h3 style={{ color: "#023E8A", marginBottom: "12px" }}>AI Sales Insights</h3>
      {insights.map((insight, idx) => (
        <div key={idx} style={styles.insightItem}>
          {insight}
        </div>
      ))}
    </div>
  )}

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div 
          style={styles.statCard}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = styles.statCardHover.transform;
            e.currentTarget.style.boxShadow = styles.statCardHover.boxShadow;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "none";
            e.currentTarget.style.boxShadow = styles.statCard.boxShadow;
          }}
        >
          <div style={styles.statIcon}>💰</div>
          <div style={styles.statLabel}>Total Revenue</div>
          <div style={styles.statValue}>Rs.{totalSales.toLocaleString()}</div>
          <div style={styles.statSubtext}>All-time sales revenue</div>
        </div>

        <div 
          style={styles.statCard}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = styles.statCardHover.transform;
            e.currentTarget.style.boxShadow = styles.statCardHover.boxShadow;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "none";
            e.currentTarget.style.boxShadow = styles.statCard.boxShadow;
          }}
        >
          <div style={styles.statIcon}>📊</div>
          <div style={styles.statLabel}>Total Transactions</div>
          <div style={styles.statValue}>{sales.length}</div>
          <div style={styles.statSubtext}>Completed sales</div>
        </div>

        <div 
          style={styles.statCard}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = styles.statCardHover.transform;
            e.currentTarget.style.boxShadow = styles.statCardHover.boxShadow;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "none";
            e.currentTarget.style.boxShadow = styles.statCard.boxShadow;
          }}
        >
          <div style={styles.statIcon}>📈</div>
          <div style={styles.statLabel}>Average Sale</div>
          <div style={styles.statValue}>Rs.{avgSaleValue.toFixed(0)}</div>
          <div style={styles.statSubtext}>Per transaction</div>
        </div>

        <div 
          style={styles.statCard}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = styles.statCardHover.transform;
            e.currentTarget.style.boxShadow = styles.statCardHover.boxShadow;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "none";
            e.currentTarget.style.boxShadow = styles.statCard.boxShadow;
          }}
        >
          <div style={styles.statIcon}>🔄</div>
          <div style={styles.statLabel}>Returns</div>
          <div style={styles.statValue}>{returnsData.total}</div>
          <div style={styles.statSubtext}>Total returned items</div>
        </div>
      </div>

      {/* Weekly Sales Chart */}
      <div style={styles.chartSection}>
        <h2 style={styles.chartTitle}>Weekly Sales Performance (Last 7 Days)</h2>
        <div style={styles.barChart}>
          {weeklyData.map((day, index) => (
            <div key={index} style={styles.barContainer}>
              <div 
                style={{
                  ...styles.bar,
                  height: `${(day.amount / maxWeeklyAmount) * 100}%`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = styles.barHover.backgroundColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = styles.bar.backgroundColor;
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

      {/* Revenue Trend */}
      <div style={styles.chartSection}>
        <h2 style={styles.chartTitle}>Revenue Trend Analysis</h2>
        <div style={styles.revenueChart}>
          <div style={styles.revenueLine}>
            {weeklyData.map((day, index) => (
              <div
                key={index}
                style={{
                  ...styles.revenueBar,
                  height: `${(day.amount / maxWeeklyAmount) * 100}%`,
                }}
                title={`${day.day}: Rs.${day.amount.toLocaleString()}`}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = styles.revenueBarHover.backgroundColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = styles.revenueBar.backgroundColor;
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Payment Status Breakdown */}
        <h3 style={{...styles.chartTitle, marginTop: "30px", fontSize: "1.2rem"}}>Payment Status Breakdown</h3>
        <div style={styles.paymentBreakdown}>
          <div style={styles.statusCard}>
            <div style={{...styles.statusNumber, color: '#28a745'}}>{paymentBreakdown.Paid}</div>
            <div style={{...styles.statusLabel, color: '#28a745'}}>Paid</div>
          </div>
          <div style={styles.statusCard}>
            <div style={{...styles.statusNumber, color: '#ffc107'}}>{paymentBreakdown.Pending}</div>
            <div style={{...styles.statusLabel, color: '#ffc107'}}>Pending</div>
          </div>
          <div style={styles.statusCard}>
            <div style={{...styles.statusNumber, color: '#dc3545'}}>{paymentBreakdown.Cancelled}</div>
            <div style={{...styles.statusLabel, color: '#dc3545'}}>Cancelled</div>
          </div>
          <div style={styles.statusCard}>
            <div style={{...styles.statusNumber, color: '#6c757d'}}>{paymentBreakdown.Returned}</div>
            <div style={{...styles.statusLabel, color: '#6c757d'}}>Returned</div>
          </div>
        </div>
      </div>

      {/* Returns Analysis */}
      <div style={styles.returnsSection}>
        <div style={styles.returnsHeader}>
          <h2 style={styles.returnsTitle}>Returns Analysis</h2>
          <div style={styles.returnsStats}>
            <div style={styles.returnsStat}>
              <div style={styles.returnsStatValue}>{returnsData.total}</div>
              <div style={styles.returnsStatLabel}>Total Returns</div>
            </div>
            <div style={styles.returnsStat}>
              <div style={styles.returnsStatValue}>Rs.{returnsData.totalAmount.toLocaleString()}</div>
              <div style={styles.returnsStatLabel}>Refund Amount</div>
            </div>
          </div>
        </div>

        {returnsData.byProduct.length > 0 ? (
          <>
            <div style={styles.productsList}>
              {returnsData.byProduct.map((item, index) => (
                <div key={index} style={styles.productItem}>
                  <span style={styles.productName}>{item.product}</span>
                  <div style={styles.productStats}>
                    <span style={styles.productCount}>{item.count} returns</span>
                    <span style={styles.productAmount}>Rs.{item.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
            <Link 
              to="/products/control"
              style={styles.reviewButton}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = styles.reviewButtonHover.backgroundColor;
                e.target.style.transform = styles.reviewButtonHover.transform;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = styles.reviewButton.backgroundColor;
                e.target.style.transform = "none";
              }}
            >
              Review Products
            </Link>
          </>
        ) : (
          <div style={styles.noData}>No returns recorded</div>
        )}
      </div>

      {/* View All Sales Button */}
      <div style={{textAlign: "center"}}>
        <Link 
          to="/sales/list" 
          style={styles.viewAllButton}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = styles.viewAllButtonHover.backgroundColor;
            e.target.style.transform = styles.viewAllButtonHover.transform;
            e.target.style.boxShadow = styles.viewAllButtonHover.boxShadow;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = styles.viewAllButton.backgroundColor;
            e.target.style.transform = "none";
            e.target.style.boxShadow = "none";
          }}
        >
          View All Sales
        </Link>
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

export default SalesDashboardPage;