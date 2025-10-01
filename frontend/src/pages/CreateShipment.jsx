// src/pages/CreateShipment.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateShipment = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [carrier, setCarrier] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Hardcoded carriers
  const carriers = ["DHL", "FedEx", "UPS", "Aramex", "BlueDart"];

  useEffect(() => {
    // Fetch products from API
    const fetchProducts = async () => {
      try {
        setFetchLoading(true);
        const { data } = await axios.get("http://localhost:3000/api/products");
        setProducts(data);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Failed to load products");
      } finally {
        setFetchLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleProductChange = (productId, quantity) => {
    setSelectedProducts((prev) => {
      const exists = prev.find((p) => p.product === productId);
      if (exists) {
        if (quantity === 0 || quantity === "") {
          return prev.filter((p) => p.product !== productId);
        }
        return prev.map((p) =>
          p.product === productId ? { ...p, quantity: Number(quantity) } : p
        );
      } else {
        if (quantity > 0) {
          return [...prev, { product: productId, quantity: Number(quantity) }];
        }
        return prev;
      }
    });
  };

  const handleProductToggle = (productId) => {
    const exists = selectedProducts.find((p) => p.product === productId);
    if (exists) {
      setSelectedProducts(prev => prev.filter((p) => p.product !== productId));
    } else {
      setSelectedProducts(prev => [...prev, { product: productId, quantity: 1 }]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!carrier || selectedProducts.length === 0) {
      setError("Please select carrier and at least one product");
      return;
    }

    setLoading(true);
    setError("");
    const shipmentId = "SHIP-" + Date.now();

    try {
      await axios.post("http://localhost:3000/api/shipments", {
        shipmentId,
        carrier,
        products: selectedProducts,
      });
      setSuccess(true);
      setSelectedProducts([]);
      setCarrier("");
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setError("Error creating shipment. Please try again.");
    }
    setLoading(false);
  };

  const getTotalItems = () => {
    return selectedProducts.reduce((total, product) => total + product.quantity, 0);
  };

  const getSelectedProductDetails = (productId) => {
    return products.find(p => p._id === productId);
  };

  const styles = {
    container: {
      maxWidth: "1000px",
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
    formContainer: {
      backgroundColor: "#f8f9fa",
      padding: "40px",
      borderRadius: "12px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      border: "1px solid #e9ecef",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "30px",
    },
    formSection: {
      backgroundColor: "#ffffff",
      padding: "25px",
      borderRadius: "10px",
      border: "1px solid #e9ecef",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
    },
    sectionTitle: {
      color: "#023E8A",
      fontSize: "1.3rem",
      fontWeight: "600",
      marginBottom: "20px",
      paddingBottom: "10px",
      borderBottom: "2px solid #e9ecef",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    label: {
      color: "#023E8A",
      fontSize: "1rem",
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    select: {
      padding: "12px 16px",
      border: "2px solid #e9ecef",
      borderRadius: "8px",
      fontSize: "1rem",
      fontFamily: "inherit",
      transition: "all 0.3s ease",
      backgroundColor: "#ffffff",
      outline: "none",
      cursor: "pointer",
    },
    selectFocus: {
      borderColor: "#023E8A",
      boxShadow: "0 0 0 3px rgba(2, 62, 138, 0.1)",
    },
    productsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: "15px",
      marginTop: "15px",
    },
    productCard: {
      backgroundColor: "#f8f9fa",
      padding: "15px",
      borderRadius: "8px",
      border: "1px solid #e9ecef",
      transition: "all 0.3s ease",
    },
    productCardSelected: {
      backgroundColor: "#e7f3ff",
      borderColor: "#023E8A",
      boxShadow: "0 2px 8px rgba(2, 62, 138, 0.1)",
    },
    productHeader: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "10px",
    },
    checkbox: {
      width: "18px",
      height: "18px",
      cursor: "pointer",
    },
    productName: {
      fontSize: "1rem",
      fontWeight: "600",
      color: "#023E8A",
      flex: "1",
    },
    productInfo: {
      fontSize: "0.9rem",
      color: "#6c757d",
      marginBottom: "10px",
    },
    quantityContainer: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    quantityLabel: {
      fontSize: "0.9rem",
      fontWeight: "500",
      color: "#495057",
    },
    quantityInput: {
      width: "80px",
      padding: "8px",
      border: "1px solid #e9ecef",
      borderRadius: "4px",
      fontSize: "0.9rem",
      textAlign: "center",
    },
    summarySection: {
      backgroundColor: "#ffffff",
      padding: "25px",
      borderRadius: "10px",
      border: "1px solid #e9ecef",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
    },
    summaryGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: "20px",
      marginBottom: "20px",
    },
    summaryCard: {
      textAlign: "center",
      padding: "15px",
      backgroundColor: "#f8f9fa",
      borderRadius: "8px",
      border: "1px solid #e9ecef",
    },
    summaryNumber: {
      fontSize: "2rem",
      fontWeight: "700",
      color: "#023E8A",
      margin: "0 0 5px 0",
    },
    summaryLabel: {
      fontSize: "0.9rem",
      color: "#6c757d",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      margin: "0",
    },
    selectedProductsList: {
      backgroundColor: "#e7f3ff",
      padding: "15px",
      borderRadius: "8px",
      border: "1px solid #b3d9ff",
      marginTop: "15px",
    },
    selectedProductsTitle: {
      fontSize: "1rem",
      fontWeight: "600",
      color: "#023E8A",
      marginBottom: "10px",
    },
    selectedProductItem: {
      fontSize: "0.9rem",
      color: "#495057",
      marginBottom: "5px",
      padding: "5px 0",
      borderBottom: "1px solid #b3d9ff",
    },
    button: {
      backgroundColor: "#023E8A",
      color: "#ffffff",
      padding: "15px 30px",
      border: "none",
      borderRadius: "8px",
      fontSize: "1.1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      alignSelf: "center",
      minWidth: "200px",
    },
    buttonHover: {
      backgroundColor: "#012a5c",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(2, 62, 138, 0.3)",
    },
    buttonDisabled: {
      backgroundColor: "#6c757d",
      cursor: "not-allowed",
      transform: "none",
      boxShadow: "none",
    },
    loadingSpinner: {
      display: "inline-block",
      width: "20px",
      height: "20px",
      border: "2px solid #ffffff",
      borderTop: "2px solid transparent",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      marginRight: "10px",
    },
    errorMessage: {
      backgroundColor: "#f8d7da",
      color: "#721c24",
      padding: "12px 16px",
      borderRadius: "8px",
      border: "1px solid #f5c6cb",
      fontSize: "0.95rem",
      fontWeight: "500",
      marginBottom: "20px",
      textAlign: "center",
    },
    successMessage: {
      backgroundColor: "#d1edff",
      color: "#0c5460",
      padding: "12px 16px",
      borderRadius: "8px",
      border: "1px solid #bee5eb",
      fontSize: "0.95rem",
      fontWeight: "500",
      marginBottom: "20px",
      textAlign: "center",
    },
    loadingContainer: {
      textAlign: "center",
      padding: "60px 20px",
      color: "#6c757d",
    },
    loadingText: {
      fontSize: "1.2rem",
      fontWeight: "500",
    },
    noProducts: {
      textAlign: "center",
      padding: "40px 20px",
      color: "#6c757d",
      fontSize: "1rem",
    },
    shipmentIdPreview: {
      backgroundColor: "#f8f9fa",
      padding: "10px 15px",
      borderRadius: "6px",
      border: "1px solid #e9ecef",
      fontSize: "0.9rem",
      color: "#495057",
      fontFamily: "monospace",
      marginTop: "10px",
    },
  };

  if (fetchLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={{...styles.loadingSpinner, width: "50px", height: "50px", border: "4px solid #f3f3f3", borderTop: "4px solid #023E8A", margin: "0 auto 20px auto"}}></div>
          <div style={styles.loadingText}>Loading products...</div>
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
      <div style={styles.header}>
        <h1 style={styles.title}>Create Shipment</h1>
        <p style={styles.subtitle}>Prepare products for shipping with selected carrier</p>
      </div>

      <div style={styles.formContainer}>
        {error && (
          <div style={styles.errorMessage}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {success && (
          <div style={styles.successMessage}>
            <strong>Success:</strong> Shipment created successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Carrier Selection */}
          <div style={styles.formSection}>
            <h3 style={styles.sectionTitle}>Shipping Information</h3>
            <div style={styles.formGroup}>
              <label style={styles.label}>Select Carrier</label>
              <select
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                style={styles.select}
                onFocus={(e) => {
                  e.target.style.borderColor = styles.selectFocus.borderColor;
                  e.target.style.boxShadow = styles.selectFocus.boxShadow;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = styles.select.borderColor;
                  e.target.style.boxShadow = "none";
                }}
                required
              >
                <option value="">Choose a shipping carrier</option>
                {carriers.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div style={styles.shipmentIdPreview}>
                Shipment ID will be: SHIP-{Date.now()}
              </div>
            </div>
          </div>

          {/* Product Selection */}
          <div style={styles.formSection}>
            <h3 style={styles.sectionTitle}>Select Products</h3>
            {products.length === 0 ? (
              <div style={styles.noProducts}>
                No products available for shipment
              </div>
            ) : (
              <div style={styles.productsGrid}>
                {products.map((product) => {
                  const isSelected = selectedProducts.some(sp => sp.product === product._id);
                  const selectedProduct = selectedProducts.find(sp => sp.product === product._id);
                  
                  return (
                    <div
                      key={product._id}
                      style={{
                        ...styles.productCard,
                        ...(isSelected ? styles.productCardSelected : {})
                      }}
                    >
                      <div style={styles.productHeader}>
                        <input
                          type="checkbox"
                          id={product._id}
                          checked={isSelected}
                          onChange={() => handleProductToggle(product._id)}
                          style={styles.checkbox}
                        />
                        <label htmlFor={product._id} style={styles.productName}>
                          {product.productName}
                        </label>
                      </div>
                      
                      <div style={styles.productInfo}>
                        <div><strong>ID:</strong> {product.productID}</div>
                        <div><strong>Available:</strong> {product.quantity} units</div>
                        <div><strong>Model:</strong> {product.modelName}</div>
                      </div>

                      {isSelected && (
                        <div style={styles.quantityContainer}>
                          <span style={styles.quantityLabel}>Quantity:</span>
                          <input
                            type="number"
                            min="1"
                            max={product.quantity}
                            value={selectedProduct?.quantity || 1}
                            onChange={(e) => handleProductChange(product._id, e.target.value)}
                            style={styles.quantityInput}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Summary */}
          {selectedProducts.length > 0 && (
            <div style={styles.summarySection}>
              <h3 style={styles.sectionTitle}>Shipment Summary</h3>
              
              <div style={styles.summaryGrid}>
                <div style={styles.summaryCard}>
                  <div style={styles.summaryNumber}>{selectedProducts.length}</div>
                  <div style={styles.summaryLabel}>Products</div>
                </div>
                <div style={styles.summaryCard}>
                  <div style={styles.summaryNumber}>{getTotalItems()}</div>
                  <div style={styles.summaryLabel}>Total Items</div>
                </div>
                <div style={styles.summaryCard}>
                  <div style={styles.summaryNumber}>{carrier || "---"}</div>
                  <div style={styles.summaryLabel}>Carrier</div>
                </div>
              </div>

              <div style={styles.selectedProductsList}>
                <div style={styles.selectedProductsTitle}>Selected Products:</div>
                {selectedProducts.map((sp) => {
                  const productDetail = getSelectedProductDetails(sp.product);
                  return (
                    <div key={sp.product} style={styles.selectedProductItem}>
                      <strong>{productDetail?.productName}</strong> - {sp.quantity} units
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !carrier || selectedProducts.length === 0}
            style={{
              ...styles.button,
              ...(loading || !carrier || selectedProducts.length === 0 ? styles.buttonDisabled : {})
            }}
            onMouseEnter={(e) => {
              if (!loading && carrier && selectedProducts.length > 0) {
                e.target.style.backgroundColor = styles.buttonHover.backgroundColor;
                e.target.style.transform = styles.buttonHover.transform;
                e.target.style.boxShadow = styles.buttonHover.boxShadow;
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = styles.button.backgroundColor;
                e.target.style.transform = "none";
                e.target.style.boxShadow = "none";
              }
            }}
          >
            {loading && <span style={styles.loadingSpinner}></span>}
            {loading ? "Creating Shipment..." : "Create Shipment"}
          </button>
        </form>
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

export default CreateShipment;