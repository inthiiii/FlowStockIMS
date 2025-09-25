import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ReceiptPage = () => {
  const { id } = useParams();
  const [sale, setSale] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/sales/${id}`)
      .then((res) => res.json())
      .then((data) => setSale(data));
  }, [id]);

  if (!sale) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px", maxWidth: "500px", margin: "auto" }}>
      <h2 style={{ color: "#023E8A", textAlign: "center" }}>Sales Receipt</h2>
      <hr />
      <p><b>Customer:</b> {sale.customerName}</p>
      <p><b>Email:</b> {sale.customerEmail}</p>
      <p><b>Product:</b> {sale.product?.productName}</p>
      <p><b>Quantity:</b> {sale.quantity}</p>
      <p><b>Price Per Unit:</b> Rs.{sale.pricePerUnit}</p>
      <p><b>Total:</b> Rs.{sale.totalAmount}</p>
      <p><b>Date:</b> {new Date(sale.saleDate).toLocaleDateString()}</p>
      <hr />
      <p style={{ textAlign: "center" }}>Thank you for your purchase!</p>
    </div>
  );
};

export default ReceiptPage;