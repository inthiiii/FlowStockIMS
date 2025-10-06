// src/pages/ProductControl.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProductControl = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

  const styles = {
    container: {
      maxWidth: "1200px",
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
    },
    searchInput: {
      width: "100%",
      padding: "15px 20px",
      fontSize: "1rem",
      border: "2px solid #e9ecef",
      borderRadius: "10px",
      outline: "none",
      transition: "all 0.3s ease",
      backgroundColor: "#ffffff",
      boxSizing: "border-box",
    },
    searchInputFocus: {
      borderColor: "#023E8A",
      boxShadow: "0 0 0 3px rgba(2, 62, 138, 0.1)",
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
      fontSize: "0.875rem",
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
    productName: {
      fontWeight: "500",
      color: "#023E8A",
    },
    productId: {
      fontFamily: "monospace",
      backgroundColor: "#f8f9fa",
      padding: "4px 8px",
      borderRadius: "4px",
      fontSize: "0.875rem",
    },
    actionsContainer: {
      display: "flex",
      gap: "10px",
      alignItems: "center",
    },
    editButton: {
      backgroundColor: "#023E8A",
      color: "#ffffff",
      padding: "8px 16px",
      border: "none",
      borderRadius: "6px",
      fontSize: "0.875rem",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.3s ease",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    editButtonHover: {
      backgroundColor: "#012a5c",
      transform: "translateY(-1px)",
    },
    deleteButton: {
      backgroundColor: "#dc3545",
      color: "#ffffff",
      padding: "8px 16px",
      border: "none",
      borderRadius: "6px",
      fontSize: "0.875rem",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.3s ease",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    deleteButtonHover: {
      backgroundColor: "#c82333",
      transform: "translateY(-1px)",
    },
    loadingContainer: {
      textAlign: "center",
      padding: "60px 20px",
      color: "#6c757d",
      fontSize: "1.1rem",
    },
    errorContainer: {
      textAlign: "center",
      padding: "60px 20px",
      color: "#dc3545",
      fontSize: "1.1rem",
      backgroundColor: "#f8d7da",
      border: "1px solid #f5c6cb",
      borderRadius: "8px",
      margin: "20px 0",
    },
    noResults: {
      textAlign: "center",
      padding: "40px 20px",
      color: "#6c757d",
      fontSize: "1rem",
      fontStyle: "italic",
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
  };

  const filteredProducts = products.filter((product) =>
    product.productName?.toLowerCase().includes(search.toLowerCase())
  );

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
          <p>Loading products...</p>
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
          <h2 style={{ margin: "0 0 10px 0", color: "#721c24" }}>Error</h2>
          <p style={{ margin: "0" }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
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

      <div style={styles.statsContainer}>
        <span style={styles.statsText}>
          Total Products: <span style={styles.statsNumber}>{products.length}</span>
        </span>
        <span style={styles.statsText}>
          Filtered Results: <span style={styles.statsNumber}>{filteredProducts.length}</span>
        </span>
      </div>

      {/* Low Stock Warning Box */}
{products.filter((p) => p.quantity !== undefined && p.quantity <= 5).length > 0 && (
  <div
    style={{
      backgroundColor: "#fff3cd",
      color: "#856404",
      border: "1px solid #ffeeba",
      borderRadius: "8px",
      padding: "15px 20px",
      marginBottom: "25px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      fontWeight: "500",
      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    }}
  >
    ⚠️{" "}
    <span>
      <strong>
        {products.filter((p) => p.quantity !== undefined && p.quantity <= 5).length}
      </strong>{" "}
      {products.filter((p) => p.quantity !== undefined && p.quantity <= 5).length === 1
        ? "product has"
        : "products have"}{" "}
      low stock (≤ 5 units).
    </span>
  </div>
)}

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
              filteredProducts.map((product) => (
                <tr
                  key={product._id}
                  style={styles.tr}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = styles.trHover.backgroundColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
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
                          fontWeight: "600",
                          color: product.quantity <= 5 ? "#dc3545" : "#023E8A",
                        }}
                      >
                        {product.quantity}
                      </span>
                    ) : (
                      <span style={{ color: "#6c757d", fontStyle: "italic" }}>N/A</span>
                    )}
                  </td>

                  <td style={styles.td}>
                    <div style={styles.actionsContainer}>
                      <button
                        onClick={() => navigate(`/product/${product._id}`)}
                        style={styles.editButton}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = styles.editButtonHover.backgroundColor;
                          e.target.style.transform = styles.editButtonHover.transform;
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = styles.editButton.backgroundColor;
                          e.target.style.transform = "none";
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
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
                <td colSpan="3" style={styles.noResults}>
                  {search ? `No products found matching "${search}"` : "No products available"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductControl;