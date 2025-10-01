import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer style={footerStyle}>
      <div style={footerContainer}>
        <div style={footerContent}>
          
          {/* Company intro */}
          <div style={footerSection}>
            <div style={footerLogoSection}>
              <h4 style={footerTitle}>Nation Motors</h4>
            </div>
            <p style={footerDescription}>
              Leading suppliers of motorcycle spare parts with trusted service and quality nationwide.
            </p>
            <div style={socialLinks}>
              <div style={socialIcon}>📘</div>
              <div style={socialIcon}>📷</div>
              <div style={socialIcon}>🐦</div>
            </div>
          </div>

          {/* Navigation */}
          <div style={footerSection}>
            <h4 style={footerSectionTitle}>Quick Links</h4>
            <ul style={footerList}>
              <li><Link to="/" style={footerLinkStyle}>Home</Link></li>
              <li><Link to="/about" style={footerLinkStyle}>About Us</Link></li>
              <li><Link to="/products" style={footerLinkStyle}>Products</Link></li>
              <li><Link to="/contact" style={footerLinkStyle}>Contact</Link></li>
              <li><Link to="/login" style={footerLinkStyle}>Login</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div style={footerSection}>
            <h4 style={footerSectionTitle}>Contact Info</h4>
            <div style={contactInfo}>
              <div style={contactItem}>
                <span style={contactIcon}>📍</span>
                <span>Colombo, Sri Lanka</span>
              </div>
              <div style={contactItem}>
                <span style={contactIcon}>📞</span>
                <span>+94 77 123 4567</span>
              </div>
              <div style={contactItem}>
                <span style={contactIcon}>📧</span>
                <span>nationmotorscolombo@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div style={footerSection}>
            <h4 style={footerSectionTitle}>Business Hours</h4>
            <div style={businessHours}>
              <div style={hoursItem}>
                <span style={dayLabel}>Mon - Fri:</span>
                <span>8:00 AM - 6:00 PM</span>
              </div>
              <div style={hoursItem}>
                <span style={dayLabel}>Saturday:</span>
                <span>8:00 AM - 4:00 PM</span>
              </div>
              <div style={hoursItem}>
                <span style={dayLabel}>Sunday:</span>
                <span>Closed</span>
              </div>
            </div>
          </div>
        </div>
        
        <div style={footerBottom}>
          <div style={footerBottomContent}>
            <p style={copyrightText}>
              © 2025 FlowStock. All rights reserved.
            </p>
            <div style={footerBottomLinks}>
              <a href="#" style={footerBottomLinkStyle}>Privacy Policy</a>
              <span style={separator}>|</span>
              <a href="#" style={footerBottomLinkStyle}>Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

/* ---------- Footer Styles ---------- */
const footerStyle = {
  background: "linear-gradient(135deg, #001d3d 0%, #023E8A 100%)",
  color: "#fff",
  marginTop: "50px"
};

const footerContainer = {
  width: "100%",
  margin: 0
};

const footerContent = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "40px",
  padding: "50px 20px 30px 20px"
};

const footerSection = {
  display: "flex",
  flexDirection: "column"
};

const footerLogoSection = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  marginBottom: "15px"
};

const footerLogoIcon = {
  fontSize: "1.8rem"
};

const footerTitle = {
  margin: 0,
  fontSize: "1.4rem",
  fontWeight: "700",
  color: "#fff"
};

const footerSectionTitle = {
  fontSize: "1.2rem",
  fontWeight: "600",
  marginBottom: "20px",
  color: "#fff",
  position: "relative",
  paddingBottom: "8px"
};

const footerDescription = {
  fontSize: "1rem",
  lineHeight: "1.6",
  color: "rgba(255,255,255,0.8)",
  marginBottom: "20px"
};

const socialLinks = {
  display: "flex",
  gap: "12px"
};

const socialIcon = {
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  background: "rgba(255,255,255,0.1)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "all 0.3s ease",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255,255,255,0.1)"
};

const footerList = {
  listStyle: "none",
  padding: 0,
  margin: 0
};

const footerLinkStyle = {
  color: "rgba(255,255,255,0.8)",
  textDecoration: "none",
  fontSize: "1rem",
  lineHeight: "2",
  transition: "all 0.3s ease",
  display: "inline-block"
};

const contactInfo = {
  display: "flex",
  flexDirection: "column",
  gap: "12px"
};

const contactItem = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  fontSize: "1rem",
  color: "rgba(255,255,255,0.8)"
};

const contactIcon = {
  fontSize: "1.2rem",
  width: "20px"
};

const businessHours = {
  display: "flex",
  flexDirection: "column",
  gap: "8px"
};

const hoursItem = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: "0.95rem",
  color: "rgba(255,255,255,0.8)",
  padding: "4px 0"
};

const dayLabel = {
  fontWeight: "500",
  color: "rgba(255,255,255,0.9)"
};

const footerBottom = {
  borderTop: "1px solid rgba(255,255,255,0.1)",
  padding: "25px 20px"
};

const footerBottomContent = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "20px"
};

const copyrightText = {
  margin: 0,
  fontSize: "0.95rem",
  color: "rgba(255,255,255,0.7)"
};

const footerBottomLinks = {
  display: "flex",
  alignItems: "center",
  gap: "15px"
};

const footerBottomLinkStyle = {
  color: "rgba(255,255,255,0.7)",
  textDecoration: "none",
  fontSize: "0.95rem",
  transition: "color 0.3s ease",
  cursor: "pointer"
};

const separator = {
  color: "rgba(255,255,255,0.3)"
};

// Add CSS for hover effects
const style = document.createElement('style');
style.textContent = `
  /* Footer hover effects */
  footer a:hover {
    color: #fff !important;
    padding-left: 8px;
  }

  footer div[style*="cursor: pointer"]:hover {
    background: rgba(255,255,255,0.2) !important;
    transform: translateY(-2px);
  }

  footer a[href="#"]:hover {
    color: #fff !important;
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .footer-content {
      grid-template-columns: 1fr !important;
      gap: 30px !important;
    }
    
    .footer-bottom-content {
      flex-direction: column;
      text-align: center;
    }
  }
`;
document.head.appendChild(style);

export default Footer;