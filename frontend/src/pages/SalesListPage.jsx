import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const SalesListPage = () => {
  const [sales, setSales] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchSales = () => {
    setLoading(true);
    fetch("http://localhost:3000/api/sales")
      .then((res) => res.json())
      .then((data) => {
        setSales(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching sales:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const deleteSale = async (id) => {
    if (window.confirm("Are you sure you want to delete this sale?")) {
      try {
        await fetch(`http://localhost:3000/api/sales/${id}`, { method: "DELETE" });
        fetchSales();
      } catch (err) {
        alert("Delete failed!");
        console.error(err);
      }
    }
  };

  const returnSale = async (id) => {
    if (window.confirm("Are you sure you want to return this sale?")) {
      try {
        await fetch(`http://localhost:3000/api/sales/return/${id}`, { method: "PUT" });
        fetchSales();
      } catch (err) {
        alert("Return failed!");
        console.error(err);
      }
    }
  };

  const filteredSales = sales.filter((sale) => {
    if (statusFilter && sale.paymentStatus !== statusFilter) return false;
    if (dateFilter) {
      const saleDate = new Date(sale.saleDate).toISOString().split("T")[0];
      if (saleDate !== dateFilter) return false;
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        sale.customerName?.toLowerCase().includes(term) ||
        sale.product?.productName?.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const totalRevenue = filteredSales
    .filter((sale) => sale.paymentStatus !== "Returned")
    .reduce((sum, sale) => sum + (sale.totalAmount || 0), 0)
    .toFixed(2);

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Sales Report", 14, 15);

    const tableColumn = ["Customer", "Product", "Quantity", "Amount", "Status", "Importance", "Date"];
    const tableRows = [];

    filteredSales.forEach((sale) => {
      const importance = getImportance(sale.totalAmount);
      const row = [
        sale.customerName,
        sale.product?.productName || "N/A",
        sale.quantity || 0,
        `Rs.${sale.totalAmount?.toFixed(2) || "0.00"}`,
        sale.paymentStatus,
        importance.text,
        new Date(sale.saleDate).toLocaleDateString(),
      ];
      tableRows.push(row);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("sales_report.pdf");
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredSales.map((sale) => {
        const importance = getImportance(sale.totalAmount);
        return {
          Customer: sale.customerName,
          Product: sale.product?.productName || "N/A",
          Quantity: sale.quantity || 0,
          Amount: sale.totalAmount?.toFixed(2) || "0.00",
          Status: sale.paymentStatus,
          Importance: importance.text,
          Date: new Date(sale.saleDate).toLocaleDateString(),
        };
      })
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Report");
    XLSX.writeFile(workbook, "sales_report.xlsx");
  };

  const getImportance = (amount) => {
    if (!amount) return { text: "Low Value", color: "#10b981" };
    if (amount > 500) return { text: "🔴 High Value", color: "#ef4444" };
    else if (amount > 100) return { text: "🟡 Medium Value", color: "#f59e0b" };
    else return { text: "🟢 Low Value", color: "#10b981" };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "#10b981";
      case "Pending":
        return "#f59e0b";
      case "Returned":
        return "#ef4444";
      default:
        return "#64748b";
    }
  };

  const styles = {
    container: {
      maxWidth: "1600px",
      margin: "0 auto",
      padding: "50px 30px",
      background: "linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%)",
      minHeight: "100vh",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
    header: { 
      textAlign: "center", 
      marginBottom: "50px",
      animation: "fadeInDown 0.6s ease-out"
    },
    title: { 
      color: "#023E8A", 
      fontSize: "3rem", 
      fontWeight: "700", 
      margin: "0", 
      marginBottom: "12px",
      letterSpacing: "-1px",
      textShadow: "0 2px 4px rgba(2, 62, 138, 0.1)"
    },
    subtitle: { 
      color: "#64748b", 
      fontSize: "1.15rem", 
      margin: "0", 
      fontWeight: "400",
      letterSpacing: "0.3px"
    },
    filtersContainer: {
      backgroundColor: "#ffffff",
      padding: "35px",
      borderRadius: "20px",
      marginBottom: "35px",
      border: "1px solid rgba(226, 232, 240, 0.8)",
      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.06)",
      animation: "fadeInUp 0.7s ease-out"
    },
    filtersRow: { 
      display: "flex", 
      gap: "25px", 
      flexWrap: "wrap", 
      alignItems: "flex-end", 
      marginBottom: "25px" 
    },
    filterGroup: { 
      display: "flex", 
      flexDirection: "column", 
      gap: "8px",
      flex: "1",
      minWidth: "200px"
    },
    filterLabel: { 
      fontSize: "0.875rem", 
      fontWeight: "600", 
      color: "#1e293b", 
      letterSpacing: "0.3px",
      display: "flex",
      alignItems: "center",
      gap: "6px"
    },
    input: { 
      padding: "14px 18px", 
      border: "2px solid #e2e8f0", 
      borderRadius: "10px", 
      fontSize: "1rem", 
      fontFamily: "inherit", 
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", 
      backgroundColor: "#ffffff", 
      outline: "none",
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)"
    },
    select: { 
      padding: "14px 40px 14px 18px", 
      border: "2px solid #e2e8f0", 
      borderRadius: "10px", 
      fontSize: "1rem", 
      fontFamily: "inherit", 
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", 
      backgroundColor: "#ffffff", 
      outline: "none", 
      cursor: "pointer",
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
      appearance: "none",
      backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23023E8A' d='M6 9L1 4h10z'/%3E%3C/svg%3E\")",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 16px center"
    },
    addButton: { 
      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", 
      color: "#ffffff", 
      padding: "14px 28px", 
      border: "none", 
      borderRadius: "10px", 
      fontSize: "1rem", 
      fontWeight: "600", 
      cursor: "pointer", 
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", 
      textDecoration: "none", 
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      letterSpacing: "0.3px",
      boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)"
    },
    statsContainer: { 
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "20px",
      marginBottom: "30px"
    },
    statCard: {
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      padding: "25px",
      borderRadius: "16px",
      border: "1px solid #e2e8f0",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
      transition: "all 0.3s ease",
      animation: "scaleIn 0.5s ease-out"
    },
    statLabel: {
      fontSize: "0.875rem",
      color: "#64748b",
      fontWeight: "500",
      marginBottom: "8px",
      textTransform: "uppercase",
      letterSpacing: "0.5px"
    },
    statValue: {
      fontSize: "2rem",
      color: "#023E8A",
      fontWeight: "700",
      lineHeight: "1.2"
    },
    statIcon: {
      fontSize: "2rem",
      marginBottom: "10px",
      display: "block"
    },
    exportButtons: { 
      display: "flex", 
      gap: "15px", 
      marginBottom: "30px",
      flexWrap: "wrap"
    },
    exportBtn: { 
      background: "linear-gradient(135deg, #023E8A 0%, #0353b8 100%)", 
      color: "#fff", 
      padding: "12px 24px", 
      border: "none", 
      borderRadius: "10px", 
      cursor: "pointer", 
      fontWeight: "600",
      fontSize: "0.95rem",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      boxShadow: "0 4px 12px rgba(2, 62, 138, 0.3)",
      display: "inline-flex",
      alignItems: "center",
      gap: "8px"
    },
    tableContainer: { 
      backgroundColor: "#ffffff", 
      borderRadius: "20px", 
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)", 
      overflow: "hidden", 
      border: "1px solid #e2e8f0",
      animation: "fadeInUp 0.8s ease-out"
    },
    table: { 
      width: "100%", 
      borderCollapse: "collapse", 
      fontSize: "0.95rem" 
    },
    th: { 
      padding: "20px 18px", 
      textAlign: "left", 
      fontWeight: "600", 
      letterSpacing: "0.5px", 
      fontSize: "0.85rem", 
      background: "linear-gradient(135deg, #023E8A 0%, #0353b8 100%)", 
      color: "#ffffff",
      textTransform: "uppercase"
    },
    td: { 
      padding: "18px", 
      verticalAlign: "middle", 
      color: "#334155",
      borderBottom: "1px solid #f1f5f9",
      transition: "background-color 0.2s ease"
    },
    statusBadge: { 
      padding: "6px 14px", 
      borderRadius: "20px", 
      fontSize: "0.8rem", 
      fontWeight: "600", 
      letterSpacing: "0.5px", 
      color: "#ffffff", 
      display: "inline-block",
      textTransform: "uppercase",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
    },
    importanceBadge: { 
      padding: "6px 14px", 
      borderRadius: "20px", 
      fontSize: "0.8rem", 
      fontWeight: "600", 
      letterSpacing: "0.5px", 
      color: "#fff", 
      display: "inline-block",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
    },
    actionButton: {
      padding: "8px 16px",
      borderRadius: "8px",
      border: "none",
      fontWeight: "600",
      fontSize: "0.875rem",
      cursor: "pointer",
      transition: "all 0.3s ease",
      textDecoration: "none",
      display: "inline-block"
    },
    noResults: { 
      textAlign: "center", 
      padding: "60px 20px", 
      color: "#64748b", 
      fontSize: "1.1rem",
      fontStyle: "italic"
    },
    loadingContainer: {
      textAlign: "center",
      padding: "80px 20px",
      animation: "pulse 2s ease-in-out infinite"
    },
    loadingSpinner: {
      fontSize: "3rem",
      marginBottom: "20px",
      display: "block"
    },
    loadingText: {
      color: "#64748b",
      fontSize: "1.2rem",
      fontWeight: "500"
    }
  };

  const styleSheet = `
    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
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
    
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }
    
    input:focus, select:focus {
      border-color: #023E8A !important;
      box-shadow: 0 0 0 3px rgba(2, 62, 138, 0.1), 0 2px 4px rgba(0, 0, 0, 0.05) !important;
    }
    
    button:hover, a[href]:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(2, 62, 138, 0.4);
    }
    
    button:active, a[href]:active {
      transform: translateY(0);
    }
    
    tr:hover td {
      background-color: #f8fafc;
    }
    
    input::placeholder {
      color: #94a3b8;
    }
  `;

  if (loading) {
    return (
      <div style={styles.container}>
        <style>{styleSheet}</style>
        <div style={styles.loadingContainer}>
          <span style={styles.loadingSpinner}>⏳</span>
          <div style={styles.loadingText}>Loading sales data...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{styleSheet}</style>
      <div style={styles.header}>
        <h1 style={styles.title}>Sales Management</h1>
        <p style={styles.subtitle}>View and manage all sales transactions</p>
      </div>

      {/* Filters */}
      <div style={styles.filtersContainer}>
        <div style={styles.filtersRow}>
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>
              <span>🔍</span> Search
            </label>
            <input
              type="text"
              placeholder="Search customer or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>
              <span>📊</span> Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={styles.select}
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Returned">Returned</option>
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>
              <span>📅</span> Date
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <Link to="/sales/add" style={styles.addButton}>
              <span>+</span> Add New Sale
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <span style={styles.statIcon}>📋</span>
          <div style={styles.statLabel}>Total Sales</div>
          <div style={styles.statValue}>{sales.length}</div>
        </div>
        
        <div style={styles.statCard}>
          <span style={styles.statIcon}>🔎</span>
          <div style={styles.statLabel}>Filtered Results</div>
          <div style={styles.statValue}>{filteredSales.length}</div>
        </div>
        
        <div style={styles.statCard}>
          <span style={styles.statIcon}>💰</span>
          <div style={styles.statLabel}>Total Revenue</div>
          <div style={styles.statValue}>Rs.{parseFloat(totalRevenue).toLocaleString()}</div>
        </div>
      </div>

      {/* Export Buttons */}
      <div style={styles.exportButtons}>
        <button onClick={exportToPDF} style={styles.exportBtn}>
          <span>📄</span> Export PDF
        </button>
        <button onClick={exportToExcel} style={styles.exportBtn}>
          <span>📊</span> Export Excel
        </button>
      </div>

      {/* Table */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Customer</th>
              <th style={styles.th}>Product</th>
              <th style={styles.th}>Quantity</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Importance</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.length > 0 ? (
              filteredSales.map((sale) => {
                const importance = getImportance(sale.totalAmount);
                return (
                  <tr key={sale._id}>
                    <td style={styles.td}><strong>{sale.customerName}</strong></td>
                    <td style={styles.td}>{sale.product?.productName || "N/A"}</td>
                    <td style={styles.td}>{sale.quantity || 0}</td>
                    <td style={styles.td}><strong>Rs.{sale.totalAmount?.toFixed(2) || "0.00"}</strong></td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.statusBadge,
                          backgroundColor: getStatusColor(sale.paymentStatus),
                        }}
                      >
                        {sale.paymentStatus}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.importanceBadge,
                          backgroundColor: importance.color,
                        }}
                      >
                        {importance.text}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {new Date(sale.saleDate).toLocaleDateString()}
                    </td>
                    <td style={styles.td}>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        <Link 
                          to={`/sales/${sale._id}`} 
                          style={{ 
                            ...styles.actionButton, 
                            backgroundColor: "#023E8A",
                            color: "#ffffff"
                          }}
                        >
                         🔎 View
                        </Link>
                        <button
                          onClick={() => deleteSale(sale._id)}
                          style={{
                            ...styles.actionButton,
                            backgroundColor: "#ef4444",
                            color: "#ffffff"
                          }}
                        >
                          🗑️ Delete
                        </button>
                        {sale.paymentStatus !== "Returned" && (
                          <button
                            onClick={() => returnSale(sale._id)}
                            style={{
                              ...styles.actionButton,
                              backgroundColor: "#f59e0b",
                              color: "#ffffff"
                            }}
                          >
                            ↩️ Return
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" style={styles.noResults}>
                  {searchTerm || statusFilter || dateFilter
                    ? "No sales found matching your filters."
                    : "No sales available."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesListPage;