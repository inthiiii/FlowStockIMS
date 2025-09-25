import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const SalesDashboardPage = () => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/sales")
      .then((res) => res.json())
      .then((data) => setSales(data));
  }, []);

  const totalSales = sales.reduce((sum, s) => sum + s.totalAmount, 0);

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ color: "#023E8A" }}>Sales Dashboard</h1>

      <div style={{ margin: "20px 0", padding: "15px", border: "1px solid #ddd", borderRadius: "8px" }}>
        <h3>Total Sales: Rs.{totalSales}</h3>
        <h4>Total Transactions: {sales.length}</h4>
      </div>

      <Link to="/sales/list" style={{ textDecoration: "none", color: "#fff" }}>
        <button style={{ background: "#023E8A", padding: "10px 20px", border: "none", color: "#fff", borderRadius: "5px" }}>
          View All Sales
        </button>
      </Link>
    </div>
  );
};

export default SalesDashboardPage;