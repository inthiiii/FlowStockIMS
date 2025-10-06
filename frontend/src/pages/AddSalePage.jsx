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

      // If selecting a product
      if (name === "product" && value) {
        const product = products.find(p => p._id === value);
        setSelectedProduct({ 
          ...product, 
          originalQuantity: product.quantity, // keeping the original stock
          displayQuantity: product.quantity   // for realtime deduction display
        });
        updatedForm.quantity = 1; // reset quantity
      }

      // If changing quantity
      if (name === "quantity" && selectedProduct) {
        const qty = Number(value);
        if (qty > selectedProduct.originalQuantity) {
          alert(`⚠️ Quantity cannot exceed available stock (${selectedProduct.originalQuantity})`);
          return prev; // do not update; if not will make the current quantity to re look when am entering the sale
        }
        updatedForm.quantity = qty;

        // Update display quantity for user feedback
        setSelectedProduct(prev => ({
          ...prev,
          displayQuantity: prev.originalQuantity - qty
        }));
      }

      // Recalculate total and payment status
      if (["quantity", "pricePerUnit", "saleType"].includes(name)) {
        updatedForm.totalAmount = calculateTotal(updatedForm.quantity, updatedForm.pricePerUnit, updatedForm.saleType);
        updatedForm.paymentStatus = determinePaymentStatus(updatedForm.saleType);
      }

      // If clearing product
      if (name === "product" && !value) setSelectedProduct(null);

      return updatedForm;
    });
  };

  // Total dynamically making it to change for the payment type
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

    // Validate against original stock
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
    container: { maxWidth: "800px", margin: "0 auto", padding: "40px 20px", backgroundColor: "#ffffff", minHeight: "100vh", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" },
    header: { textAlign: "center", marginBottom: "40px" },
    title: { color: "#023E8A", fontSize: "2.5rem", fontWeight: "600", margin: "0", marginBottom: "10px" },
    subtitle: { color: "#6c757d", fontSize: "1.1rem", margin: "0", fontWeight: "400" },
    formContainer: { backgroundColor: "#f8f9fa", padding: "40px", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", border: "1px solid #e9ecef", maxWidth: "600px", margin: "0 auto" },
    form: { display: "flex", flexDirection: "column", gap: "25px" },
    formGroup: { display: "flex", flexDirection: "column" },
    label: { color: "#023E8A", fontSize: "0.95rem", fontWeight: "600", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" },
    input: { padding: "12px 16px", border: "2px solid #e9ecef", borderRadius: "8px", fontSize: "1rem", fontFamily: "inherit", transition: "all 0.3s ease", backgroundColor: "#ffffff", outline: "none" },
    select: { padding: "12px 16px", border: "2px solid #e9ecef", borderRadius: "8px", fontSize: "1rem", fontFamily: "inherit", transition: "all 0.3s ease", backgroundColor: "#ffffff", outline: "none", cursor: "pointer" },
    formRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px" },
    button: { backgroundColor: "#023E8A", color: "#ffffff", padding: "15px 30px", border: "none", borderRadius: "8px", fontSize: "1.1rem", fontWeight: "600", cursor: "pointer", transition: "all 0.3s ease", textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "20px" },
    totalContainer: { backgroundColor: "#023E8A", color: "#ffffff", padding: "20px", borderRadius: "8px", textAlign: "center", marginTop: "10px" },
    totalLabel: { fontSize: "0.9rem", fontWeight: "400", marginBottom: "5px", opacity: "0.9" },
    totalAmount: { fontSize: "1.8rem", fontWeight: "700", margin: "0" },
    productInfo: { backgroundColor: "#d1ecf1", padding: "15px", borderRadius: "8px", border: "1px solid #d1ecf1", marginTop: "10px" },
    productInfoTitle: { color: "#0c5460", fontSize: "0.9rem", fontWeight: "600", marginBottom: "8px" },
    productInfoText: { color: "#0c5460", fontSize: "0.85rem", margin: "2px 0" },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: "center", padding: "40px 20px", color: "#6c757d", fontSize: "1.1rem" }}>
          Loading products...
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
            <select name="product" value={form.product} onChange={handleChange} required style={styles.select}>
              <option value="">Select a Product</option>
              {products.map((p) => <option key={p._id} value={p._id}>{p.productName} - {p.productID}</option>)}
            </select>
            {selectedProduct && (
              <div style={styles.productInfo}>
                <div style={styles.productInfoTitle}>Selected Product Details:</div>
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
              <label style={styles.label}>Customer Name</label>
              <input type="text" name="customerName" value={form.customerName} onChange={handleChange} required style={styles.input} placeholder="Enter customer name" />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Customer Email</label>
              <input type="email" name="customerEmail" value={form.customerEmail} onChange={handleChange} style={styles.input} placeholder="customer@email.com" />
            </div>
          </div>

          {/* Quantity & Price */}
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Quantity</label>
              <input type="number" name="quantity" value={form.quantity} onChange={handleChange} required min="1" max={selectedProduct ? selectedProduct.originalQuantity : undefined} style={styles.input} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Price Per Unit (LKR)</label>
              <input type="number" name="pricePerUnit" value={form.pricePerUnit} onChange={handleChange} required min="0" step="0.01" style={styles.input} placeholder="0.00" />
            </div>
          </div>

          {/* Sale Type */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Sale Type</label>
            <select name="saleType" value={form.saleType} onChange={handleChange} required style={styles.select}>
              <option value="">Select Sale Type</option>
              <option value="Cash">Cash (5% discount)</option>
              <option value="Card">Card (3% bank charge)</option>
              <option value="Credit">Credit (Payment Pending)</option>
            </select>
          </div>

          {/* Total Amount */}
          {form.quantity > 0 && form.pricePerUnit > 0 && form.saleType && (
            <div style={styles.totalContainer}>
              <div style={styles.totalLabel}>Total Amount</div>
              <div style={styles.totalAmount}>Rs {form.totalAmount}</div>
              <div style={{ fontSize: "0.85rem", marginTop: "5px" }}>Payment Status: <strong>{form.paymentStatus}</strong></div>
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" style={styles.button}>Add Sale</button>
        </form>
      </div>
    </div>
  );
};

export default AddSalePage;