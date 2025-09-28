// src/pages/ProductView.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductView = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterBy, setFilterBy] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/api/products");
      console.log("Products fetched:", response.data);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const getFilteredAndSortedProducts = () => {
    let filtered = products.filter((product) =>
      product.productName?.toLowerCase().includes(search.toLowerCase())
    );

    // Apply stock filter
    if (filterBy === "in-stock") {
      filtered = filtered.filter((product) => product.quantity > 0);
    } else if (filterBy === "low-stock") {
      filtered = filtered.filter((product) => product.quantity <= product.reOrderLevel);
    } else if (filterBy === "out-of-stock") {
      filtered = filtered.filter((product) => product.quantity === 0);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === "name") {
        return a.productName?.localeCompare(b.productName) || 0;
      } else if (sortBy === "quantity") {
        return b.quantity - a.quantity;
      } else if (sortBy === "model") {
        return a.modelName?.localeCompare(b.modelName) || 0;
      }
      return 0;
    });

    return filtered;
  };

  const getStockStatus = (product) => {
    if (product.quantity === 0) return { status: "Out of Stock", color: "#dc3545" };
    if (product.quantity <= product.reOrderLevel) return { status: "Low Stock", color: "#ffc107" };
    return { status: "In Stock", color: "#28a745" };
  };

  const filteredProducts = getFilteredAndSortedProducts();

  const styles = {
    container: {
      maxWidth: "1400px",
      margin: "0 auto",
      padding: "40px 20px",
      backgroundColor: "#ffffff",
      minHeight: "100vh",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    hero: {
      textAlign: "center",
      marginBottom: "50px",
      background: "linear-gradient(135deg, #023E8A 0%, #0056b3 100%)",
      color: "#ffffff",
      padding: "60px 40px",
      borderRadius: "20px",
      boxShadow: "0 10px 30px rgba(2, 62, 138, 0.3)",
    },
    title: {
      fontSize: "3rem",
      fontWeight: "700",
      margin: "0",
      marginBottom: "15px",
      textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
    },
    subtitle: {
      fontSize: "1.3rem",
      margin: "0",
      fontWeight: "300",
      opacity: "0.9",
    },
    filtersContainer: {
      backgroundColor: "#f8f9fa",
      padding: "30px",
      borderRadius: "15px",
      marginBottom: "40px",
      border: "1px solid #e9ecef",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
    },
    filtersGrid: {
      display: "grid",
      gridTemplateColumns: "2fr 1fr 1fr",
      gap: "20px",
      alignItems: "end",
    },
    filterGroup: {
      display: "flex",
      flexDirection: "column",
    },
    filterLabel: {
      fontSize: "0.9rem",
      fontWeight: "600",
      color: "#023E8A",
      marginBottom: "8px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    searchInput: {
      padding: "15px 20px",
      fontSize: "1.1rem",
      border: "2px solid #e9ecef",
      borderRadius: "12px",
      outline: "none",
      transition: "all 0.3s ease",
      backgroundColor: "#ffffff",
    },
    select: {
      padding: "15px 20px",
      fontSize: "1rem",
      border: "2px solid #e9ecef",
      borderRadius: "12px",
      outline: "none",
      backgroundColor: "#ffffff",
      cursor: "pointer",
      fontFamily: "inherit",
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
    productsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
      gap: "30px",
      marginBottom: "40px",
    },
    productCard: {
      backgroundColor: "#ffffff",
      border: "1px solid #e9ecef",
      borderRadius: "15px",
      padding: "25px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
      transition: "all 0.3s ease",
      position: "relative",
      overflow: "hidden",
    },
    productCardHover: {
      transform: "translateY(-5px)",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
    },
    productHeader: {
      marginBottom: "20px",
      paddingBottom: "15px",
      borderBottom: "2px solid #f8f9fa",
    },
    productName: {
      fontSize: "1.4rem",
      fontWeight: "600",
      color: "#023E8A",
      margin: "0 0 10px 0",
      lineHeight: "1.3",
    },
    productId: {
      fontSize: "0.9rem",
      color: "#6c757d",
      fontFamily: "monospace",
      backgroundColor: "#f8f9fa",
      padding: "4px 8px",
      borderRadius: "6px",
      display: "inline-block",
    },
    productDescription: {
      color: "#495057",
      fontSize: "1rem",
      lineHeight: "1.6",
      marginBottom: "20px",
      minHeight: "48px",
    },
    productDetails: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    detailRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "8px 0",
    },
    detailLabel: {
      fontSize: "0.95rem",
      fontWeight: "500",
      color: "#6c757d",
    },
    detailValue: {
      fontSize: "1rem",
      fontWeight: "600",
      color: "#023E8A",
    },
    quantityValue: {
      fontSize: "1.2rem",
      fontWeight: "700",
    },
    stockBadge: {
      position: "absolute",
      top: "20px",
      right: "20px",
      padding: "6px 12px",
      borderRadius: "20px",
      fontSize: "0.8rem",
      fontWeight: "600",
      color: "#ffffff",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    noProducts: {
      textAlign: "center",
      padding: "80px 20px",
      color: "#6c757d",
    },
    noProductsIcon: {
      fontSize: "4rem",
      marginBottom: "20px",
      opacity: "0.3",
    },
    noProductsText: {
      fontSize: "1.5rem",
      fontWeight: "500",
      marginBottom: "10px",
    },
    noProductsSubtext: {
      fontSize: "1rem",
      opacity: "0.7",
    },
    loadingContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "400px",
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
    },
    loadingText: {
      fontSize: "1.2rem",
      fontWeight: "500",
    },
    modelBadge: {
      backgroundColor: "#e3f2fd",
      color: "#1976d2",
      padding: "4px 10px",
      borderRadius: "12px",
      fontSize: "0.85rem",
      fontWeight: "500",
      display: "inline-block",
    },
    '@media (max-width: 768px)': {
      filtersGrid: {
        gridTemplateColumns: "1fr",
        gap: "15px",
      },
      productsGrid: {
        gridTemplateColumns: "1fr",
      },
      hero: {
        padding: "40px 20px",
      },
      title: {
        fontSize: "2.2rem",
      },
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <div style={styles.loadingText}>Loading our amazing products...</div>
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
      {/* Hero Section */}
      <div style={styles.hero}>
        <h1 style={styles.title}>Our Products</h1>
        <p style={styles.subtitle}>Discover our comprehensive range of quality products</p>
      </div>

      {/* Filters Section */}
      <div style={styles.filtersContainer}>
        <div style={styles.filtersGrid}>
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Search Products</label>
            <input
              type="text"
              placeholder="Search by product name..."
              value={search}
              onChange={handleSearch}
              style={styles.searchInput}
            />
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Filter by Stock</label>
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              style={styles.select}
            >
              <option value="all">All Products</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={styles.select}
            >
              <option value="name">Product Name</option>
              <option value="quantity">Stock Quantity</option>
              <option value="model">Model Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsContainer}>
        <span style={styles.statsText}>
          Total Products: <span style={styles.statsNumber}>{products.length}</span>
        </span>
        <span style={styles.statsText}>
          Showing: <span style={styles.statsNumber}>{filteredProducts.length}</span>
        </span>
        <span style={styles.statsText}>
          In Stock: <span style={styles.statsNumber}>
            {products.filter(p => p.quantity > 0).length}
          </span>
        </span>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div style={styles.noProducts}>
          <div style={styles.noProductsIcon}>📦</div>
          <div style={styles.noProductsText}>
            {search || filterBy !== "all" ? "No products match your criteria" : "No products available"}
          </div>
          <div style={styles.noProductsSubtext}>
            {search || filterBy !== "all" 
              ? "Try adjusting your search or filter settings" 
              : "Check back soon for new products"}
          </div>
        </div>
      ) : (
        <div style={styles.productsGrid}>
          {filteredProducts.map((product) => {
            const stockInfo = getStockStatus(product);
            return (
              <div
                key={product._id}
                style={styles.productCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = styles.productCardHover.transform;
                  e.currentTarget.style.boxShadow = styles.productCardHover.boxShadow;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = styles.productCard.boxShadow;
                }}
              >
                <div 
                  style={{
                    ...styles.stockBadge,
                    backgroundColor: stockInfo.color
                  }}
                >
                  {stockInfo.status}
                </div>

                <div style={styles.productHeader}>
                  <h3 style={styles.productName}>{product.productName}</h3>
                  <div style={styles.productId}>ID: {product.productID}</div>
                </div>

                {product.productImage && (
                  <img
                    src={`http://localhost:3000/${product.productImage}`}
                    alt={product.productName}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "12px",
                      marginBottom: "15px"
                    }}
                  />
                )}

                <p style={styles.productDescription}>
                  {product.description || "No description available"}
                </p>

                <div style={styles.productDetails}>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Available Quantity</span>
                    <span style={{...styles.detailValue, ...styles.quantityValue}}>
                      {product.quantity} units
                    </span>
                  </div>

                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Reorder Level</span>
                    <span style={styles.detailValue}>{product.reOrderLevel} units</span>
                  </div>

                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Model</span>
                    <span style={styles.modelBadge}>{product.modelName}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @media (max-width: 768px) {
            .filters-grid {
              grid-template-columns: 1fr !important;
            }
            .products-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ProductView;