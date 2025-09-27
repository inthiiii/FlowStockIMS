import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header style={headerStyle}>
      <div style={headerContainer}>
        <nav style={navStyle}>
          <div style={logoSection}>
            
            <h2 style={logoText}>Nation Motor Spares</h2>
          </div>
          <div style={navLinks}>
            <Link to="/" style={linkStyle}>Home</Link>
            <Link to="/about" style={linkStyle}>About</Link>
            <Link to="/products" style={linkStyle}>Products</Link>
            <Link to="/contact" style={linkStyle}>Contact</Link>
            <Link to="/login" style={loginLinkStyle}>Login</Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

/* ---------- Header Styles ---------- */
const headerStyle = {
  background: "linear-gradient(135deg, #023E8A 0%, #0353b3 100%)",
  boxShadow: "0 2px 10px rgba(2, 62, 138, 0.2)",
  position: "sticky",
  top: 0,
  zIndex: 1000
};

const headerContainer = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "0 20px"
};

const navStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "15px 0",
  color: "#fff"
};

const logoSection = {
  display: "flex",
  alignItems: "center",
  gap: "12px"
};

const logoIcon = {
  fontSize: "2rem",
  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
};

const logoText = {
  margin: 0,
  fontSize: "1.8rem",
  fontWeight: "700",
  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
  letterSpacing: "-0.5px"
};

const navLinks = {
  display: "flex",
  alignItems: "center",
  gap: "30px"
};

const linkStyle = {
  color: "#fff",
  textDecoration: "none",
  fontWeight: "500",
  fontSize: "1rem",
  padding: "8px 16px",
  borderRadius: "25px",
  transition: "all 0.3s ease",
  position: "relative"
};

const loginLinkStyle = {
  color: "#fff",
  textDecoration: "none",
  fontWeight: "600",
  fontSize: "1rem",
  padding: "8px 16px",
  borderRadius: "25px",
  transition: "all 0.3s ease",
  position: "relative",
  background: "rgba(255,255,255,0.15)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255,255,255,0.2)"
};

// Add hover styles
const style = document.createElement('style');
style.textContent = `
  /* Header hover effects */
  header a:hover {
    background: rgba(255,255,255,0.1) !important;
    transform: translateY(-1px);
  }

  /* Responsive design */
  @media (max-width: 768px) {
    nav div:last-child {
      flex-wrap: wrap;
      gap: 15px !important;
    }
    
    h2 {
      font-size: 1.4rem !important;
    }
  }
`;
document.head.appendChild(style);

export default Header;