import React from "react";

const DashboardPage = () => {
  return (
    <div style={container}>
      <h1 style={title}>Admin Dashboard</h1>
      <p style={text}>
        Welcome to your Admin Panel. Use the sidebar to navigate through Sales, Products, Shipments, and Deliveries.
      </p>
    </div>
  );
};

const container = {
  background: "white",
  padding: "40px",
  borderRadius: "10px",
  boxShadow: "0 3px 10px rgba(0,0,0,0.1)"
};

const title = {
  color: "#023E8A",
  marginBottom: "20px"
};

const text = {
  color: "#555",
  fontSize: "16px"
};

export default DashboardPage;