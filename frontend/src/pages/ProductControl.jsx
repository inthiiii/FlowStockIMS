import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProductControl = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [animatedStats, setAnimatedStats] = useState({ total: 0, filtered: 0, lowStock: 0 });
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/api/products");
      setProducts(response.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to fetch products.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Animate stats on load
  useEffect(() => {
    if (products.length === 0) return;
    
    const filteredCount = filteredProducts.length;
    const lowStockCount = products.filter(p => p.quantity !== undefined && p.quantity <= 5).length;
    
    const duration = 1500;
    const steps = 60;
    const interval = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setAnimatedStats({
        total: Math.floor(products.length * easeOut),
        filtered: Math.floor(filteredCount * easeOut),
        lowStock: Math.floor(lowStockCount * easeOut),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedStats({
          total: products.length,
          filtered: filteredCount,
          lowStock: lowStockCount,
        });
      }
    }, interval);

    return () => clearInterval(timer);
  }, [products, search]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:3000/api/products/${id}`);
        fetchProducts();
      } catch (error) {
        alert("Product deleted Successfully");
      }
    }
  };

  const filteredProducts = products.filter((product) =>
    product.productName?.toLowerCase().includes(search.toLowerCase())
  );

  const lowStockProducts = products.filter((p) => p.quantity !== undefined && p.quantity <= 5);

  const styles = {
    container: {
      maxWidth: "1500px",
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
      marginBottom: "35px",
      position: "relative",
      maxWidth: "600px",
      margin: "0 auto 35px auto",
      animation: "fadeInUp 0.8s ease-out",
    },
    searchInput: {
      width: "100%",
      padding: "18px 50px 18px 24px",
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
      right: "20px",
      top: "50%",
      transform: "translateY(-50%)",
      fontSize: "1.3rem",
      color: "#64748b",
      pointerEvents: "none",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
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
      position: "relative",
      overflow: "hidden",
    },
    statGlow: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "radial-gradient(circle at center, rgba(2, 62, 138, 0.05) 0%, transparent 70%)",
      opacity: 0,
      transition: "opacity 0.3s ease",
      pointerEvents: "none",
    },
    statIcon: {
      fontSize: "2.5rem",
      marginBottom: "12px",
      display: "block",
      filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
      animation: "float 3s ease-in-out infinite",
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
    warningBox: {
      background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
      color: "#92400e",
      border: "2px solid #fbbf24",
      borderRadius: "16px",
      padding: "20px 25px",
      marginBottom: "30px",
      display: "flex",
      alignItems: "center",
      gap: "15px",
      fontWeight: "500",
      boxShadow: "0 8px 24px rgba(251, 191, 36, 0.2)",
      animation: "slideInDown 0.6s ease-out",
    },
    warningIcon: {
      fontSize: "2rem",
      animation: "pulse 2s infinite",
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
    productName: {
      fontWeight: "600",
      color: "#023E8A",
      fontSize: "1rem",
    },
    productId: {
      fontFamily: "monospace",
      backgroundColor: "#f8fafc",
      padding: "6px 12px",
      borderRadius: "8px",
      fontSize: "0.875rem",
      fontWeight: "700",
      color: "#64748b",
    },
    quantityBadge: {
      padding: "6px 14px",
      borderRadius: "20px",
      fontSize: "0.9rem",
      fontWeight: "700",
      display: "inline-block",
    },
    actionsContainer: {
      display: "flex",
      gap: "10px",
      alignItems: "center",
    },
    editButton: {
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
    errorContainer: {
      textAlign: "center",
      padding: "60px 30px",
      background: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
      border: "1px solid #fecaca",
      borderRadius: "20px",
      margin: "40px 0",
      boxShadow: "0 10px 40px rgba(220, 53, 69, 0.15)",
      animation: "scaleIn 0.5s ease-out",
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
    retryButton: {
      background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
      color: "#ffffff",
      padding: "14px 32px",
      border: "none",
      borderRadius: "12px",
      fontSize: "1rem",
      fontWeight: "700",
      cursor: "pointer",
      transition: "all 0.3s ease",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      boxShadow: "0 6px 20px rgba(239, 68, 68, 0.3)",
    },
    noResults: {
      textAlign: "center",
      padding: "60px 20px",
      color: "#64748b",
      fontSize: "1.1rem",
    },
    noResultsIcon: {
      fontSize: "4rem",
      marginBottom: "15px",
      opacity: "0.5",
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
    @keyframes slideInDown {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
    .stat-card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 20px 60px rgba(2, 62, 138, 0.15);
    }
    .stat-card:hover .stat-glow {
      opacity: 1;
    }
    .table-row:hover {
      background-color: #f8fafc !important;
      transform: translateX(4px);
    }
    input:focus {
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
  `;

  if (loading) {
    return (
      <div style={styles.container}>
        <style>{styleSheet}</style>
        <div style={styles.backgroundPattern}></div>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <div style={styles.loadingText}>Loading product inventory...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <style>{styleSheet}</style>
        <div style={styles.backgroundPattern}></div>
        <div style={styles.content}>
          <div style={styles.errorContainer}>
            <div style={styles.errorTitle}>⚠️ Error</div>
            <p style={styles.errorText}>{error}</p>
            <button 
              className="action-btn"
              style={styles.retryButton}
              onClick={fetchProducts}
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
          <h1 style={styles.title}>Product Control</h1>
          <p style={styles.subtitle}>Manage and control the product inventory</p>
        </div>

        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search products by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          <span style={styles.searchIcon}>🔍</span>
        </div>

        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          <div className="stat-card" style={styles.statCard}>
            <div className="stat-glow" style={styles.statGlow}></div>
            <span style={styles.statIcon}>📦</span>
            <div style={{...styles.statNumber, color: '#023E8A'}}>
              {animatedStats.total}
            </div>
            <div style={styles.statLabel}>Total Products</div>
          </div>
          
          <div className="stat-card" style={styles.statCard}>
            <div className="stat-glow" style={styles.statGlow}></div>
            <span style={styles.statIcon}>🔎</span>
            <div style={{...styles.statNumber, color: '#10b981'}}>
              {animatedStats.filtered}
            </div>
            <div style={styles.statLabel}>Filtered Results</div>
          </div>
          
          <div className="stat-card" style={styles.statCard}>
            <div className="stat-glow" style={styles.statGlow}></div>
            <span style={styles.statIcon}>⚠️</span>
            <div style={{...styles.statNumber, color: '#ef4444'}}>
              {animatedStats.lowStock}
            </div>
            <div style={styles.statLabel}>Low Stock Items</div>
          </div>
        </div>

        {/* Low Stock Warning */}
        {lowStockProducts.length > 0 && (
          <div style={styles.warningBox}>
            <span style={styles.warningIcon}>⚠️</span>
            <span>
              <strong>{lowStockProducts.length}</strong>{" "}
              {lowStockProducts.length === 1 ? "product has" : "products have"}{" "}
              low stock (≤ 5 units). Consider restocking soon to avoid shortages.
            </span>
          </div>
        )}

        {/* Table */}
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead style={styles.tableHeader}>
              <tr>
                <th style={styles.th}>Product Name</th>
                <th style={styles.th}>Product ID</th>
                <th style={styles.th}>Quantity</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody style={styles.tbody}>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <tr
                    key={product._id}
                    className="table-row"
                    style={{
                      ...styles.tr,
                      animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`
                    }}
                  >
                    <td style={{...styles.td, ...styles.productName}}>
                      {product.productName}
                    </td>
                    <td style={styles.td}>
                      <span style={styles.productId}>{product.productID}</span>
                    </td>
                    <td style={styles.td}>
                      {product.quantity !== undefined ? (
                        <span
                          style={{
                            ...styles.quantityBadge,
                            backgroundColor: product.quantity <= 5 ? '#fee2e2' : '#dbeafe',
                            color: product.quantity <= 5 ? '#991b1b' : '#1e40af',
                            border: `2px solid ${product.quantity <= 5 ? '#fca5a5' : '#93c5fd'}`,
                          }}
                        >
                          {product.quantity} units
                        </span>
                      ) : (
                        <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>N/A</span>
                      )}
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actionsContainer}>
                        <button
                          onClick={() => navigate(`/product/${product._id}`)}
                          className="action-btn"
                          style={styles.editButton}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
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
                  <td colSpan="4" style={styles.noResults}>
                    <div style={styles.noResultsIcon}>📦</div>
                    {search ? `No products found matching "${search}"` : "No products available"}
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

export default ProductControl;