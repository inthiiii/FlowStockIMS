import React, { useState, useEffect } from "react";

const DeliveryList = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:3000/api/deliveries");
        if (!res.ok) throw new Error("Failed to fetch deliveries");
        const data = await res.json();
        setDeliveries(data);
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

  const filtered = deliveries.filter((d) =>
    d.sale?.customerName?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return '#28a745';
      case 'in-transit': return '#ffc107';
      case 'pending': return '#6c757d';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const formatSaleId = (id) => {
    if (!id) return 'N/A';
    return id.length > 8 ? `${id.substring(0, 8)}...` : id;
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
    searchContainer: {
      marginBottom: "30px",
      position: "relative",
      maxWidth: "500px",
      margin: "0 auto 30px auto",
    },
    searchInput: {
      width: "100%",
      padding: "15px 20px",
      fontSize: "1rem",
      border: "2px solid #e9ecef",
      borderRadius: "12px",
      outline: "none",
      transition: "all 0.3s ease",
      backgroundColor: "#ffffff",
      boxSizing: "border-box",
    },
    searchInputFocus: {
      borderColor: "#023E8A",
      boxShadow: "0 0 0 3px rgba(2, 62, 138, 0.1)",
    },
    statsContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "30px",
      padding: "20px 25px",
      backgroundColor: "#f8f9fa",
      borderRadius: "12px",
      border: "1px solid #e9ecef",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
    },
    statsText: {
      color: "#495057",
      fontSize: "1rem",
      fontWeight: "500",
    },
    statsNumber: {
      color: "#023E8A",
      fontWeight: "700",
      fontSize: "1.2rem",
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
      padding: "20px 15px",
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
    saleId: {
      fontFamily: "monospace",
      backgroundColor: "#f8f9fa",
      padding: "4px 8px",
      borderRadius: "4px",
      fontSize: "0.85rem",
      color: "#495057",
    },
    customerName: {
      fontWeight: "500",
      color: "#023E8A",
    },
    productName: {
      fontWeight: "500",
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
    partnerName: {
      backgroundColor: "#e3f2fd",
      color: "#1976d2",
      padding: "4px 10px",
      borderRadius: "12px",
      fontSize: "0.85rem",
      fontWeight: "500",
      display: "inline-block",
    },
    date: {
      fontFamily: "monospace",
      fontSize: "0.9rem",
      color: "#6c757d",
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
    noResults: {
      textAlign: "center",
      padding: "60px 20px",
      color: "#6c757d",
    },
    noResultsIcon: {
      fontSize: "3rem",
      marginBottom: "15px",
      opacity: "0.5",
    },
    noResultsText: {
      fontSize: "1.2rem",
      fontWeight: "500",
      marginBottom: "8px",
    },
    noResultsSubtext: {
      fontSize: "1rem",
      opacity: "0.7",
    },
    statusGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
      gap: "15px",
      marginBottom: "20px",
    },
    statusCard: {
      backgroundColor: "#ffffff",
      padding: "15px",
      borderRadius: "8px",
      border: "1px solid #e9ecef",
      textAlign: "center",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
    },
    statusCardNumber: {
      fontSize: "1.8rem",
      fontWeight: "700",
      margin: "0 0 5px 0",
    },
    statusCardLabel: {
      fontSize: "0.85rem",
      color: "#6c757d",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      margin: "0",
    },
    refreshButton: {
      backgroundColor: "#023E8A",
      color: "#ffffff",
      padding: "10px 20px",
      border: "none",
      borderRadius: "8px",
      fontSize: "0.9rem",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.3s ease",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    refreshButtonHover: {
      backgroundColor: "#012a5c",
    },
  };

  const getDeliveryStats = () => {
    const total = deliveries.length;
    const delivered = deliveries.filter(d => d.status?.toLowerCase() === 'delivered').length;
    const inTransit = deliveries.filter(d => d.status?.toLowerCase() === 'in-transit').length;
    const pending = deliveries.filter(d => d.status?.toLowerCase() === 'pending').length;
    
    return { total, delivered, inTransit, pending };
  };

  const stats = getDeliveryStats();

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <div style={styles.loadingText}>Loading delivery records...</div>
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

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <div style={styles.errorTitle}>Error Loading Deliveries</div>
          <p>{error}</p>
          <button 
            style={styles.refreshButton}
            onClick={() => window.location.reload()}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = styles.refreshButtonHover.backgroundColor;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = styles.refreshButton.backgroundColor;
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Delivery Records</h1>
        <p style={styles.subtitle}>Track and manage all delivery transactions</p>
      </div>

      {/* Status Overview */}
      <div style={styles.statusGrid}>
        <div style={styles.statusCard}>
          <div style={{...styles.statusCardNumber, color: '#023E8A'}}>{stats.total}</div>
          <div style={styles.statusCardLabel}>Total</div>
        </div>
        <div style={styles.statusCard}>
          <div style={{...styles.statusCardNumber, color: '#28a745'}}>{stats.delivered}</div>
          <div style={styles.statusCardLabel}>Delivered</div>
        </div>
        <div style={styles.statusCard}>
          <div style={{...styles.statusCardNumber, color: '#ffc107'}}>{stats.inTransit}</div>
          <div style={styles.statusCardLabel}>In Transit</div>
        </div>
        <div style={styles.statusCard}>
          <div style={{...styles.statusCardNumber, color: '#6c757d'}}>{stats.pending}</div>
          <div style={styles.statusCardLabel}>Pending</div>
        </div>
      </div>

      {/* Search */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search by customer name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
          onFocus={(e) => {
            e.target.style.borderColor = styles.searchInputFocus.borderColor;
            e.target.style.boxShadow = styles.searchInputFocus.boxShadow;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = styles.searchInput.borderColor;
            e.target.style.boxShadow = "none";
          }}
        />
      </div>

      {/* Stats */}
      <div style={styles.statsContainer}>
        <span style={styles.statsText}>
          Total Deliveries: <span style={styles.statsNumber}>{deliveries.length}</span>
        </span>
        <span style={styles.statsText}>
          Showing: <span style={styles.statsNumber}>{filtered.length}</span>
        </span>
        <span style={styles.statsText}>
          Delivery Rate: <span style={styles.statsNumber}>
            {deliveries.length > 0 ? Math.round((stats.delivered / deliveries.length) * 100) : 0}%
          </span>
        </span>
      </div>

      {/* Table */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead style={styles.tableHeader}>
            <tr>
              <th style={styles.th}>Sale ID</th>
              <th style={styles.th}>Customer</th>
              <th style={styles.th}>Product</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Partner</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Manage</th>
            </tr>
          </thead>
          <tbody style={styles.tbody}>
  {filtered.length > 0 ? (
    filtered.map((d) => (
      <tr
        key={d._id}
        style={styles.tr}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = styles.trHover.backgroundColor;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
        <td style={styles.td}>
          <span style={styles.saleId}>
            {formatSaleId(d.sale?._id)}
          </span>
        </td>
        <td style={{ ...styles.td, ...styles.customerName }}>
          {d.sale?.customerName || 'Unknown Customer'}
        </td>
        <td style={{ ...styles.td, ...styles.productName }}>
          {d.sale?.product?.name || d.sale?.product?.productName || 'N/A'}
        </td>
        <td style={styles.td}>
          <span
            style={{
              ...styles.statusBadge,
              backgroundColor: getStatusColor(d.status),
            }}
          >
            {d.status || 'Unknown'}
          </span>
        </td>
        <td style={styles.td}>
          {d.partner ? (
            <span style={styles.partnerName}>{d.partner}</span>
          ) : (
            <span style={{ color: '#6c757d', fontStyle: 'italic' }}>N/A</span>
          )}
        </td>
        <td style={{ ...styles.td, ...styles.date }}>
          {new Date(d.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </td>

        {/* New Action Buttons */}
        <td style={styles.td}>
          <button
            style={{
              backgroundColor: "#ffc107",
              color: "#000",
              border: "none",
              padding: "6px 12px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "500",
              marginRight: "5px",
            }}
            onClick={() => window.location.href = `/deliveries/update/${d._id}`}
          >
            Update Status
          </button>

          <button
            style={{
              backgroundColor: "#dc3545",
              color: "#fff",
              border: "none",
              padding: "6px 12px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "500",
            }}
            onClick={async () => {
              if (window.confirm("Are you sure you want to delete this delivery?")) {
                try {
                  const res = await fetch(`http://localhost:3000/api/deliveries/${d._id}`, {
                    method: "DELETE",
                  });
                  if (!res.ok) throw new Error("Failed to delete delivery");
                  // Remove deleted delivery from state
                  setDeliveries(prev => prev.filter(item => item._id !== d._id));
                } catch (err) {
                  console.error("Delete error:", err);
                  alert("Failed to delete delivery");
                }
              }
            }}
          >
            Delete
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="7" style={styles.noResults}>
        <div style={styles.noResultsIcon}>🚚</div>
        <div style={styles.noResultsText}>
          {search ? "No deliveries found" : "No delivery records available"}
        </div>
        <div style={styles.noResultsSubtext}>
          {search
            ? `No deliveries found for "${search}"`
            : "Delivery records will appear here once created"}
        </div>
      </td>
    </tr>
  )}
</tbody>
        </table>
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

export default DeliveryList;
