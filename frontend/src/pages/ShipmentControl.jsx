// src/pages/ShipmentControl.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ShipmentControl = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
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
      case 'shipped': return '#28a745';
      case 'in-transit': return '#ffc107';
      case 'delivered': return '#17a2b8';
      case 'pending': return '#6c757d';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
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

  const filteredShipments = getFilteredShipments();

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
    controlsContainer: {
      backgroundColor: "#f8f9fa",
      padding: "25px",
      borderRadius: "12px",
      marginBottom: "30px",
      border: "1px solid #e9ecef",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
    },
    controlsRow: {
      display: "flex",
      gap: "20px",
      alignItems: "center",
      flexWrap: "wrap",
    },
    searchInput: {
      flex: "1",
      padding: "12px 16px",
      border: "2px solid #e9ecef",
      borderRadius: "8px",
      fontSize: "1rem",
      outline: "none",
      transition: "all 0.3s ease",
      minWidth: "250px",
    },
    searchInputFocus: {
      borderColor: "#023E8A",
      boxShadow: "0 0 0 3px rgba(2, 62, 138, 0.1)",
    },
    select: {
      padding: "12px 16px",
      border: "2px solid #e9ecef",
      borderRadius: "8px",
      fontSize: "1rem",
      outline: "none",
      backgroundColor: "#ffffff",
      cursor: "pointer",
      minWidth: "150px",
    },
    addButton: {
      backgroundColor: "#28a745",
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
    },
    addButtonHover: {
      backgroundColor: "#218838",
      transform: "translateY(-1px)",
    },
    statsContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "30px",
      padding: "20px 25px",
      backgroundColor: "#ffffff",
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
    shipmentId: {
      fontFamily: "monospace",
      backgroundColor: "#f8f9fa",
      padding: "4px 8px",
      borderRadius: "4px",
      fontSize: "0.85rem",
      fontWeight: "600",
      color: "#023E8A",
    },
    carrier: {
      backgroundColor: "#e3f2fd",
      color: "#1976d2",
      padding: "4px 10px",
      borderRadius: "12px",
      fontSize: "0.85rem",
      fontWeight: "500",
      display: "inline-block",
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
    productsList: {
      maxWidth: "300px",
      fontSize: "0.9rem",
      lineHeight: "1.4",
    },
    productItem: {
      backgroundColor: "#f8f9fa",
      padding: "2px 6px",
      borderRadius: "4px",
      margin: "2px",
      display: "inline-block",
      fontSize: "0.8rem",
    },
    actionsContainer: {
      display: "flex",
      gap: "8px",
      alignItems: "center",
    },
    updateButton: {
      backgroundColor: "#023E8A",
      color: "#ffffff",
      padding: "8px 16px",
      border: "none",
      borderRadius: "6px",
      fontSize: "0.85rem",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.3s ease",
      textTransform: "uppercase",
      letterSpacing: "0.3px",
    },
    updateButtonHover: {
      backgroundColor: "#012a5c",
      transform: "translateY(-1px)",
    },
    deleteButton: {
      backgroundColor: "#dc3545",
      color: "#ffffff",
      padding: "8px 16px",
      border: "none",
      borderRadius: "6px",
      fontSize: "0.85rem",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.3s ease",
      textTransform: "uppercase",
      letterSpacing: "0.3px",
    },
    deleteButtonHover: {
      backgroundColor: "#c82333",
      transform: "translateY(-1px)",
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
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <div style={styles.loadingText}>Loading shipments...</div>
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
          <div style={styles.errorTitle}>Error Loading Shipments</div>
          <p>{error}</p>
          <button 
            style={{...styles.updateButton, padding: "12px 24px"}}
            onClick={() => window.location.reload()}
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
        <h1 style={styles.title}>Shipment Control</h1>
        <p style={styles.subtitle}>Manage and track all shipment records</p>
      </div>

      {/* Controls */}
      <div style={styles.controlsContainer}>
        <div style={styles.controlsRow}>
          <input
            type="text"
            placeholder="Search shipments by ID, carrier, or product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
            style={styles.addButton}
            onClick={() => navigate("/shipments/create")}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = styles.addButtonHover.backgroundColor;
              e.target.style.transform = styles.addButtonHover.transform;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = styles.addButton.backgroundColor;
              e.target.style.transform = "none";
            }}
          >
            + Add Shipment
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsContainer}>
        <span style={styles.statsText}>
          Total Shipments: <span style={styles.statsNumber}>{shipments.length}</span>
        </span>
        <span style={styles.statsText}>
          Showing: <span style={styles.statsNumber}>{filteredShipments.length}</span>
        </span>
        <span style={styles.statsText}>
          Active: <span style={styles.statsNumber}>
            {shipments.filter(s => s.status !== 'delivered' && s.status !== 'cancelled').length}
          </span>
        </span>
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
              filteredShipments.map(shipment => (
                <tr
                  key={shipment._id}
                  style={styles.tr}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = styles.trHover.backgroundColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <td style={styles.td}>
                    <span style={styles.shipmentId}>
                      {shipment.shipmentId}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.carrier}>
                      {shipment.carrier}
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
                        shipment.products.map((p, index) => (
                          <span key={index} style={styles.productItem}>
                            {p.product?.productName || 'Unknown'} ({p.quantity})
                          </span>
                        ))
                      ) : (
                        <span style={{fontStyle: 'italic', color: '#6c757d'}}>No products</span>
                      )}
                    </div>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actionsContainer}>
                      <button
                        onClick={() => navigate(`/shipments/update/${shipment._id}`)}
                        style={styles.updateButton}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = styles.updateButtonHover.backgroundColor;
                          e.target.style.transform = styles.updateButtonHover.transform;
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = styles.updateButton.backgroundColor;
                          e.target.style.transform = "none";
                        }}
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(shipment._id)}
                        style={styles.deleteButton}
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

export default ShipmentControl;