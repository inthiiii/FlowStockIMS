import React, { useState, useEffect } from "react";

const AddSalePage = () => {
  const [form, setForm] = useState({ product: "", customerName: "", customerEmail: "", quantity: 1, pricePerUnit: 0 });
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:3000/api/sales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    alert("Sale Added!");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ color: "#023E8A" }}>Add Sale</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", width: "300px" }}>
        <label>Product:</label>
        <select name="product" value={form.product} onChange={handleChange} required>
          <option value="">Select Product</option>
          {products.map((p) => (
            <option key={p._id} value={p._id}>{p.productName}</option>
          ))}
        </select>

        <label>Customer Name:</label>
        <input type="text" name="customerName" value={form.customerName} onChange={handleChange} required />

        <label>Customer Email:</label>
        <input type="email" name="customerEmail" value={form.customerEmail} onChange={handleChange} />

        <label>Quantity:</label>
        <input type="number" name="quantity" value={form.quantity} onChange={handleChange} required />

        <label>Price Per Unit:</label>
        <input type="number" name="pricePerUnit" value={form.pricePerUnit} onChange={handleChange} required />

        <button type="submit" style={{ marginTop: "10px", background: "#023E8A", color: "#fff", padding: "10px", border: "none", borderRadius: "5px" }}>
          Add Sale
        </button>
      </form>
    </div>
  );
};

export default AddSalePage;