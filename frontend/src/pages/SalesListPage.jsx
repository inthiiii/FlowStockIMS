import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const SalesListPage = () => {
  const [sales, setSales] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const fetchSales = () => {
    fetch("http://localhost:3000/api/sales")
      .then((res) => res.json())
      .then((data) => setSales(data));
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const deleteSale = async (id) => {
    try {
      await fetch(`http://localhost:3000/api/sales/${id}`, { method: "DELETE" });
      fetchSales();
    } catch (err) {
      alert("Delete failed!");
      console.error(err);
    }
  };

  const returnSale = async (id) => {
    try {
      await fetch(`http://localhost:3000/api/sales/return/${id}`, { method: "PUT" });
      fetchSales();
    } catch (err) {
      alert("Return failed!");
      console.error(err);
    }
  };

  // Filter and search logic
  const filteredSales = sales
    .filter((sale) => {
      if (statusFilter && sale.paymentStatus !== statusFilter) return false;
      if (dateFilter) {
        const saleDate = new Date(sale.saleDate).toISOString().split("T")[0];
        if (saleDate !== dateFilter) return false;
      }
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          sale.customerName.toLowerCase().includes(term) ||
          sale.product?.productName.toLowerCase().includes(term)
        );
      }
      return true;
    });

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ color: "#023E8A" }}>All Sales</h1>

      {/* Search & Filters */}
      <div style={{ display: "flex", gap: "10px", margin: "15px 0", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Search customer or product"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={inputStyle}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={inputStyle}>
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          style={inputStyle}
        />
      </div>

      <Link to="/sales/add">
        <button style={addButtonStyle}>+ Add Sale</button>
      </Link>

      <table style={tableStyle}>
        <thead style={theadStyle}>
          <tr>
            <th>Customer</th>
            <th>Product</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredSales.map((sale) => (
            <tr key={sale._id} style={tbodyTrStyle}>
              <td>{sale.customerName}</td>
              <td>{sale.product?.productName}</td>
              <td>Rs.{sale.totalAmount}</td>
              <td>{sale.paymentStatus}</td>
              <td>{new Date(sale.saleDate).toLocaleDateString()}</td>
              <td>
                <Link to={`/sales/${sale._id}`} style={{ marginRight: "10px" }}>View</Link>
                <button
                  onClick={() => deleteSale(sale._id)}
                  style={{ ...actionButton, background: "red" }}
                >
                  Delete
                </button>
                <button
                  onClick={() => returnSale(sale._id)}
                  style={{ ...actionButton, background: "orange" }}
                >
                  Return
                </button>
              </td>
            </tr>
          ))}
          {filteredSales.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "10px" }}>
                No sales found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

/* ---------- CSS ---------- */
const inputStyle = {
  padding: "8px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  minWidth: "200px",
};

const addButtonStyle = {
  background: "#023E8A",
  padding: "8px 16px",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  marginBottom: "10px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "10px",
};

const theadStyle = {
  background: "#023E8A",
  color: "#fff",
};

const tbodyTrStyle = {
  borderBottom: "1px solid #ddd",
  textAlign: "center",
};

const actionButton = {
  marginRight: "5px",
  color: "#fff",
  border: "none",
  padding: "5px 10px",
  borderRadius: "4px",
  cursor: "pointer",
};

export default SalesListPage;