import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// imports for excel and pdf export
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

  // ✅ Total revenue (excluding returned sales)
  const totalRevenue = filteredSales
    .filter((sale) => sale.paymentStatus !== "Returned") // exclude returned sales
    .reduce((sum, sale) => sum + (sale.totalAmount || 0), 0)
    .toFixed(2);

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Sales Report", 14, 15);

    const tableColumn = ["Customer", "Product", "Quantity", "Amount", "Status", "Date"];
    const tableRows = [];

    filteredSales.forEach((sale) => {
      const row = [
        sale.customerName,
        sale.product?.productName || "N/A",
        sale.quantity || 0,
        `Rs.${sale.totalAmount?.toFixed(2) || "0.00"}`,
        sale.paymentStatus,
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

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredSales.map((sale) => ({
        Customer: sale.customerName,
        Product: sale.product?.productName || "N/A",
        Quantity: sale.quantity || 0,
        Amount: sale.totalAmount?.toFixed(2) || "0.00",
        Status: sale.paymentStatus,
        Date: new Date(sale.saleDate).toLocaleDateString(),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Report");
    XLSX.writeFile(workbook, "sales_report.xlsx");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "#28a745";
      case "Pending":
        return "#ffc107";
      case "Returned":
        return "#dc3545";
      default:
        return "#6c757d";
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
    exportButtons: {
      display: "flex",
      gap: "10px",
      marginBottom: "20px",
    },
    exportBtn: {
      backgroundColor: "#023E8A",
      color: "#fff",
      padding: "10px 16px",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
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
    th: {
      padding: "18px 15px",
      textAlign: "left",
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      fontSize: "0.85rem",
      backgroundColor: "#023E8A",
      color: "#ffffff",
    },
    td: {
      padding: "15px",
      verticalAlign: "middle",
      color: "#495057",
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
    noResults: {
      textAlign: "center",
      padding: "40px 20px",
      color: "#6c757d",
      fontSize: "1rem",
      fontStyle: "italic",
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <p>Loading sales...</p>
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
            />
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Status</label>
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
            <label style={styles.filterLabel}>Date</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              style={styles.input}
            />
          </div>
        </div>

        <Link to="/sales/add" style={styles.addButton}>
          + Add New Sale
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
          ✅ Total Revenue (excluding returns):{" "}
          <span style={styles.statsNumber}>Rs.{totalRevenue}</span>
        </span>
      </div>

      {/* Export Buttons */}
      <div style={styles.exportButtons}>
        <button onClick={exportToPDF} style={styles.exportBtn}>
          📄 Export PDF
        </button>
        <button onClick={exportToExcel} style={styles.exportBtn}>
          📊 Export Excel
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
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.length > 0 ? (
              filteredSales.map((sale) => (
                <tr key={sale._id}>
                  <td style={styles.td}>{sale.customerName}</td>
                  <td style={styles.td}>{sale.product?.productName || "N/A"}</td>
                  <td style={styles.td}>{sale.quantity || 0}</td>
                  <td style={styles.td}>Rs.{sale.totalAmount?.toFixed(2) || "0.00"}</td>
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
                    {new Date(sale.saleDate).toLocaleDateString()}
                  </td>
                  <td style={styles.td}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <Link to={`/sales/${sale._id}`} style={{ ...styles.exportBtn, padding: "6px 12px" }}>
                        View
                      </Link>
                      <button
                        onClick={() => deleteSale(sale._id)}
                        style={{
                          ...styles.exportBtn,
                          backgroundColor: "#dc3545",
                          padding: "6px 12px",
                        }}
                      >
                        Delete
                      </button>
                      {sale.paymentStatus !== "Returned" && (
                        <button
                          onClick={() => returnSale(sale._id)}
                          style={{
                            ...styles.exportBtn,
                            backgroundColor: "#fd7e14",
                            padding: "6px 12px",
                          }}
                        >
                          Return
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={styles.noResults}>
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