import React, { useState, useEffect } from "react";

const AddSalePage = () => {
  const [form, setForm] = useState({ 
    product: "", 
    customerName: "", 
    customerEmail: "", 
    quantity: 1, 
    pricePerUnit: 0,
    saleType: "", 
    totalAmount: 0,
    paymentStatus: "", 
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm(prev => {
      const updatedForm = { ...prev, [name]: value };

      if (name === "product" && value) {
        const product = products.find(p => p._id === value);
        setSelectedProduct({ 
          ...product, 
          originalQuantity: product.quantity,
          displayQuantity: product.quantity
        });
        updatedForm.quantity = 1;
      }

      if (name === "quantity" && selectedProduct) {
        const qty = Number(value);
        if (qty > selectedProduct.originalQuantity) {
          alert(`⚠️ Quantity cannot exceed available stock (${selectedProduct.originalQuantity})`);
          return prev;
        }
        updatedForm.quantity = qty;

        setSelectedProduct(prev => ({
          ...prev,
          displayQuantity: prev.originalQuantity - qty
        }));
      }

      if (["quantity", "pricePerUnit", "saleType"].includes(name)) {
        updatedForm.totalAmount = calculateTotal(updatedForm.quantity, updatedForm.pricePerUnit, updatedForm.saleType);
        updatedForm.paymentStatus = determinePaymentStatus(updatedForm.saleType);
      }

      if (name === "product" && !value) setSelectedProduct(null);

      return updatedForm;
    });
  };

  const calculateTotal = (quantity, price, saleType) => {
    let total = quantity * price;
    if (saleType === "Cash") total *= 0.95;
    if (saleType === "Card") total *= 1.03;
    return Number(total.toFixed(2));
  };
  
  const determinePaymentStatus = (saleType) => {
    if (saleType === "Cash" || saleType === "Card") return "Paid";
    if (saleType === "Credit") return "Pending";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.saleType) {
      alert("❌ Please select a sale type!");
      return;
    }

    if (selectedProduct && form.quantity > selectedProduct.originalQuantity) {
      alert(`⚠️ Quantity exceeds available stock (${selectedProduct.originalQuantity}). Please enter a valid amount.`);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      
      if (response.ok) {
        alert("✅ Sale Added Successfully!");
        setForm({ product: "", customerName: "", customerEmail: "", quantity: 1, pricePerUnit: 0, saleType: "", totalAmount: 0, paymentStatus: "" });
        setSelectedProduct(null);
      } else {
        alert("❌ Error adding sale. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Error adding sale. Please try again.");
    }
  };

  const styles = {
    container: { 
      maxWidth: "1000px", 
      margin: "0 auto", 
      padding: "60px 30px", 
      background: "linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%)", 
      minHeight: "100vh", 
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
    },
    header: { 
      textAlign: "center", 
      marginBottom: "50px",
      animation: "fadeInDown 0.6s ease-out"
    },
    title: { 
      color: "#023E8A", 
      fontSize: "3rem", 
      fontWeight: "700", 
      margin: "0", 
      marginBottom: "12px",
      letterSpacing: "-1px",
      textShadow: "0 2px 4px rgba(2, 62, 138, 0.1)"
    },
    subtitle: { 
      color: "#64748b", 
      fontSize: "1.15rem", 
      margin: "0", 
      fontWeight: "400",
      letterSpacing: "0.3px"
    },
    formContainer: { 
      backgroundColor: "#ffffff", 
      padding: "50px", 
      borderRadius: "20px", 
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08), 0 0 1px rgba(0, 0, 0, 0.1)", 
      border: "1px solid rgba(226, 232, 240, 0.8)", 
      maxWidth: "700px", 
      margin: "0 auto",
      animation: "fadeInUp 0.7s ease-out",
      backdropFilter: "blur(10px)"
    },
    form: { 
      display: "flex", 
      flexDirection: "column", 
      gap: "28px" 
    },
    formGroup: { 
      display: "flex", 
      flexDirection: "column",
      position: "relative"
    },
    label: { 
      color: "#1e293b", 
      fontSize: "0.875rem", 
      fontWeight: "600", 
      marginBottom: "10px", 
      letterSpacing: "0.3px",
      display: "flex",
      alignItems: "center",
      gap: "6px"
    },
    input: { 
      padding: "14px 18px", 
      border: "2px solid #e2e8f0", 
      borderRadius: "10px", 
      fontSize: "1rem", 
      fontFamily: "inherit", 
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", 
      backgroundColor: "#ffffff", 
      outline: "none",
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)"
    },
    inputFocus: {
      border: "2px solid #023E8A",
      boxShadow: "0 0 0 3px rgba(2, 62, 138, 0.1), 0 2px 4px rgba(0, 0, 0, 0.05)"
    },
    select: { 
      padding: "14px 18px", 
      border: "2px solid #e2e8f0", 
      borderRadius: "10px", 
      fontSize: "1rem", 
      fontFamily: "inherit", 
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", 
      backgroundColor: "#ffffff", 
      outline: "none", 
      cursor: "pointer",
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
      appearance: "none",
      backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23023E8A' d='M6 9L1 4h10z'/%3E%3C/svg%3E\")",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 16px center",
      paddingRight: "40px"
    },
    formRow: { 
      display: "grid", 
      gridTemplateColumns: "1fr 1fr", 
      gap: "28px" 
    },
    button: { 
      background: "linear-gradient(135deg, #023E8A 0%, #0353b8 100%)", 
      color: "#ffffff", 
      padding: "16px 32px", 
      border: "none", 
      borderRadius: "12px", 
      fontSize: "1.05rem", 
      fontWeight: "600", 
      cursor: "pointer", 
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", 
      letterSpacing: "0.5px", 
      marginTop: "20px",
      boxShadow: "0 4px 12px rgba(2, 62, 138, 0.3)",
      position: "relative",
      overflow: "hidden"
    },
    buttonHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 8px 20px rgba(2, 62, 138, 0.4)"
    },
    totalContainer: { 
      background: "linear-gradient(135deg, #023E8A 0%, #0353b8 100%)", 
      color: "#ffffff", 
      padding: "28px", 
      borderRadius: "16px", 
      textAlign: "center", 
      marginTop: "10px",
      boxShadow: "0 8px 24px rgba(2, 62, 138, 0.25)",
      animation: "scaleIn 0.4s ease-out",
      border: "1px solid rgba(255, 255, 255, 0.1)"
    },
    totalLabel: { 
      fontSize: "0.95rem", 
      fontWeight: "500", 
      marginBottom: "8px", 
      opacity: "0.95",
      letterSpacing: "0.5px",
      textTransform: "uppercase"
    },
    totalAmount: { 
      fontSize: "2.5rem", 
      fontWeight: "800", 
      margin: "8px 0",
      letterSpacing: "-1px",
      textShadow: "0 2px 8px rgba(0, 0, 0, 0.2)"
    },
    productInfo: { 
      background: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)", 
      padding: "20px", 
      borderRadius: "12px", 
      border: "1px solid #7dd3fc", 
      marginTop: "12px",
      boxShadow: "0 2px 8px rgba(125, 211, 252, 0.2)",
      animation: "slideIn 0.4s ease-out"
    },
    productInfoTitle: { 
      color: "#0c5460", 
      fontSize: "0.95rem", 
      fontWeight: "700", 
      marginBottom: "12px",
      letterSpacing: "0.3px",
      textTransform: "uppercase"
    },
    productInfoText: { 
      color: "#0c5460", 
      fontSize: "0.9rem", 
      margin: "6px 0",
      lineHeight: "1.6"
    },
    loadingContainer: {
      textAlign: "center", 
      padding: "60px 20px", 
      color: "#64748b", 
      fontSize: "1.1rem",
      animation: "pulse 2s ease-in-out infinite"
    },
    badge: {
      display: "inline-block",
      padding: "4px 10px",
      borderRadius: "6px",
      fontSize: "0.8rem",
      fontWeight: "600",
      marginTop: "8px",
      backgroundColor: "rgba(255, 255, 255, 0.2)"
    }
  };

  // Add CSS animations
  const styleSheet = `
    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(-10px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }
    
    input:focus, select:focus {
      border-color: #023E8A !important;
      box-shadow: 0 0 0 3px rgba(2, 62, 138, 0.1), 0 2px 4px rgba(0, 0, 0, 0.05) !important;
    }
    
    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(2, 62, 138, 0.4);
    }
    
    button:active {
      transform: translateY(0);
    }
    
    select:hover {
      border-color: #023E8A;
    }
    
    input::placeholder {
      color: #94a3b8;
    }
  `;

  if (loading) {
    return (
      <div style={styles.container}>
        <style>{styleSheet}</style>
        <div style={styles.loadingContainer}>
          <div style={{ fontSize: "2rem", marginBottom: "16px" }}>⏳</div>
          Loading products...
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{styleSheet}</style>
      <div style={styles.header}>
        <h1 style={styles.title}>Add New Sale</h1>
        <p style={styles.subtitle}>Record a new sales transaction</p>
      </div>

      <div style={styles.formContainer}>
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Product Selection */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <span>📦</span> Product
            </label>
            <select name="product" value={form.product} onChange={handleChange} required style={styles.select}>
              <option value="">Select a Product</option>
              {products.map((p) => <option key={p._id} value={p._id}>{p.productName} - {p.productID}</option>)}
            </select>
            {selectedProduct && (
              <div style={styles.productInfo}>
                <div style={styles.productInfoTitle}>Selected Product Details</div>
                <div style={styles.productInfoText}><strong>Name:</strong> {selectedProduct.productName}</div>
                <div style={styles.productInfoText}><strong>ID:</strong> {selectedProduct.productID}</div>
                <div style={styles.productInfoText}><strong>Available Quantity:</strong> {selectedProduct.displayQuantity}</div>
                {selectedProduct.description && <div style={styles.productInfoText}><strong>Description:</strong> {selectedProduct.description}</div>}
              </div>
            )}
          </div>

          {/* Customer Info */}
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <span>👤</span> Customer Name
              </label>
              <input type="text" name="customerName" value={form.customerName} onChange={handleChange} required style={styles.input} placeholder="Enter customer name" />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <span>📧</span> Customer Email
              </label>
              <input type="email" name="customerEmail" value={form.customerEmail} onChange={handleChange} style={styles.input} placeholder="customer@email.com" />
            </div>
          </div>

          {/* Quantity & Price */}
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <span>🔢</span> Quantity
              </label>
              <input type="number" name="quantity" value={form.quantity} onChange={handleChange} required min="1" max={selectedProduct ? selectedProduct.originalQuantity : undefined} style={styles.input} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <span>💰</span> Price Per Unit (LKR)
              </label>
              <input type="number" name="pricePerUnit" value={form.pricePerUnit} onChange={handleChange} required min="0" step="0.01" style={styles.input} placeholder="0.00" />
            </div>
          </div>

          {/* Sale Type */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <span>💳</span> Sale Type
            </label>
            <select name="saleType" value={form.saleType} onChange={handleChange} required style={styles.select}>
              <option value="">Select Sale Type</option>
              <option value="Cash">💵 Cash (5% discount)</option>
              <option value="Card">💳 Card (3% bank charge)</option>
              <option value="Credit">📋 Credit (Payment Pending)</option>
            </select>
          </div>

          {/* Total Amount */}
          {form.quantity > 0 && form.pricePerUnit > 0 && form.saleType && (
            <div style={styles.totalContainer}>
              <div style={styles.totalLabel}>Total Amount</div>
              <div style={styles.totalAmount}>Rs {form.totalAmount.toLocaleString()}</div>
              <div style={styles.badge}>
                Payment Status: <strong>{form.paymentStatus}</strong>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" style={styles.button}>
            ✓ Add Sale
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSalePage;