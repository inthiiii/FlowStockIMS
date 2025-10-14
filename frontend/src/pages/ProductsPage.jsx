import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import ProductCard from "../components/ProductCard";
import saveAs from "file-saver";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  const [animatedStats, setAnimatedStats] = useState({ total: 0, favorites: 0, inStock: 0 });

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/products");
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Animate stats on load
  useEffect(() => {
    if (products.length === 0) return;
    
    const favoriteCount = products.filter(p => p.favorite).length;
    const inStockCount = products.filter(p => p.quantity > 0).length;
    
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
        favorites: Math.floor(favoriteCount * easeOut),
        inStock: Math.floor(inStockCount * easeOut),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedStats({
          total: products.length,
          favorites: favoriteCount,
          inStock: inStockCount,
        });
      }
    }, interval);

    return () => clearInterval(timer);
  }, [products]);

  const handleUpdated = (updatedProduct) => {
    if (!updatedProduct) {
      loadProducts();
      return;
    }
    setProducts((prev) =>
      prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
    );
  };

  const toggleFavorite = async (product) => {
    try {
      const updated = await api.put(`/products/${product._id}`, {
        ...product,
        favorite: !product.favorite,
      });
      handleUpdated(updated.data);
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
      alert("Could not update favorite");
    }
  };

  const exportPDF = async () => {
    try {
      setExporting(true);
      const res = await api.get("/products/export/pdf", {
        responseType: "blob",
      });
      const blob = new Blob([res.data], { type: "application/pdf" });
      saveAs(blob, "products.pdf");
    } catch (err) {
      console.error("Export failed", err);
      alert("Could not export PDF");
    } finally {
      setExporting(false);
    }
  };

  const favoriteCount = products.filter((p) => p.favorite).length;

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
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "50px",
      flexWrap: "wrap",
      gap: "25px",
      animation: "fadeInDown 0.8s ease-out",
    },
    titleSection: {
      display: "flex",
      flexDirection: "column",
    },
    title: {
      color: "#023E8A",
      fontSize: "3.5rem",
      fontWeight: "800",
      margin: "0",
      marginBottom: "8px",
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
    actionsContainer: {
      display: "flex",
      gap: "15px",
      flexWrap: "wrap",
    },
    exportButton: {
      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      color: "#ffffff",
      padding: "16px 32px",
      borderRadius: "12px",
      border: "none",
      cursor: "pointer",
      fontSize: "1rem",
      fontWeight: "700",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      boxShadow: "0 6px 20px rgba(16, 185, 129, 0.3)",
    },
    exportButtonDisabled: {
      background: "linear-gradient(135deg, #94a3b8 0%, #64748b 100%)",
      cursor: "not-allowed",
      opacity: 0.7,
    },
    favoritesButton: {
      background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      color: "#ffffff",
      padding: "16px 32px",
      borderRadius: "12px",
      border: "none",
      textDecoration: "none",
      fontSize: "1rem",
      fontWeight: "700",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      boxShadow: "0 6px 20px rgba(245, 158, 11, 0.3)",
    },
    favoriteBadge: {
      backgroundColor: "#ef4444",
      color: "#ffffff",
      padding: "4px 10px",
      borderRadius: "20px",
      fontSize: "0.75rem",
      fontWeight: "800",
      minWidth: "24px",
      textAlign: "center",
      boxShadow: "0 2px 8px rgba(239, 68, 68, 0.4)",
      animation: "pulse 2s infinite",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "25px",
      marginBottom: "45px",
      animation: "fadeInUp 0.9s ease-out",
    },
    statCard: {
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      padding: "35px",
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
      fontSize: "2.8rem",
      marginBottom: "15px",
      display: "block",
      filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
      animation: "float 3s ease-in-out infinite",
    },
    statsNumber: {
      fontSize: "3rem",
      fontWeight: "800",
      margin: "12px 0 8px 0",
      lineHeight: "1",
    },
    statsText: {
      color: "#64748b",
      fontSize: "0.9rem",
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: "1px",
    },
    productsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
      gap: "80px",
      marginBottom: "40px",
    },
    productCardWrapper: {
      animation: "fadeInUp 0.6s ease-out",
      animationFillMode: "both",
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
      background: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
      color: "#991b1b",
      padding: "30px",
      borderRadius: "20px",
      border: "1px solid #fecaca",
      marginBottom: "35px",
      textAlign: "center",
      boxShadow: "0 10px 40px rgba(220, 53, 69, 0.15)",
      animation: "scaleIn 0.5s ease-out",
    },
    errorTitle: {
      fontSize: "1.5rem",
      fontWeight: "700",
      marginBottom: "12px",
    },
    errorText: {
      fontSize: "1.05rem",
      marginBottom: "20px",
      color: "#dc2626",
    },
    retryButton: {
      background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
      color: "#ffffff",
      padding: "12px 28px",
      borderRadius: "10px",
      border: "none",
      cursor: "pointer",
      fontSize: "0.95rem",
      fontWeight: "700",
      transition: "all 0.3s ease",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
    },
    emptyState: {
      textAlign: "center",
      padding: "100px 40px",
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      borderRadius: "20px",
      border: "2px dashed #e2e8f0",
      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.06)",
      animation: "fadeInUp 0.8s ease-out",
    },
    emptyIcon: {
      fontSize: "6rem",
      marginBottom: "25px",
      opacity: "0.4",
      filter: "grayscale(50%)",
    },
    emptyTitle: {
      fontSize: "2rem",
      fontWeight: "700",
      color: "#334155",
      marginBottom: "15px",
    },
    emptyText: {
      fontSize: "1.15rem",
      color: "#64748b",
      lineHeight: "1.7",
      maxWidth: "500px",
      margin: "0 auto",
    },
    spinner: {
      display: "inline-block",
      width: "18px",
      height: "18px",
      border: "3px solid #ffffff",
      borderTop: "3px solid transparent",
      borderRadius: "50%",
      animation: "spin 0.8s linear infinite",
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
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.15); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
    @keyframes shimmer {
      0% { background-position: -1000px 0; }
      100% { background-position: 1000px 0; }
    }
    .stat-card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 20px 60px rgba(2, 62, 138, 0.15);
    }
    .stat-card:hover .stat-glow {
      opacity: 1;
    }
    .action-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
    }
    .action-btn:active {
      transform: translateY(-1px);
    }
    .exporting-shimmer {
      background: linear-gradient(90deg, #94a3b8 0%, #64748b 50%, #94a3b8 100%);
      background-size: 1000px 100%;
      animation: shimmer 2s infinite;
    }
    .product-card-wrapper {
      transition: all 0.3s ease;
    }
    .product-card-wrapper:hover {
      transform: translateY(-8px);
    }
  `;

  if (loading) {
    return (
      <div style={styles.container}>
        <style>{styleSheet}</style>
        <div style={styles.backgroundPattern}></div>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <div style={styles.loadingText}>Loading products catalog...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{styleSheet}</style>
      <div style={styles.backgroundPattern}></div>
      
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.titleSection}>
            <h1 style={styles.title}>Products Catalog</h1>
            <p style={styles.subtitle}>Browse and manage motorcycle spare parts</p>
          </div>
          <div style={styles.actionsContainer}>
            <button
              onClick={exportPDF}
              disabled={exporting}
              className={exporting ? "exporting-shimmer" : "action-btn"}
              style={{
                ...styles.exportButton,
                ...(exporting && styles.exportButtonDisabled),
              }}
            >
              {exporting ? (
                <>
                  <span style={styles.spinner}></span>
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <span>📄</span>
                  <span>Export PDF</span>
                </>
              )}
            </button>
            <Link
              to="/products/favorites"
              className="action-btn"
              style={styles.favoritesButton}
            >
              <span>❤️</span>
              <span>Favorites</span>
              {favoriteCount > 0 && (
                <span style={styles.favoriteBadge}>{favoriteCount}</span>
              )}
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div style={styles.errorContainer}>
            <div style={styles.errorTitle}>⚠️ Error</div>
            <p style={styles.errorText}>{error}</p>
            <button
              className="action-btn"
              style={styles.retryButton}
              onClick={loadProducts}
            >
              🔄 Retry
            </button>
          </div>
        )}

        {/* Stats Grid */}
        {!error && products.length > 0 && (
          <div style={styles.statsGrid}>
            <div className="stat-card" style={styles.statCard}>
              <div className="stat-glow" style={styles.statGlow}></div>
              <span style={styles.statIcon}>📦</span>
              <div style={{...styles.statsNumber, color: '#023E8A'}}>
                {animatedStats.total}
              </div>
              <div style={styles.statsText}>Total Products</div>
            </div>
            
            <div className="stat-card" style={styles.statCard}>
              <div className="stat-glow" style={styles.statGlow}></div>
              <span style={styles.statIcon}>❤️</span>
              <div style={{...styles.statsNumber, color: '#ef4444'}}>
                {animatedStats.favorites}
              </div>
              <div style={styles.statsText}>Favorites</div>
            </div>
            
            <div className="stat-card" style={styles.statCard}>
              <div className="stat-glow" style={styles.statGlow}></div>
              <span style={styles.statIcon}>✅</span>
              <div style={{...styles.statsNumber, color: '#10b981'}}>
                {animatedStats.inStock}
              </div>
              <div style={styles.statsText}>In Stock</div>
            </div>
          </div>
        )}

        {/* Products Grid or Empty State */}
        {!error && products.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📦</div>
            <h2 style={styles.emptyTitle}>No Products Available</h2>
            <p style={styles.emptyText}>
              Start adding products to your catalog to see them here. Your motorcycle spare parts inventory will be displayed in this section.
            </p>
          </div>
        ) : (
          <div style={styles.productsGrid}>
            {products.map((p, index) => (
              <div 
                key={p._id} 
                className="product-card-wrapper"
                style={{
                  ...styles.productCardWrapper,
                  animationDelay: `${index * 0.05}s`
                }}
              >
                <ProductCard
                  product={p}
                  onUpdated={(u) => {
                    if (u) handleUpdated(u);
                    else loadProducts();
                  }}
                  onToggleFavorite={() => toggleFavorite(p)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}