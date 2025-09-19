import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header style={{ background: "#023E8A", padding: "15px" }}>
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "#fff",
        }}
      >
        <h2 style={{ margin: 0 }}>Nation Motor Spares</h2>
        <div>
          <Link to="/" style={linkStyle}>Home</Link>
          <Link to="/about" style={linkStyle}>About</Link>
          <Link to="/contact" style={linkStyle}>Contact</Link>
          <Link to="/login" style={linkStyle}>Login</Link>
        </div>
      </nav>
    </header>
  );
};

const linkStyle = {
  margin: "0 10px",
  color: "#fff",
  textDecoration: "none",
  fontWeight: "500",
};

export default Header;