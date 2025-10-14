// src/pages/ProductView.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductView = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterBy, setFilterBy] = useState("all");
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);

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
    if (product.quantity === 0) return { status: "Out of Stock", color: "#dc3545", gradient: "linear-gradient(135deg, #dc3545 0%, #c82333 100%)" };
    if (product.quantity <= product.reOrderLevel) return { status: "Low Stock", color: "#fbbf24", gradient: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)" };
    return { status: "In Stock", color: "#10b981", gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)" };
  };

  const filteredProducts = getFilteredAndSortedProducts();

  const styles = {
    container: {
      maxWidth: "1400px",
      margin: "0 auto",
      padding: "0",
      backgroundColor: "#ffffff",
      minHeight: "100vh",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },

    // Hero Section
    hero: {
      textAlign: "center",
      marginBottom: "0",
      background: "linear-gradient(135deg, #023E8A 0%, #0077B6 50%, #00B4D8 100%)",
      color: "#ffffff",
      padding: "120px 40px",
      position: "relative",
      overflow: "hidden",
      backgroundSize: "200% 200%",
    },
    heroDecoration: {
      position: "absolute",
      width: "600px",
      height: "600px",
      borderRadius: "50%",
      background: "rgba(255, 255, 255, 0.1)",
      filter: "blur(120px)",
    },
    heroDecorationTop: {
      top: "-250px",
      right: "-150px",
    },
    heroDecorationBottom: {
      bottom: "-250px",
      left: "-150px",
    },
    title: {
      fontSize: "4rem",
      fontWeight: "900",
      margin: "0",
      marginBottom: "20px",
      textShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
      letterSpacing: "-2px",
      position: "relative",
      zIndex: 2,
    },
    subtitle: {
      fontSize: "1.4rem",
      margin: "0",
      fontWeight: "400",
      opacity: "0.95",
      position: "relative",
      zIndex: 2,
    },

    // Content Section
    contentSection: {
      padding: "80px 40px",
      background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
    },

    // Filters Container
    filtersContainer: {
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      padding: "40px",
      borderRadius: "24px",
      marginBottom: "40px",
      border: "2px solid #e2e8f0",
      boxShadow: "0 8px 30px rgba(2, 62, 138, 0.08)",
    },
    filtersGrid: {
      display: "grid",
      gridTemplateColumns: "2fr 1fr 1fr",
      gap: "24px",
      alignItems: "end",
    },
    filterGroup: {
      display: "flex",
      flexDirection: "column",
    },
    filterLabel: {
      fontSize: "0.9rem",
      fontWeight: "700",
      color: "#023E8A",
      marginBottom: "10px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    searchInput: {
      padding: "18px 24px",
      fontSize: "1.05rem",
      border: "2px solid #e2e8f0",
      borderRadius: "16px",
      outline: "none",
      transition: "all 0.3s ease",
      backgroundColor: "#ffffff",
      color: "#1e293b",
      fontFamily: "inherit",
    },
    searchInputFocused: {
      borderColor: "#0077B6",
      boxShadow: "0 0 0 4px rgba(0, 119, 182, 0.1)",
      transform: "translateY(-2px)",
    },
    select: {
      padding: "18px 24px",
      fontSize: "1rem",
      border: "2px solid #e2e8f0",
      borderRadius: "16px",
      outline: "none",
      backgroundColor: "#ffffff",
      cursor: "pointer",
      fontFamily: "inherit",
      color: "#1e293b",
      transition: "all 0.3s ease",
    },

    // Stats Container
    statsContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "24px",
      marginBottom: "50px",
    },
    statCard: {
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      padding: "28px 32px",
      borderRadius: "20px",
      border: "2px solid #e2e8f0",
      boxShadow: "0 4px 20px rgba(2, 62, 138, 0.06)",
      textAlign: "center",
      transition: "all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    },
    statLabel: {
      color: "#64748b",
      fontSize: "0.95rem",
      fontWeight: "600",
      marginBottom: "8px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    statNumber: {
      color: "#023E8A",
      fontWeight: "900",
      fontSize: "2.5rem",
      display: "block",
      lineHeight: "1",
      background: "linear-gradient(135deg, #023E8A 0%, #0077B6 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    },

    // Products Grid
    productsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
      gap: "40px",
    },
    productCard: {
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      border: "2px solid #e2e8f0",
      borderRadius: "24px",
      padding: "0",
      boxShadow: "0 4px 20px rgba(2, 62, 138, 0.06)",
      transition: "all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      position: "relative",
      overflow: "hidden",
      cursor: "default",
    },
    productImageContainer: {
      width: "100%",
      height: "240px",
      position: "relative",
      overflow: "hidden",
      background: "linear-gradient(135deg, #023E8A 0%, #0077B6 100%)",
    },
    productImage: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "transform 0.5s ease",
    },
    productContent: {
      padding: "28px",
    },
    productHeader: {
      marginBottom: "20px",
      paddingBottom: "20px",
      borderBottom: "2px solid #e2e8f0",
    },
    productName: {
      fontSize: "1.5rem",
      fontWeight: "700",
      color: "#023E8A",
      margin: "0 0 12px 0",
      lineHeight: "1.3",
    },
    productId: {
      fontSize: "0.85rem",
      color: "#64748b",
      fontFamily: "monospace",
      backgroundColor: "#f1f5f9",
      padding: "6px 12px",
      borderRadius: "8px",
      display: "inline-block",
      fontWeight: "600",
    },
    productDescription: {
      color: "#334155",
      fontSize: "1rem",
      lineHeight: "1.7",
      marginBottom: "24px",
      minHeight: "50px",
    },
    productDetails: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    },
    detailRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 16px",
      background: "#ffffff",
      borderRadius: "12px",
      border: "1px solid #e2e8f0",
    },
    detailLabel: {
      fontSize: "0.95rem",
      fontWeight: "600",
      color: "#64748b",
    },
    detailValue: {
      fontSize: "1.05rem",
      fontWeight: "700",
      color: "#023E8A",
    },
    quantityValue: {
      fontSize: "1.3rem",
      fontWeight: "800",
    },
    stockBadge: {
      position: "absolute",
      top: "20px",
      right: "20px",
      padding: "10px 18px",
      borderRadius: "50px",
      fontSize: "0.8rem",
      fontWeight: "700",
      color: "#ffffff",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
      zIndex: 10,
      backdropFilter: "blur(10px)",
    },
    modelBadge: {
      background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
      color: "#1976d2",
      padding: "6px 14px",
      borderRadius: "20px",
      fontSize: "0.9rem",
      fontWeight: "700",
      display: "inline-block",
    },

    // No Products State
    noProducts: {
      textAlign: "center",
      padding: "100px 20px",
      color: "#64748b",
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      borderRadius: "24px",
      border: "2px solid #e2e8f0",
    },
    noProductsIcon: {
      fontSize: "5rem",
      marginBottom: "24px",
      opacity: "0.3",
    },
    noProductsText: {
      fontSize: "1.8rem",
      fontWeight: "700",
      marginBottom: "12px",
      color: "#023E8A",
    },
    noProductsSubtext: {
      fontSize: "1.1rem",
      opacity: "0.7",
      color: "#64748b",
    },

    // Loading State
    loadingContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "80vh",
      color: "#64748b",
    },
    loadingSpinner: {
      width: "60px",
      height: "60px",
      border: "5px solid #e2e8f0",
      borderTop: "5px solid #023E8A",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      marginBottom: "24px",
    },
    loadingText: {
      fontSize: "1.3rem",
      fontWeight: "600",
      color: "#023E8A",
    },

    // Responsive
    '@media (max-width: 768px)': {
      title: { fontSize: "2.5rem" },
      hero: { padding: "80px 20px" },
      contentSection: { padding: "60px 20px" },
      filtersGrid: { gridTemplateColumns: "1fr" },
      statsContainer: { gridTemplateColumns: "1fr" },
      productsGrid: { gridTemplateColumns: "1fr" },
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
        <div style={{...styles.heroDecoration, ...styles.heroDecorationTop}}></div>
        <div style={{...styles.heroDecoration, ...styles.heroDecorationBottom}}></div>
        <h1 style={styles.title}>Our Products</h1>
        <p style={styles.subtitle}>Discover our comprehensive range of quality products</p>
      </div>

      {/* Content Section */}
      <div style={styles.contentSection}>
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
                style={{
                  ...styles.searchInput,
                  ...(focusedInput === 'search' ? styles.searchInputFocused : {})
                }}
                onFocus={() => setFocusedInput('search')}
                onBlur={() => setFocusedInput(null)}
              />
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Filter by Stock</label>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                style={styles.select}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = "#0077B6";
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                }}
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
                onMouseEnter={(e) => {
                  e.target.style.borderColor = "#0077B6";
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                }}
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
          <div 
            style={styles.statCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow = "0 12px 40px rgba(2, 62, 138, 0.15)";
              e.currentTarget.style.borderColor = "#0077B6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(2, 62, 138, 0.06)";
              e.currentTarget.style.borderColor = "#e2e8f0";
            }}
          >
            <div style={styles.statLabel}>Total Products</div>
            <span style={styles.statNumber}>{products.length}</span>
          </div>

          <div 
            style={styles.statCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow = "0 12px 40px rgba(2, 62, 138, 0.15)";
              e.currentTarget.style.borderColor = "#0077B6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(2, 62, 138, 0.06)";
              e.currentTarget.style.borderColor = "#e2e8f0";
            }}
          >
            <div style={styles.statLabel}>Showing</div>
            <span style={styles.statNumber}>{filteredProducts.length}</span>
          </div>

          <div 
            style={styles.statCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow = "0 12px 40px rgba(2, 62, 138, 0.15)";
              e.currentTarget.style.borderColor = "#0077B6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(2, 62, 138, 0.06)";
              e.currentTarget.style.borderColor = "#e2e8f0";
            }}
          >
            <div style={styles.statLabel}>In Stock</div>
            <span style={styles.statNumber}>
              {products.filter(p => p.quantity > 0).length}
            </span>
          </div>
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
                    setHoveredCard(product._id);
                    e.currentTarget.style.transform = "translateY(-12px)";
                    e.currentTarget.style.boxShadow = "0 20px 60px rgba(2, 62, 138, 0.2)";
                    e.currentTarget.style.borderColor = "#0077B6";
                  }}
                  onMouseLeave={(e) => {
                    setHoveredCard(null);
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(2, 62, 138, 0.06)";
                    e.currentTarget.style.borderColor = "#e2e8f0";
                  }}
                >
                  <div style={styles.productImageContainer}>
                    {product.productImage ? (
                      <img
                        src={`http://localhost:3000/${product.productImage}`}
                        alt={product.productName}
                        style={{
                          ...styles.productImage,
                          transform: hoveredCard === product._id ? "scale(1.1)" : "scale(1)"
                        }}
                      />
                    ) : (
                      <div style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "4rem",
                        opacity: 0.3
                      }}>
                        📦
                      </div>
                    )}
                    <div 
                      style={{
                        ...styles.stockBadge,
                        background: stockInfo.gradient
                      }}
                    >
                      {stockInfo.status}
                    </div>
                  </div>

                  <div style={styles.productContent}>
                    <div style={styles.productHeader}>
                      <h3 style={styles.productName}>{product.productName}</h3>
                      <div style={styles.productId}>ID: {product.productID}</div>
                    </div>

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
                </div>
              );
            })}
          </div>
        )}
      </div>

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