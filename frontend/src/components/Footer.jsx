import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer style={{ background: "#023E8A", color: "#fff", padding: "20px", marginTop: "30px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
        
        {/* Company intro */}
        <div style={{ flex: 1, minWidth: "200px" }}>
          <h4>Nation Motor Spares</h4>
          <p>Leading suppliers of motorcycle spare parts with trusted service and quality nationwide.</p>
        </div>

        {/* Navigation */}
        <div style={{ flex: 1, minWidth: "200px" }}>
          <h4>Navigation</h4>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li><Link to="/" style={linkStyle}>Home</Link></li>
            <li><Link to="/about" style={linkStyle}>About</Link></li>
            <li><Link to="/contact" style={linkStyle}>Contact</Link></li>
            <li><Link to="/login" style={linkStyle}>Login</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div style={{ flex: 1, minWidth: "200px" }}>
          <h4>Contact Info</h4>
          <p>Address: Colombo, Sri Lanka</p>
          <p>Phone: +94 77 123 4567</p>
          <p>Email: nationmotors@gmail.com</p>
        </div>
      </div>
    </footer>
  );
};

const linkStyle = {
  color: "#fff",
  textDecoration: "none",
};

export default Footer;