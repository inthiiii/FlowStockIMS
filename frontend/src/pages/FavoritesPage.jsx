// src/pages/FavoritesPage.jsx
import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import api from "../api.js";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/products/favorites");
      setFavorites(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load favorites. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

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
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "40px",
      flexWrap: "wrap",
      gap: "20px",
    },
    titleSection: {
      display: "flex",
      alignItems: "center",
      gap: "15px",
    },
    icon: {
      fontSize: "2.5rem",
      color: "#dc3545",
    },
    titleGroup: {
      display: "flex",
      flexDirection: "column",
    },
    title: {
      color: "#023E8A",
      fontSize: "2.5rem",
      fontWeight: "600",
      margin: "0",
    },
    subtitle: {
      color: "#6c757d",
      fontSize: "1.1rem",
      margin: "0",
      fontWeight: "400",
    },
    backButton: {
      backgroundColor: "#023E8A",
      color: "#ffffff",
      padding: "12px 24px",
      borderRadius: "8px",
      textDecoration: "none",
      fontSize: "1rem",
      fontWeight: "600",
      transition: "all 0.3s ease",
      display: "inline-block",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    backButtonHover: {
      backgroundColor: "#012a5c",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(2, 62, 138, 0.3)",
    },
    statsBar: {
      backgroundColor: "#f8f9fa",
      padding: "20px 25px",
      borderRadius: "12px",
      marginBottom: "30px",
      border: "1px solid #e9ecef",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "15px",
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
    productsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: "25px",
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
    loadingText: {
      fontSize: "1.2rem",
      fontWeight: "500",
    },
    emptyState: {
      textAlign: "center",
      padding: "80px 20px",
      backgroundColor: "#f8f9fa",
      borderRadius: "15px",
      border: "2px dashed #e9ecef",
    },
    emptyIcon: {
      fontSize: "5rem",
      marginBottom: "20px",
      opacity: "0.3",
    },
    emptyTitle: {
      fontSize: "1.8rem",
      fontWeight: "600",
      color: "#495057",
      marginBottom: "15px",
    },
    emptyText: {
      fontSize: "1.1rem",
      color: "#6c757d",
      marginBottom: "30px",
      lineHeight: "1.6",
    },
    emptyButton: {
      backgroundColor: "#023E8A",
      color: "#ffffff",
      padding: "15px 30px",
      borderRadius: "8px",
      textDecoration: "none",
      fontSize: "1.1rem",
      fontWeight: "600",
      transition: "all 0.3s ease",
      display: "inline-block",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    emptyButtonHover: {
      backgroundColor: "#012a5c",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(2, 62, 138, 0.3)",
    },
    errorContainer: {
      backgroundColor: "#f8d7da",
      color: "#721c24",
      padding: "20px",
      borderRadius: "12px",
      border: "1px solid #f5c6cb",
      marginBottom: "30px",
      textAlign: "center",
    },
    errorTitle: {
      fontSize: "1.2rem",
      fontWeight: "600",
      marginBottom: "10px",
    },
    retryButton: {
      backgroundColor: "#dc3545",
      color: "#ffffff",
      padding: "10px 20px",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      fontSize: "0.95rem",
      fontWeight: "600",
      transition: "all 0.3s ease",
      marginTop: "10px",
    },
    retryButtonHover: {
      backgroundColor: "#c82333",
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <div style={styles.loadingText}>Loading your favorites...</div>
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
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.titleSection}>
          <span style={styles.icon}></span>
          <div style={styles.titleGroup}>
            <h1 style={styles.title}>My Favorites</h1>
            <p style={styles.subtitle}>Your saved motorcycle spare parts</p>
          </div>
        </div>
        <a
          href="/"
          style={styles.backButton}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = styles.backButtonHover.backgroundColor;
            e.target.style.transform = styles.backButtonHover.transform;
            e.target.style.boxShadow = styles.backButtonHover.boxShadow;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = styles.backButton.backgroundColor;
            e.target.style.transform = "none";
            e.target.style.boxShadow = "none";
          }}
        >
          ← Back to Products
        </a>
      </div>

      {/* Error Message */}
      {error && (
        <div style={styles.errorContainer}>
          <div style={styles.errorTitle}>Error</div>
          <p>{error}</p>
          <button
            style={styles.retryButton}
            onClick={load}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = styles.retryButtonHover.backgroundColor;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = styles.retryButton.backgroundColor;
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Stats Bar */}
      {!error && favorites.length > 0 && (
        <div style={styles.statsBar}>
          <span style={styles.statsText}>
            Total Favorites: <span style={styles.statsNumber}>{favorites.length}</span>
          </span>
          <span style={styles.statsText}>
            Keep adding products you love!
          </span>
        </div>
      )}

      {/* Empty State */}
      {!error && favorites.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>💔</div>
          <h2 style={styles.emptyTitle}>No Favorites Yet</h2>
          <p style={styles.emptyText}>
            Start building your collection of favorite motorcycle spare parts!<br />
            Browse our products and click the heart icon to save items here.
          </p>
          <a
            href="/"
            style={styles.emptyButton}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = styles.emptyButtonHover.backgroundColor;
              e.target.style.transform = styles.emptyButtonHover.transform;
              e.target.style.boxShadow = styles.emptyButtonHover.boxShadow;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = styles.emptyButton.backgroundColor;
              e.target.style.transform = "none";
              e.target.style.boxShadow = "none";
            }}
          >
            Browse Products
          </a>
        </div>
      ) : (
        /* Products Grid */
        <div style={styles.productsGrid}>
          {favorites.map((p) => (
            <ProductCard key={p._id} product={p} onUpdated={() => load()} />
          ))}
        </div>
      )}

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
}
