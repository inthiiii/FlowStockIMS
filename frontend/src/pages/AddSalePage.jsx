import React, { useState, useEffect } from "react";

const AddSalePage = () => {
  const [form, setForm] = useState({ 
    product: "", 
    customerName: "", 
    customerEmail: "", 
    quantity: 1, 
    pricePerUnit: 0 
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
    
    // Prevent entering quantity greater than available stock
    if (name === "quantity" && selectedProduct && Number(value) > selectedProduct.quantity) {
      alert(`⚠️ Quantity cannot exceed available stock (${selectedProduct.quantity})`);
      return;
    }

    setForm({ ...form, [name]: value });

    // If product is selected, find the product details
    if (name === "product" && value) {
      const product = products.find(p => p._id === value);
      setSelectedProduct(product);
    } else if (name === "product" && !value) {
      setSelectedProduct(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if quantity exceeds available stock before submitting
    if (selectedProduct && form.quantity > selectedProduct.quantity) {
      alert(`⚠️ Quantity exceeds available stock (${selectedProduct.quantity}). Please enter a valid amount.`);
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
        setForm({ product: "", customerName: "", customerEmail: "", quantity: 1, pricePerUnit: 0 });
        setSelectedProduct(null);
      } else {
        alert("❌ Error adding sale. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Error adding sale. Please try again.");
    }
  };

  const calculateTotal = () => {
    return (form.quantity * form.pricePerUnit).toFixed(2);
  };

  const styles = {
    container: {
      maxWidth: "800px",
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
      maxWidth: "600px",
      margin: "0 auto",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "25px",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
    },
    label: {
      color: "#023E8A",
      fontSize: "0.95rem",
      fontWeight: "600",
      marginBottom: "8px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    input: {
      padding: "12px 16px",
      border: "2px solid #e9ecef",
      borderRadius: "8px",
      fontSize: "1rem",
      fontFamily: "inherit",
      transition: "all 0.3s ease",
      backgroundColor: "#ffffff",
      outline: "none",
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
    inputFocus: {
      borderColor: "#023E8A",
      boxShadow: "0 0 0 3px rgba(2, 62, 138, 0.1)",
    },
    formRow: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "25px",
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
      marginTop: "20px",
    },
    buttonHover: {
      backgroundColor: "#012a5c",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(2, 62, 138, 0.3)",
    },
    productInfo: {
      backgroundColor: "#d1ecf1",
      padding: "15px",
      borderRadius: "8px",
      border: "1px solid #d1ecf1",
      marginTop: "10px",
    },
    productInfoTitle: {
      color: "#0c5460",
      fontSize: "0.9rem",
      fontWeight: "600",
      marginBottom: "8px",
    },
    productInfoText: {
      color: "#0c5460",
      fontSize: "0.85rem",
      margin: "2px 0",
    },
    totalContainer: {
      backgroundColor: "#023E8A",
      color: "#ffffff",
      padding: "20px",
      borderRadius: "8px",
      textAlign: "center",
      marginTop: "10px",
    },
    totalLabel: {
      fontSize: "0.9rem",
      fontWeight: "400",
      marginBottom: "5px",
      opacity: "0.9",
    },
    totalAmount: {
      fontSize: "1.8rem",
      fontWeight: "700",
      margin: "0",
    },
    loadingContainer: {
      textAlign: "center",
      padding: "40px 20px",
      color: "#6c757d",
      fontSize: "1.1rem",
    },
    '@media (max-width: 768px)': {
      formRow: {
        gridTemplateColumns: "1fr",
      },
    },
  };

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

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Add New Sale</h1>
        <p style={styles.subtitle}>Record a new sales transaction</p>
      </div>

      <div style={styles.formContainer}>
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Product Selection */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Product</label>
            <select 
              name="product" 
              value={form.product} 
              onChange={handleChange} 
              required
              style={styles.select}
            >
              <option value="">Select a Product</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.productName} - {p.productID}
                </option>
              ))}
            </select>

            {selectedProduct && (
              <div style={styles.productInfo}>
                <div style={styles.productInfoTitle}>Selected Product Details:</div>
                <div style={styles.productInfoText}>
                  <strong>Name:</strong> {selectedProduct.productName}
                </div>
                <div style={styles.productInfoText}>
                  <strong>ID:</strong> {selectedProduct.productID}
                </div>
                <div style={styles.productInfoText}>
                  <strong>Available Quantity:</strong> {selectedProduct.quantity}
                </div>
                {selectedProduct.description && (
                  <div style={styles.productInfoText}>
                    <strong>Description:</strong> {selectedProduct.description}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Customer Info */}
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Customer Name</label>
              <input 
                type="text" 
                name="customerName" 
                value={form.customerName} 
                onChange={handleChange} 
                required
                style={styles.input}
                placeholder="Enter customer name"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Customer Email</label>
              <input 
                type="email" 
                name="customerEmail" 
                value={form.customerEmail} 
                onChange={handleChange}
                style={styles.input}
                placeholder="customer@email.com"
              />
            </div>
          </div>

          {/* Quantity & Price */}
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Quantity</label>
              <input 
                type="number" 
                name="quantity" 
                value={form.quantity} 
                onChange={handleChange} 
                required
                min="1"
                max={selectedProduct ? selectedProduct.quantity : undefined}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Price Per Unit ($)</label>
              <input 
                type="number" 
                name="pricePerUnit" 
                value={form.pricePerUnit} 
                onChange={handleChange} 
                required
                min="0"
                step="0.01"
                style={styles.input}
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Total Amount */}
          {form.quantity > 0 && form.pricePerUnit > 0 && (
            <div style={styles.totalContainer}>
              <div style={styles.totalLabel}>Total Amount</div>
              <div style={styles.totalAmount}>${calculateTotal()}</div>
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            style={styles.button}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = styles.buttonHover.backgroundColor;
              e.target.style.transform = styles.buttonHover.transform;
              e.target.style.boxShadow = styles.buttonHover.boxShadow;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = styles.button.backgroundColor;
              e.target.style.transform = "none";
              e.target.style.boxShadow = "none";
            }}
          >
            Add Sale
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSalePage;