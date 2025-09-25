import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const SaleDetailsPage = () => {
  const { id } = useParams();
  const [sale, setSale] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/sales/${id}`)
      .then((res) => res.json())
      .then((data) => setSale(data));
  }, [id]);

  if (!sale) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ color: "#023E8A" }}>Sale Details</h1>
      <p><b>Customer:</b> {sale.customerName}</p>
      <p><b>Email:</b> {sale.customerEmail}</p>
      <p><b>Product:</b> {sale.product?.productName}</p>
      <p><b>Quantity:</b> {sale.quantity}</p>
      <p><b>Total Amount:</b> Rs.{sale.totalAmount}</p>
      <p><b>Status:</b> {sale.paymentStatus}</p>

      <Link to={`/sales/${id}/receipt`}>
        <button style={{ background: "#023E8A", padding: "10px 20px", color: "#fff", border: "none", borderRadius: "5px" }}>
          View Receipt
        </button>
      </Link>
    </div>
  );
};

export default SaleDetailsPage;