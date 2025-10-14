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
  const [animateIn, setAnimateIn] = useState(false);

  const carriers = ["DHL", "FedEx", "UPS", "Aramex", "BlueDart"];

  useEffect(() => {
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

  useEffect(() => {
    if (!fetchLoading) {
      setTimeout(() => setAnimateIn(true), 100);
    }
  }, [fetchLoading]);

  const handleProductChange = (productId, quantity) => {
    setSelectedProducts((prev) => {
      const exists = prev.find((p) => p.product === productId);
      if (exists) {
        const numQuantity = Number(quantity);
        if (numQuantity <= 0) {
          return prev.filter((p) => p.product !== productId);
        }
        return prev.map((p) =>
          p.product === productId ? { ...p, quantity: numQuantity } : p
        );
      } else if (Number(quantity) > 0) {
        return [...prev, { product: productId, quantity: Number(quantity) }];
      }
      return prev;
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
      setError("Please select a carrier and at least one product.");
      return;
    }

    const shipmentId = "SHIP-" + Date.now();
    setLoading(true);
    setError("");

    try {
      await axios.post("http://localhost:3000/api/shipments", {
        shipmentId,
        carrier,
        products: selectedProducts,
      });
      setSuccess(true);
      setSelectedProducts([]);
      setCarrier("");
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      console.error(err);
      setError("Error creating shipment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getTotalItems = () => {
    return selectedProducts.reduce((total, p) => total + (p.quantity || 0), 0);
  };

  const getSelectedProductDetails = (productId) => {
    return products.find(p => p._id === productId);
  };

  // --- UNIFORM STYLES ---
  const styles = {
    container: {
      maxWidth: "1600px", margin: "0 auto", padding: "50px 30px",
      background: "linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%)",
      minHeight: "100vh", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
    header: {
      textAlign: "center", marginBottom: "50px", animation: "fadeInDown 0.6s ease-out"
    },
    title: {
      color: "#023E8A", fontSize: "3rem", fontWeight: "700", margin: "0",
      marginBottom: "12px", letterSpacing: "-1px", textShadow: "0 2px 4px rgba(2, 62, 138, 0.1)"
    },
    subtitle: {
      color: "#64748b", fontSize: "1.15rem", margin: "0", fontWeight: "400", letterSpacing: "0.3px"
    },
    formLayout: {
      display: "grid", gridTemplateColumns: "2fr 1fr", gap: "30px", alignItems: "start",
    },
    formContainer: {
      backgroundColor: "#ffffff", padding: "40px", borderRadius: "20px",
      border: "1px solid rgba(226, 232, 240, 0.8)", boxShadow: "0 10px 40px rgba(0, 0, 0, 0.06)",
      opacity: 0, transform: "translateY(20px)", transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
    },
    animateIn: { opacity: 1, transform: "translateY(0)" },
    form: { display: "flex", flexDirection: "column", gap: "35px" },
    sectionTitle: {
      color: "#023E8A", fontSize: "1.5rem", fontWeight: "600",
      marginBottom: "20px", paddingBottom: "15px", borderBottom: "2px solid #e2e8f0",
    },
    formGroup: { display: "flex", flexDirection: "column", gap: "8px" },
    label: {
      fontSize: "0.875rem", fontWeight: "600", color: "#1e293b",
      letterSpacing: "0.3px", display: "flex", alignItems: "center", gap: "6px"
    },
    select: {
      padding: "14px 40px 14px 18px", border: "2px solid #e2e8f0", borderRadius: "10px",
      fontSize: "1rem", fontFamily: "inherit", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      backgroundColor: "#ffffff", outline: "none", cursor: "pointer",
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)", appearance: "none",
      backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23023E8A' d='M6 9L1 4h10z'/%3E%3C/svg%3E\")",
      backgroundRepeat: "no-repeat", backgroundPosition: "right 16px center"
    },
    productsGrid: {
      display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: "20px", maxHeight: "500px", overflowY: "auto", padding: "10px",
    },
    productCard: {
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)", padding: "20px",
      borderRadius: "16px", border: "1px solid #e2e8f0",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)", transition: "all 0.3s ease",
    },
    productCardSelected: {
      borderColor: "#023E8A", boxShadow: "0 0 0 3px rgba(2, 62, 138, 0.1), 0 8px 16px rgba(0, 0, 0, 0.08)",
    },
    productHeader: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", cursor: "pointer" },
    checkbox: { width: "20px", height: "20px", accentColor: "#023E8A" },
    productName: { fontSize: "1.1rem", fontWeight: "600", color: "#023E8A" },
    productInfo: { fontSize: "0.9rem", color: "#64748b", lineHeight: "1.5" },
    quantityContainer: { display: "flex", alignItems: "center", gap: "10px", marginTop: "15px" },
    quantityInput: {
      width: "80px", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "10px",
      fontSize: "1rem", textAlign: "center",
    },
    summaryContainer: {
      position: "sticky", top: "40px", backgroundColor: "#ffffff", padding: "30px",
      borderRadius: "20px", border: "1px solid rgba(226, 232, 240, 0.8)",
      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.06)",
      opacity: 0, transform: "translateY(20px)",
      transition: "opacity 0.6s ease-out 0.2s, transform 0.6s ease-out 0.2s",
    },
    summaryCard: {
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)", padding: "20px",
      borderRadius: "16px", border: "1px solid #e2e8f0", textAlign: "center",
    },
    summaryValue: { fontSize: "2.2rem", color: "#023E8A", fontWeight: "700" },
    summaryLabel: { fontSize: "0.875rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" },
    selectedProductsList: { listStyle: "none", padding: "0", margin: "0", maxHeight: "200px", overflowY: "auto" },
    selectedProductItem: {
      display: "flex", justifyContent: "space-between", fontSize: "1rem", color: "#334155",
      padding: "12px 0", borderBottom: "1px solid #e2e8f0",
    },
    button: {
      background: "linear-gradient(135deg, #023E8A 0%, #0353b8 100%)", color: "#fff",
      padding: "15px 30px", border: "none", borderRadius: "10px", fontSize: "1.1rem",
      fontWeight: "600", cursor: "pointer", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      boxShadow: "0 4px 12px rgba(2, 62, 138, 0.3)", display: "flex",
      alignItems: "center", justifyContent: "center", gap: "10px", width: "100%", marginTop: "20px",
    },
    buttonDisabled: {
      background: "#94a3b8", boxShadow: "none", cursor: "not-allowed", transform: "none"
    },
    message: {
      padding: "15px 20px", borderRadius: "10px", fontSize: "1rem",
      fontWeight: "500", textAlign: "center", marginBottom: "20px",
      animation: "fadeInUp 0.5s ease-out",
    },
    errorMessage: { backgroundColor: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" },
    successMessage: { backgroundColor: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0" },
    loadingContainer: {
      textAlign: "center", padding: "80px 20px",
    },
    initialSpinner: {
      height: "60px", width: "60px", margin: "0 auto 20px auto",
      border: "6px solid #e2e8f0", borderTopColor: "#023E8A",
      borderRadius: "50%", animation: "spin 1.2s linear infinite",
    },
    buttonSpinner: {
      height: "20px", width: "20px",
      border: "3px solid rgba(255,255,255,0.4)", borderTopColor: "#fff",
      borderRadius: "50%", animation: "spin 1s linear infinite",
    },
    loadingText: {
      color: "#64748b", fontSize: "1.2rem", fontWeight: "500"
    },
  };

  const styleSheet = `
    @media (max-width: 1024px) {
      .form-layout {
        grid-template-columns: 1fr;
      }
    }
    @keyframes fadeInDown {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .products-grid::-webkit-scrollbar { width: 8px; }
    .products-grid::-webkit-scrollbar-track { background: #f1f5f9; }
    .products-grid::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
    .products-grid::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
    
    input:focus, select:focus, input:focus-visible, select:focus-visible {
      border-color: #023E8A !important;
      box-shadow: 0 0 0 3px rgba(2, 62, 138, 0.1) !important;
      outline: none;
    }
    
    button:not(:disabled):hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(2, 62, 138, 0.4);
    }
    
    button:not(:disabled):active {
      transform: translateY(0);
    }
  `;

  if (fetchLoading) {
    return (
      <div style={styles.container}>
        <style>{styleSheet}</style>
        <div style={styles.loadingContainer}>
          <div style={styles.initialSpinner}></div>
          <div style={styles.loadingText}>Loading Products...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{styleSheet}</style>
      <div style={styles.header}>
        <h1 style={styles.title}>Create New Shipment</h1>
        <p style={styles.subtitle}>Select products and a carrier to generate a new shipment</p>
      </div>

      <div className="form-layout" style={styles.formLayout}>
        <div style={{ ...styles.formContainer, ...(animateIn && styles.animateIn) }}>
          <form onSubmit={handleSubmit} style={styles.form}>
            {error && <div style={{ ...styles.message, ...styles.errorMessage }}>{error}</div>}
            {success && <div style={{ ...styles.message, ...styles.successMessage }}>Shipment created successfully!</div>}
            
            <div style={styles.formGroup}>
              <h3 style={styles.sectionTitle}>1. Shipping Details</h3>
              <label htmlFor="carrier" style={styles.label}>Shipping Carrier</label>
              <select id="carrier" value={carrier} onChange={(e) => setCarrier(e.target.value)} style={styles.select} required>
                <option value="">-- Select a Carrier --</option>
                {carriers.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div style={styles.formGroup}>
              <h3 style={styles.sectionTitle}>2. Select Products</h3>
              <div className="products-grid" style={styles.productsGrid}>
                {products.map((product) => {
                  const isSelected = selectedProducts.some(sp => sp.product === product._id);
                  const selectedProduct = selectedProducts.find(sp => sp.product === product._id);
                  return (
                    <div key={product._id} style={{ ...styles.productCard, ...(isSelected && styles.productCardSelected) }}>
                      <label htmlFor={product._id} style={styles.productHeader}>
                        <input type="checkbox" id={product._id} checked={isSelected} onChange={() => handleProductToggle(product._id)} style={styles.checkbox} />
                        <span style={styles.productName}>{product.productName}</span>
                      </label>
                      <div style={styles.productInfo}>
                        <strong>ID:</strong> {product.productID}<br />
                        <strong>Available:</strong> {product.quantity} units
                      </div>
                      {isSelected && (
                        <div style={styles.quantityContainer}>
                          <label style={styles.label}>Quantity:</label>
                          <input type="number" min="1" max={product.quantity} value={selectedProduct?.quantity || 1} onChange={(e) => handleProductChange(product._id, e.target.value)} style={styles.quantityInput} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </form>
        </div>

        <div style={{ ...styles.summaryContainer, ...(animateIn && styles.animateIn) }}>
          <h3 style={styles.sectionTitle}>Summary</h3>
          <div style={{ display: 'grid', gap: '20px' }}>
            <div style={styles.summaryCard}>
              <div style={styles.summaryValue}>{selectedProducts.length}</div>
              <div style={styles.summaryLabel}>Unique Products</div>
            </div>
            <div style={styles.summaryCard}>
              <div style={styles.summaryValue}>{getTotalItems()}</div>
              <div style={styles.summaryLabel}>Total Items</div>
            </div>
            <div style={styles.summaryCard}>
              <div style={styles.summaryLabel}>Carrier</div>
              <div style={{ ...styles.summaryValue, fontSize: "1.8rem", marginTop: "5px" }}>{carrier || "..."}</div>
            </div>
          </div>
          
          <h4 style={{ ...styles.sectionTitle, fontSize: "1.1rem", marginTop: "30px", marginBottom: "15px" }}>Selected Items</h4>
          <ul style={styles.selectedProductsList}>
            {selectedProducts.length > 0 ? selectedProducts.map((sp) => {
              const details = getSelectedProductDetails(sp.product);
              return (
                <li key={sp.product} style={styles.selectedProductItem}>
                  <span>{details?.productName}</span>
                  <strong>x {sp.quantity}</strong>
                </li>
              );
            }) : <li style={{ ...styles.selectedProductItem, border: "none", color: "#94a3b8" }}>No products selected</li>}
          </ul>
          
          <button type="submit" onClick={handleSubmit} disabled={loading || !carrier || selectedProducts.length === 0} style={{ ...styles.button, ...((loading || !carrier || selectedProducts.length === 0) && styles.buttonDisabled) }}>
            {loading && <div style={styles.buttonSpinner}></div>}
            {loading ? "Creating..." : "Create Shipment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateShipment;

