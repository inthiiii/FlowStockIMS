import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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

  // Filter and search logic
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

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid": return "#28a745";
      case "Pending": return "#ffc107";
      case "Cancelled": return "#dc3545";
      default: return "#6c757d";
    }
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
    filtersContainer: {
      backgroundColor: "#f8f9fa",
      padding: "25px",
      borderRadius: "12px",
      marginBottom: "30px",
      border: "1px solid #e9ecef",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
    },
    filtersRow: {
      display: "flex",
      gap: "20px",
      flexWrap: "wrap",
      alignItems: "center",
      marginBottom: "20px",
    },
    filterGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "5px",
    },
    filterLabel: {
      fontSize: "0.85rem",
      fontWeight: "600",
      color: "#023E8A",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    input: {
      padding: "12px 16px",
      border: "2px solid #e9ecef",
      borderRadius: "8px",
      fontSize: "1rem",
      fontFamily: "inherit",
      transition: "all 0.3s ease",
      backgroundColor: "#ffffff",
      outline: "none",
      minWidth: "200px",
    },
    select: {
      padding: "12px 16px",
      border: "2px solid #e9ecef",
      borderRadius: "8px",
      fontSize: "1rem",
      fontFamily: "inherit",
      transition: "all 0.3s ease",
      backgroundColor: "#ffffff",
      outline: "none",
      cursor: "pointer",
      minWidth: "150px",
    },
    inputFocus: {
      borderColor: "#023E8A",
      boxShadow: "0 0 0 3px rgba(2, 62, 138, 0.1)",
    },
    addButton: {
      backgroundColor: "#023E8A",
      color: "#ffffff",
      padding: "12px 24px",
      border: "none",
      borderRadius: "8px",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      textDecoration: "none",
      display: "inline-block",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      marginBottom: "20px",
    },
    addButtonHover: {
      backgroundColor: "#012a5c",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(2, 62, 138, 0.3)",
    },
    statsContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
      padding: "15px 20px",
      backgroundColor: "#f8f9fa",
      borderRadius: "8px",
      border: "1px solid #e9ecef",
    },
    statsText: {
      color: "#495057",
      fontSize: "0.95rem",
      fontWeight: "500",
    },
    statsNumber: {
      color: "#023E8A",
      fontWeight: "600",
    },
    tableContainer: {
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
      border: "1px solid #e9ecef",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "0.95rem",
    },
    tableHeader: {
      backgroundColor: "#023E8A",
      color: "#ffffff",
    },
    th: {
      padding: "18px 15px",
      textAlign: "left",
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      fontSize: "0.85rem",
      borderBottom: "none",
    },
    tbody: {
      backgroundColor: "#ffffff",
    },
    tr: {
      borderBottom: "1px solid #e9ecef",
      transition: "all 0.2s ease",
    },
    trHover: {
      backgroundColor: "#f8f9fa",
    },
    td: {
      padding: "15px",
      verticalAlign: "middle",
      color: "#495057",
    },
    customerName: {
      fontWeight: "500",
      color: "#023E8A",
    },
    productName: {
      fontWeight: "500",
    },
    amount: {
      fontWeight: "600",
      fontSize: "1rem",
      fontFamily: "monospace",
    },
    statusBadge: {
      padding: "6px 12px",
      borderRadius: "20px",
      fontSize: "0.8rem",
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      color: "#ffffff",
      display: "inline-block",
    },
    date: {
      fontFamily: "monospace",
      fontSize: "0.9rem",
    },
    actionsContainer: {
      display: "flex",
      gap: "8px",
      alignItems: "center",
    },
    viewLink: {
      color: "#023E8A",
      textDecoration: "none",
      fontWeight: "500",
      padding: "6px 12px",
      borderRadius: "4px",
      border: "1px solid #023E8A",
      fontSize: "0.85rem",
      transition: "all 0.2s ease",
    },
    viewLinkHover: {
      backgroundColor: "#023E8A",
      color: "#ffffff",
    },
    actionButton: {
      padding: "6px 12px",
      border: "none",
      borderRadius: "4px",
      fontSize: "0.85rem",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease",
      color: "#ffffff",
      textTransform: "uppercase",
      letterSpacing: "0.3px",
    },
    deleteButton: {
      backgroundColor: "#dc3545",
    },
    deleteButtonHover: {
      backgroundColor: "#c82333",
      transform: "translateY(-1px)",
    },
    returnButton: {
      backgroundColor: "#fd7e14",
    },
    returnButtonHover: {
      backgroundColor: "#e96b00",
      transform: "translateY(-1px)",
    },
    noResults: {
      textAlign: "center",
      padding: "40px 20px",
      color: "#6c757d",
      fontSize: "1rem",
      fontStyle: "italic",
    },
    loadingContainer: {
      textAlign: "center",
      padding: "60px 20px",
      color: "#6c757d",
      fontSize: "1.1rem",
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={{
            display: "inline-block",
            width: "40px",
            height: "40px",
            border: "4px solid #e9ecef",
            borderTop: "4px solid #023E8A",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            marginBottom: "20px"
          }}></div>
          <p>Loading sales...</p>
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
        <h1 style={styles.title}>Sales Management</h1>
        <p style={styles.subtitle}>View and manage all sales transactions</p>
      </div>

      {/* Filters */}
      <div style={styles.filtersContainer}>
        <div style={styles.filtersRow}>
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Search</label>
            <input
              type="text"
              placeholder="Search customer or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.input}
              onFocus={(e) => {
                e.target.style.borderColor = styles.inputFocus.borderColor;
                e.target.style.boxShadow = styles.inputFocus.boxShadow;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = styles.input.borderColor;
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Status</label>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)} 
              style={styles.select}
              onFocus={(e) => {
                e.target.style.borderColor = styles.inputFocus.borderColor;
                e.target.style.boxShadow = styles.inputFocus.boxShadow;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = styles.select.borderColor;
                e.target.style.boxShadow = "none";
              }}
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Date</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              style={styles.input}
              onFocus={(e) => {
                e.target.style.borderColor = styles.inputFocus.borderColor;
                e.target.style.boxShadow = styles.inputFocus.boxShadow;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = styles.input.borderColor;
                e.target.style.boxShadow = "none";
              }}
            />
          </div>
        </div>

        <Link to="/sales/add" style={styles.addButton}>
          <span
            onMouseEnter={(e) => {
              e.target.parentElement.style.backgroundColor = styles.addButtonHover.backgroundColor;
              e.target.parentElement.style.transform = styles.addButtonHover.transform;
              e.target.parentElement.style.boxShadow = styles.addButtonHover.boxShadow;
            }}
            onMouseLeave={(e) => {
              e.target.parentElement.style.backgroundColor = styles.addButton.backgroundColor;
              e.target.parentElement.style.transform = "none";
              e.target.parentElement.style.boxShadow = "none";
            }}
          >
            + Add New Sale
          </span>
        </Link>
      </div>

      {/* Stats */}
      <div style={styles.statsContainer}>
        <span style={styles.statsText}>
          Total Sales: <span style={styles.statsNumber}>{sales.length}</span>
        </span>
        <span style={styles.statsText}>
          Filtered Results: <span style={styles.statsNumber}>{filteredSales.length}</span>
        </span>
        <span style={styles.statsText}>
          Total Revenue: <span style={styles.statsNumber}>
            Rs.{filteredSales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0).toFixed(2)}
          </span>
        </span>
      </div>

      {/* Table */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead style={styles.tableHeader}>
            <tr>
              <th style={styles.th}>Customer</th>
              <th style={styles.th}>Product</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody style={styles.tbody}>
            {filteredSales.length > 0 ? (
              filteredSales.map((sale) => (
                <tr
                  key={sale._id}
                  style={styles.tr}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = styles.trHover.backgroundColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <td style={{...styles.td, ...styles.customerName}}>
                    {sale.customerName}
                  </td>
                  <td style={{...styles.td, ...styles.productName}}>
                    {sale.product?.productName || 'N/A'}
                  </td>
                  <td style={{...styles.td, ...styles.amount}}>
                    Rs.{sale.totalAmount?.toFixed(2) || '0.00'}
                  </td>
                  <td style={styles.td}>
                    <span 
                      style={{
                        ...styles.statusBadge,
                        backgroundColor: getStatusColor(sale.paymentStatus)
                      }}
                    >
                      {sale.paymentStatus}
                    </span>
                  </td>
                  <td style={{...styles.td, ...styles.date}}>
                    {new Date(sale.saleDate).toLocaleDateString()}
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actionsContainer}>
                      <Link 
                        to={`/sales/${sale._id}`} 
                        style={styles.viewLink}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = styles.viewLinkHover.backgroundColor;
                          e.target.style.color = styles.viewLinkHover.color;
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "transparent";
                          e.target.style.color = styles.viewLink.color;
                        }}
                      >
                        View
                      </Link>
                      <button
                        onClick={() => deleteSale(sale._id)}
                        style={{...styles.actionButton, ...styles.deleteButton}}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = styles.deleteButtonHover.backgroundColor;
                          e.target.style.transform = styles.deleteButtonHover.transform;
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = styles.deleteButton.backgroundColor;
                          e.target.style.transform = "none";
                        }}
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => returnSale(sale._id)}
                        style={{...styles.actionButton, ...styles.returnButton}}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = styles.returnButtonHover.backgroundColor;
                          e.target.style.transform = styles.returnButtonHover.transform;
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = styles.returnButton.backgroundColor;
                          e.target.style.transform = "none";
                        }}
                      >
                        Return
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={styles.noResults}>
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