// src/pages/FavoritesPage.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import api from "../api";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadFavorites = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/products/favorites");
      setFavorites(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load favorites. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

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
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: "50px",
      animation: "fadeInDown 0.6s ease-out"
    },
    headerText: {
        textAlign: 'left',
    },
    title: {
      color: "#023E8A",
      fontSize: "3rem",
      fontWeight: "700",
      margin: "0 0 12px 0",
      letterSpacing: "-1px",
      textShadow: "0 2px 4px rgba(2, 62, 138, 0.1)"
    },
    subtitle: {
      color: "#64748b",
      fontSize: "1.15rem",
      margin: "0",
      fontWeight: "400",
    },
    backButton: {
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
      textDecoration: 'none',
      display: "inline-flex",
      alignItems: "center",
      gap: "8px"
    },
    statCard: {
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      padding: "25px",
      borderRadius: "16px",
      border: "1px solid #e2e8f0",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
      transition: "all 0.3s ease",
      animation: "scaleIn 0.5s ease-out",
      marginBottom: '35px',
      display: 'flex',
      alignItems: 'center',
      gap: '20px'
    },
    statIcon: {
        fontSize: "2.5rem",
        color: '#f59e0b' // A nice gold/yellow for favorites
    },
    statValue: {
      fontSize: "2.5rem",
      color: "#023E8A",
      fontWeight: "700",
    },
    statLabel: {
      fontSize: "1rem",
      color: "#64748b",
      fontWeight: "500",
    },
    productsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
      gap: "30px",
      animation: "fadeInUp 0.8s ease-out"
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
      color: "#64748b",
      fontSize: "1.2rem",
      fontWeight: "500"
    },
    emptyStateContainer: {
      textAlign: "center",
      padding: "80px 40px",
      backgroundColor: "#ffffff",
      borderRadius: "20px",
      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.06)",
      border: "1px solid #e2e8f0",
      animation: "fadeInUp 0.7s ease-out"
    },
    emptyIcon: {
      fontSize: "4.5rem",
      marginBottom: "25px",
      color: '#023E8A',
      opacity: '0.6'
    },
    emptyTitle: {
      color: "#1e293b",
      fontSize: "2rem",
      fontWeight: "700",
      marginBottom: "15px",
    },
    emptyText: {
      color: "#64748b",
      fontSize: "1.1rem",
      marginBottom: "30px",
      lineHeight: "1.7",
      maxWidth: '500px',
      margin: '0 auto 30px auto'
    },
    emptyButton: {
      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      color: "#ffffff",
      padding: "14px 32px",
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
      boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)"
    },
    errorMessage: {
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        color: "#b91c1c",
        borderColor: "rgba(239, 68, 68, 0.2)",
        padding: "16px 20px",
        borderRadius: "10px",
        border: "1px solid",
        fontSize: "1rem",
        fontWeight: "500",
        marginBottom: "20px",
        textAlign: "center",
    },
  };

  const styleSheet = `
    @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    @keyframes spin { to { transform: rotate(360deg); } }
    .action-button:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(2, 62, 138, 0.2); }
    .action-button:active { transform: translateY(0); box-shadow: 0 4px 12px rgba(2, 62, 138, 0.3); }
  `;

  if (loading) {
    return (
      <div style={styles.container}>
        <style>{styleSheet}</style>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <div style={styles.loadingText}>Loading Your Favorite Products...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{styleSheet}</style>
      
      <header style={styles.header}>
        <div style={styles.headerText}>
          <h1 style={styles.title}>My Favorites</h1>
          <p style={styles.subtitle}>Your hand-picked collection of essential parts</p>
        </div>
        <Link to="/products/list" style={styles.backButton} className="action-button">
          ← Back to All Products
        </Link>
      </header>

      {error && <div style={styles.errorMessage}><strong>Error:</strong> {error}</div>}

      {!error && favorites.length > 0 && (
        <div style={styles.statCard}>
            <div style={styles.statIcon}>★</div>
            <div>
                <div style={styles.statValue}>{favorites.length}</div>
                <div style={styles.statLabel}>Total Favorite Items</div>
            </div>
        </div>
      )}
      
      {!error && favorites.length === 0 ? (
        <div style={styles.emptyStateContainer}>
          <div style={styles.emptyIcon}>💔</div>
          <h2 style={styles.emptyTitle}>Your Favorites List is Empty</h2>
          <p style={styles.emptyText}>
            You haven't added any favorite parts yet. Browse our catalog and click the star icon to save items here for easy access.
          </p>
          <Link to="/products/list" style={styles.emptyButton} className="action-button">
            Browse Products
          </Link>
        </div>
      ) : (
        <div style={styles.productsGrid}>
          {favorites.map((p) => (
            <ProductCard key={p._id} product={p} onUpdated={loadFavorites} />
          ))}
        </div>
      )}
    </div>
  );
}


