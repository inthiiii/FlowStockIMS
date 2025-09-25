import React, { useState } from "react";

const NavigationBarVisualization = () => {
  const [showProducts, setShowProducts] = useState(false);
  const [showSales, setShowSales] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleLogout = () => {
    alert("Logout clicked - would navigate to /login");
  };

  const handleNavClick = (path) => {
    alert(`Would navigate to: ${path}`);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Navigation Sidebar */}
      <div style={sidebar}>
        <h2 style={{ color: "#fff", textAlign: "center", margin: "0 0 20px 0" }}>Admin Panel</h2>
        
        {/* Dashboard Link */}
        <div onClick={() => handleNavClick("/dashboard")} style={linkStyle}>
          Dashboard
        </div>
        
        {/* Messages Link */}
        <div onClick={() => handleNavClick("/messages")} style={linkStyle}>
          Messages
        </div>
        
        {/* Products Dropdown */}
        <div>
          <div onClick={() => setShowProducts(!showProducts)} style={linkStyle}>
            Products ▼
          </div>
          {showProducts && (
            <div style={dropdown}>
              <div onClick={() => handleNavClick("/products/entry")} style={sublinkStyle}>
                Products Entry
              </div>
              <div onClick={() => handleNavClick("/products/history")} style={sublinkStyle}>
                Products History
              </div>
            </div>
          )}
        </div>
        
        {/* Sales Dropdown */}
        <div>
          <div onClick={() => setShowSales(!showSales)} style={linkStyle}>
            Sales ▼
          </div>
          {showSales && (
            <div style={dropdown}>
              <div onClick={() => handleNavClick("/sales/list")} style={sublinkStyle}>
                Sales List
              </div>
              <div onClick={() => handleNavClick("/sales/dashboard")} style={sublinkStyle}>
                Sales Dashboard
              </div>
              <div onClick={() => handleNavClick("/sales/details")} style={sublinkStyle}>
                Sales Details
              </div>
              <div onClick={() => handleNavClick("/sales/add")} style={sublinkStyle}>
                Sales Entry
              </div>
            </div>
          )}
        </div>
        
        {/* Settings Dropdown */}
        <div>
          <div onClick={() => setShowSettings(!showSettings)} style={linkStyle}>
            Settings ▼
          </div>
          {showSettings && (
            <div style={dropdown}>
              <div onClick={() => handleNavClick("/settings/credentials")} style={sublinkStyle}>
                Change Credentials
              </div>
              <div onClick={() => handleNavClick("/settings/password")} style={sublinkStyle}>
                Change Password
              </div>
            </div>
          )}
        </div>
        
        {/* Logout Button */}
        <div onClick={handleLogout} style={{ ...linkStyle, marginTop: "20px", background: "red" }}>
          Logout
        </div>
      </div>

      {/* Main Content Area */}
      <div style={mainContent}>
        <div style={contentBox}>
          <h1 style={{ color: "#023E8A", marginBottom: "20px" }}>NavigationBar Component Preview</h1>
          <p style={{ marginBottom: "15px" }}>
            This is a visualization of your NavigationBar component. The sidebar on the left shows:
          </p>
          <ul style={{ marginBottom: "20px", lineHeight: "1.6" }}>
            <li><strong>Fixed positioning:</strong> Stays in place on the left side</li>
            <li><strong>Collapsible dropdowns:</strong> Click on Products, Sales, or Settings to expand</li>
            <li><strong>Color scheme:</strong> Deep blue background (#023E8A) with white text</li>
            <li><strong>Interactive elements:</strong> All links and buttons are clickable</li>
          </ul>
          <div style={{ background: "#f8f9fa", padding: "15px", borderRadius: "8px", border: "1px solid #dee2e6" }}>
            <h3 style={{ margin: "0 0 10px 0", color: "#023E8A" }}>Try clicking on:</h3>
            <ul style={{ margin: 0, paddingLeft: "20px" }}>
              <li>Dashboard or Messages for direct navigation</li>
              <li>Products, Sales, or Settings to see dropdown menus</li>
              <li>Any sub-menu items to simulate navigation</li>
              <li>The red Logout button to see the logout action</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- CSS Styles (matching your original) ---------- */
const sidebar = {
  width: "220px",
  height: "100vh",
  background: "#023E8A",
  color: "#fff",
  padding: "20px",
  position: "fixed",
  top: 0,
  left: 0,
  display: "flex",
  flexDirection: "column",
  boxShadow: "2px 0 5px rgba(0,0,0,0.1)"
};

const linkStyle = {
  padding: "10px",
  textDecoration: "none",
  color: "#fff",
  cursor: "pointer",
  margin: "5px 0",
  borderRadius: "4px",
  display: "block",
  transition: "background-color 0.2s",
  userSelect: "none"
};

const sublinkStyle = {
  ...linkStyle,
  paddingLeft: "25px",
  background: "#0353b3",
};

const dropdown = {
  display: "flex",
  flexDirection: "column",
};

const mainContent = {
  marginLeft: "220px",
  padding: "20px",
  background: "#f8f9fa",
  minHeight: "100vh",
  width: "calc(100% - 220px)"
};

const contentBox = {
  background: "white",
  padding: "30px",
  borderRadius: "8px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  maxWidth: "800px"
};

// Add hover effects
const style = document.createElement('style');
style.textContent = `
  .nav-item:hover {
    background-color: rgba(255, 255, 255, 0.1) !important;
  }
  .nav-subitem:hover {
    background-color: #0466c8 !important;
  }
`;
document.head.appendChild(style);

export default NavigationBarVisualization;