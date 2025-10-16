// src/components/ProductCard.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import api, { toPublicUrl } from "../api";

export default function ProductCard({ product, onUpdated, onToggleFavorite }) {
  const [notifyLoading, setNotifyLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  // Send manual email notification
  const notifyRecipient = async () => {
    const to = prompt("Send reorder alert to (email):", "");
    if (!to) return;
    try {
      setNotifyLoading(true);
      const subject = `Reorder Alert: ${product.productName}`;
      const message = `<p>Product <strong>${product.productName}</strong> has low stock.</p>
                       <p>Current: ${product.quantity} | Reorder level: ${product.reOrderLevel}</p>`;
      await api.post("/email/send-receipt", { to, from: "", subject, message });
      alert("Notification sent ✅");
    } catch (err) {
      console.error("Notify failed", err);
      alert("Failed to send notification.");
    } finally {
      setNotifyLoading(false);
    }
  };

  // Delete product
  const deleteProduct = async () => {
    if (!window.confirm(`Are you sure you want to delete "${product.productName}"?`)) return;
    try {
      setLoadingDelete(true);
      await api.delete(`/products/${product._id}`);
      onUpdated(null); // notify parent to reload products
    } catch (err) {
      console.error("Delete failed", err);
      alert("Delete failed");
    } finally {
      setLoadingDelete(false);
    }
  };

  const needsReordering = product.quantity <= product.reOrderLevel;

  const styles = {
    card: {
      background: "linear-gradient(145deg, #ffffff 0%, #f7f9fc 100%)",
      borderRadius: "16px",
      padding: "20px",
      boxShadow: "0 8px 30px rgba(0, 0, 0, 0.07)",
      border: "1px solid #eef2f7",
      display: "flex",
      flexDirection: "column",
      height: "100%",
      transition: "all 0.3s ease",
    },
    topSection: {
      display: "flex",
      alignItems: "flex-start",
      gap: "20px",
    },
    image: {
      width: "80px",
      height: "80px",
      objectFit: "cover",
      borderRadius: "12px",
      flexShrink: 0,
      border: "1px solid #e2e8f0",
    },
    content: {
      flex: 1,
    },
    title: {
      color: "#023E8A",
      fontSize: "1.25rem",
      fontWeight: "700",
      margin: "0 0 4px 0",
    },
    productId: {
      color: "#64748b",
      fontSize: "0.8rem",
      fontWeight: "500",
      marginBottom: "8px",
    },
    description: {
      color: "#334155",
      fontSize: "0.9rem",
      lineHeight: "1.5",
      marginBottom: "12px",
    },
    statsContainer: {
      display: "flex",
      gap: "20px",
      fontSize: "0.9rem",
    },
    stat: {
      color: "#475569",
    },
    statLabel: {
      fontWeight: "600",
      color: "#023E8A",
    },
    actions: {
      display: "flex",
      alignItems: "center",
      gap: "15px",
      marginTop: "16px",
      paddingTop: "16px",
      borderTop: "1px solid #eef2f7",
    },
    actionLink: {
      color: "#023E8A",
      textDecoration: "none",
      fontSize: "0.85rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    lowStockBanner: {
      marginTop: "15px",
      padding: "10px 15px",
      borderRadius: "10px",
      background: "linear-gradient(135deg, #fffbe6 0%, #fff6d5 100%)",
      border: "1px solid #fef3c7",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "10px",
    },
    lowStockText: {
      color: "#b45309",
      fontSize: "0.9rem",
      fontWeight: "600",
    },
    notifyButton: {
      background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      color: "#ffffff",
      padding: "6px 12px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      fontSize: "0.8rem",
      fontWeight: "700",
      transition: "transform 0.2s ease",
    },
    spinner: {
      display: "inline-block",
      width: "12px",
      height: "12px",
      border: "2px solid rgba(255,255,255,0.5)",
      borderTop: "2px solid #ffffff",
      borderRadius: "50%",
      animation: "spin 0.8s linear infinite",
    },
  };

  return (
    <div style={styles.card}>
      <div style={styles.topSection}>
        <img
          src={product.image ? toPublicUrl(product.image) : "https://via.placeholder.com/120"}
          alt={product.productName}
          style={styles.image}
        />
        <div style={styles.content}>
          <h3 style={styles.title}>{product.productName}</h3>
          <p style={styles.productId}>{product.productID}</p>
          <p style={styles.description}>{product.description}</p>
        </div>
      </div>

      <div style={styles.statsContainer}>
        <div style={styles.stat}>
          <span style={styles.statLabel}>Qty:</span> {product.quantity}
        </div>
        <div style={styles.stat}>
          <span style={styles.statLabel}>Reorder:</span> {product.reOrderLevel}
        </div>
      </div>

      <div style={styles.actions}>
        <span
          onClick={onToggleFavorite}
          style={{ ...styles.actionLink, color: product.favorite ? '#f59e0b' : '#64748b' }}
        >
          {product.favorite ? "★ Fav" : "☆ Fav"}
        </span>
        <Link to={`/product/${product._id}`} style={{ ...styles.actionLink, color: '#0369a1' }}>
          Edit
        </Link>
        <span
          onClick={deleteProduct}
          style={{ ...styles.actionLink, color: '#dc2626', marginLeft: 'auto' }}
        >
          {loadingDelete ? "Deleting..." : "Delete"}
        </span>
      </div>

      {needsReordering && (
        <div style={styles.lowStockBanner}>
          <div style={styles.lowStockText}>⚠️ Needs reordering</div>
          <button
            onClick={notifyRecipient}
            disabled={notifyLoading}
            style={styles.notifyButton}
          >
            {notifyLoading ? <span style={styles.spinner}></span> : "Notify"}
          </button>
        </div>
      )}
    </div>
  );
}