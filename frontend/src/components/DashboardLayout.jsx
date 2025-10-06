import React from "react";
import NavigationBar from "./NavigationBar";

const DashboardLayout = ({ children }) => {
  return (
    <div style={{ display: "flex" }}>
      <NavigationBar />
      <div style={{ flex: 1, marginLeft: "220px", padding: "20px", background: "#f8f9fa", minHeight: "100vh" }}>
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;