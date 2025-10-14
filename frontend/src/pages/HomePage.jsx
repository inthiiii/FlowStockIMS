import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [hoveredHighlight, setHoveredHighlight] = useState(null);

  // Hardcoded products
  const topProducts = [
    { id: 1, name: "Brake Disc", image: "https://via.placeholder.com/200x150/023E8A/ffffff?text=Brake+Disc", price: "LKR 2,500" },
    { id: 2, name: "Chain Set", image: "https://via.placeholder.com/200x150/023E8A/ffffff?text=Chain+Set", price: "LKR 4,000" },
    { id: 3, name: "Headlight Assembly", image: "https://via.placeholder.com/200x150/023E8A/ffffff?text=Headlight", price: "LKR 3,200" },
    { id: 4, name: "Clutch Plate", image: "https://via.placeholder.com/200x150/023E8A/ffffff?text=Clutch+Plate", price: "LKR 1,800" },
    { id: 5, name: "Oil Filter", image: "https://via.placeholder.com/200x150/023E8A/ffffff?text=Oil+Filter", price: "LKR 950" },
  ];

  // Hardcoded testimonials
  const testimonials = [
    { id: 1, name: "Kamal Perera", feedback: "Nation Motor Spares always has the parts I need. Excellent service!", rating: 5 },
    { id: 2, name: "Nimal Fernando", feedback: "Quick delivery and affordable prices. Highly recommended!", rating: 5 },
    { id: 3, name: "Samantha Jayasinghe", feedback: "Friendly staff and genuine parts. I trust them completely.", rating: 5 },
  ];

  const highlights = [
    "Wide range of genuine and aftermarket spare parts",
    "Nationwide delivery with trusted logistics",
    "Competitive pricing and seasonal offers",
    "Experienced team with years of industry expertise",
    "Customer-first service with dedicated support"
  ];

  const styles = {
    container: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      color: "#1a1a2e",
      lineHeight: "1.6",
      margin: "0",
      padding: "0",
      background: "#ffffff",
    },

    // Hero Section
    heroSection: {
      background: "linear-gradient(135deg, #023E8A 0%, #0077B6 50%, #00B4D8 100%)",
      color: "#ffffff",
      padding: "140px 20px 120px",
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
      backgroundSize: "200% 200%",
    },
    heroDecoration: {
      position: "absolute",
      width: "500px",
      height: "500px",
      borderRadius: "50%",
      background: "rgba(255, 255, 255, 0.1)",
      filter: "blur(100px)",
    },
    heroDecorationTop: {
      top: "-200px",
      right: "-100px",
    },
    heroDecorationBottom: {
      bottom: "-200px",
      left: "-100px",
    },
    heroContent: {
      maxWidth: "1000px",
      margin: "0 auto",
      position: "relative",
      zIndex: 2,
    },
    heroTitle: {
      fontSize: "4.5rem",
      fontWeight: "900",
      marginBottom: "24px",
      textShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
      letterSpacing: "-2px",
      lineHeight: "1.1",
    },
    heroSubtitle: {
      fontSize: "1.5rem",
      marginBottom: "48px",
      fontWeight: "400",
      opacity: "0.95",
      lineHeight: "1.6",
      maxWidth: "700px",
      margin: "0 auto 48px",
    },
    heroButton: {
      background: "#ffffff",
      color: "#023E8A",
      border: "none",
      padding: "20px 50px",
      fontSize: "1.2rem",
      fontWeight: "700",
      borderRadius: "50px",
      cursor: "pointer",
      transition: "all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      textTransform: "uppercase",
      letterSpacing: "2px",
      boxShadow: "0 8px 30px rgba(255, 255, 255, 0.3)",
      display: "inline-block",
    },

    // Section Styles
    sectionTitle: {
      fontSize: "3.2rem",
      fontWeight: "800",
      color: "#023E8A",
      textAlign: "center",
      marginBottom: "20px",
      position: "relative",
      letterSpacing: "-1px",
    },
    sectionSubtitle: {
      fontSize: "1.2rem",
      color: "#64748b",
      textAlign: "center",
      marginBottom: "60px",
      maxWidth: "600px",
      margin: "0 auto 60px",
      fontWeight: "400",
    },

    // Highlights Section
    highlightSection: {
      padding: "100px 20px",
      background: "linear-gradient(180deg, #f8fafc 0%, #e8f4f8 100%)",
      position: "relative",
    },
    highlightList: {
      listStyle: "none",
      padding: "0",
      margin: "0",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "30px",
      maxWidth: "1200px",
      marginLeft: "auto",
      marginRight: "auto",
    },
    highlightItem: {
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      padding: "32px",
      borderRadius: "20px",
      boxShadow: "0 4px 20px rgba(2, 62, 138, 0.08)",
      border: "2px solid #e2e8f0",
      fontSize: "1.1rem",
      fontWeight: "500",
      color: "#334155",
      transition: "all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      display: "flex",
      alignItems: "flex-start",
      textAlign: "left",
      position: "relative",
      overflow: "hidden",
      cursor: "default",
    },
    highlightIcon: {
      fontSize: "1.8rem",
      marginRight: "20px",
      fontWeight: "bold",
      minWidth: "32px",
      height: "32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      color: "#ffffff",
      flexShrink: 0,
    },

    // Products Section
    productSection: {
      padding: "100px 20px",
      textAlign: "center",
      background: "#ffffff",
    },
    productGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "40px",
      maxWidth: "1400px",
      margin: "0 auto",
    },
    productCard: {
      background: "#ffffff",
      borderRadius: "24px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
      border: "2px solid #e2e8f0",
      transition: "all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      position: "relative",
      overflow: "hidden",
      cursor: "pointer",
    },
    productImageContainer: {
      position: "relative",
      overflow: "hidden",
      background: "linear-gradient(135deg, #023E8A 0%, #0077B6 100%)",
      height: "220px",
    },
    productImage: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "all 0.5s ease",
    },
    productBadge: {
      position: "absolute",
      top: "16px",
      right: "16px",
      background: "rgba(255, 255, 255, 0.95)",
      color: "#023E8A",
      padding: "8px 16px",
      borderRadius: "20px",
      fontSize: "0.85rem",
      fontWeight: "700",
      backdropFilter: "blur(10px)",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    },
    productContent: {
      padding: "28px",
    },
    productName: {
      fontSize: "1.5rem",
      fontWeight: "700",
      color: "#023E8A",
      margin: "0 0 12px 0",
    },
    productPrice: {
      color: "#10b981",
      fontSize: "1.6rem",
      fontWeight: "800",
      marginBottom: "24px",
      display: "block",
    },
    productButton: {
      background: "linear-gradient(135deg, #023E8A 0%, #0077B6 100%)",
      color: "#ffffff",
      border: "none",
      padding: "14px 32px",
      borderRadius: "50px",
      fontSize: "1rem",
      fontWeight: "700",
      cursor: "pointer",
      transition: "all 0.3s ease",
      textTransform: "uppercase",
      letterSpacing: "1px",
      width: "100%",
      boxShadow: "0 4px 15px rgba(2, 62, 138, 0.2)",
    },

    // About Preview Section
    aboutPreviewSection: {
      padding: "100px 20px",
      background: "linear-gradient(135deg, #023E8A 0%, #0077B6 50%, #00B4D8 100%)",
      position: "relative",
      overflow: "hidden",
    },
    aboutContent: {
      maxWidth: "900px",
      margin: "0 auto",
      textAlign: "center",
      position: "relative",
      zIndex: 2,
    },
    aboutText: {
      fontSize: "1.3rem",
      lineHeight: "1.9",
      marginBottom: "48px",
      color: "#ffffff",
      opacity: "0.95",
    },
    aboutButton: {
      background: "#ffffff",
      color: "#023E8A",
      border: "none",
      padding: "18px 45px",
      borderRadius: "50px",
      fontSize: "1.1rem",
      fontWeight: "700",
      cursor: "pointer",
      transition: "all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      textTransform: "uppercase",
      letterSpacing: "2px",
      boxShadow: "0 8px 30px rgba(255, 255, 255, 0.3)",
    },

    // Testimonials Section
    testimonialSection: {
      padding: "100px 20px",
      textAlign: "center",
      background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
    },
    testimonialGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
      gap: "40px",
      maxWidth: "1300px",
      margin: "0 auto",
    },
    testimonialCard: {
      background: "#ffffff",
      padding: "40px 32px",
      borderRadius: "24px",
      boxShadow: "0 8px 30px rgba(2, 62, 138, 0.08)",
      border: "2px solid #e2e8f0",
      transition: "all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      position: "relative",
    },
    quoteIcon: {
      fontSize: "3rem",
      color: "#0077B6",
      opacity: "0.2",
      marginBottom: "16px",
      lineHeight: "1",
    },
    testimonialFeedback: {
      fontSize: "1.15rem",
      fontStyle: "italic",
      color: "#334155",
      lineHeight: "1.8",
      marginBottom: "24px",
    },
    testimonialName: {
      fontWeight: "700",
      color: "#023E8A",
      fontSize: "1.2rem",
      marginBottom: "8px",
    },
    testimonialRating: {
      color: "#fbbf24",
      fontSize: "1.4rem",
      letterSpacing: "4px",
    },

    // CTA Section
    ctaSection: {
      padding: "100px 20px",
      background: "linear-gradient(135deg, #023E8A 0%, #0077B6 50%, #00B4D8 100%)",
      color: "#ffffff",
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
    },
    ctaTitle: {
      fontSize: "3rem",
      fontWeight: "800",
      marginBottom: "24px",
      textShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
      letterSpacing: "-1px",
    },
    ctaSubtitle: {
      fontSize: "1.4rem",
      marginBottom: "48px",
      opacity: "0.95",
      maxWidth: "700px",
      margin: "0 auto 48px",
    },
    ctaButton: {
      background: "#ffffff",
      color: "#023E8A",
      border: "none",
      padding: "20px 50px",
      borderRadius: "50px",
      fontSize: "1.2rem",
      fontWeight: "700",
      cursor: "pointer",
      transition: "all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      textTransform: "uppercase",
      letterSpacing: "2px",
      boxShadow: "0 8px 30px rgba(255, 255, 255, 0.3)",
    },

    // Responsive Design
    '@media (max-width: 768px)': {
      heroTitle: { fontSize: "2.5rem" },
      heroSubtitle: { fontSize: "1.2rem" },
      sectionTitle: { fontSize: "2.2rem" },
    },
  };

  return (
    <div style={styles.container}>
      {/* Hero Banner */}
      <section style={styles.heroSection}>
        <div style={{...styles.heroDecoration, ...styles.heroDecorationTop}}></div>
        <div style={{...styles.heroDecoration, ...styles.heroDecorationBottom}}></div>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Nation Motor Spares</h1>
          <p style={styles.heroSubtitle}>Your trusted motorcycle spare parts supplier in Sri Lanka</p>
          <button
            style={styles.heroButton}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-4px) scale(1.05)";
              e.target.style.boxShadow = "0 12px 40px rgba(255, 255, 255, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "none";
              e.target.style.boxShadow = "0 8px 30px rgba(255, 255, 255, 0.3)";
            }}
            onClick={() => navigate("/products")}
          >
            Shop Now
          </button>
        </div>
      </section>

      {/* Highlights / Why Choose Us */}
      <section style={styles.highlightSection}>
        <h2 style={styles.sectionTitle}>Why Choose Us?</h2>
        <p style={styles.sectionSubtitle}>Excellence in every part, trust in every delivery</p>
        <ul style={styles.highlightList}>
          {highlights.map((text, index) => (
            <li
              key={index}
              style={styles.highlightItem}
              onMouseEnter={(e) => {
                setHoveredHighlight(index);
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 12px 40px rgba(2, 62, 138, 0.15)";
                e.currentTarget.style.borderColor = "#0077B6";
              }}
              onMouseLeave={(e) => {
                setHoveredHighlight(null);
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(2, 62, 138, 0.08)";
                e.currentTarget.style.borderColor = "#e2e8f0";
              }}
            >
              <span style={styles.highlightIcon}>✓</span>
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Top Selling Products */}
      <section style={styles.productSection}>
        <h2 style={styles.sectionTitle}>Top Selling Products</h2>
        <p style={styles.sectionSubtitle}>Premium quality parts for your motorcycle</p>
        <div style={styles.productGrid}>
          {topProducts.map((product) => (
            <div
              key={product.id}
              style={styles.productCard}
              onMouseEnter={(e) => {
                setHoveredProduct(product.id);
                e.currentTarget.style.transform = "translateY(-12px)";
                e.currentTarget.style.boxShadow = "0 20px 60px rgba(2, 62, 138, 0.2)";
                e.currentTarget.style.borderColor = "#0077B6";
              }}
              onMouseLeave={(e) => {
                setHoveredProduct(null);
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.06)";
                e.currentTarget.style.borderColor = "#e2e8f0";
              }}
            >
              <div style={styles.productImageContainer}>
                <img 
                  src={product.image} 
                  alt={product.name} 
                  style={{
                    ...styles.productImage,
                    transform: hoveredProduct === product.id ? "scale(1.15)" : "scale(1)",
                  }} 
                />
                <div style={styles.productBadge}>POPULAR</div>
              </div>
              <div style={styles.productContent}>
                <h3 style={styles.productName}>{product.name}</h3>
                <span style={styles.productPrice}>{product.price}</span>
                <button
                  style={styles.productButton}
                  onMouseEnter={(e) => {
                    e.target.style.background = "linear-gradient(135deg, #012a5c 0%, #023E8A 100%)";
                    e.target.style.transform = "scale(1.02)";
                    e.target.style.boxShadow = "0 8px 25px rgba(2, 62, 138, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "linear-gradient(135deg, #023E8A 0%, #0077B6 100%)";
                    e.target.style.transform = "none";
                    e.target.style.boxShadow = "0 4px 15px rgba(2, 62, 138, 0.2)";
                  }}
                  onClick={() => navigate("/products")}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Preview */}
      <section style={styles.aboutPreviewSection}>
        <div style={{...styles.heroDecoration, ...styles.heroDecorationTop}}></div>
        <div style={{...styles.heroDecoration, ...styles.heroDecorationBottom}}></div>
        <div style={styles.aboutContent}>
          <h2 style={{...styles.sectionTitle, color: "#ffffff", marginBottom: "24px"}}>
            About Nation Motor Spares
          </h2>
          <p style={styles.aboutText}>
            Nation Motor Spares is Sri Lanka's leading motorcycle spare parts supplier, delivering high-quality and reliable products across the country. Our mission is to make top-quality spare parts accessible to everyone, whether you are a professional mechanic or an everyday rider.
          </p>
          <button
            style={styles.aboutButton}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-4px) scale(1.05)";
              e.target.style.boxShadow = "0 12px 40px rgba(255, 255, 255, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "none";
              e.target.style.boxShadow = "0 8px 30px rgba(255, 255, 255, 0.3)";
            }}
            onClick={() => navigate("/about")}
          >
            Learn More
          </button>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section style={styles.testimonialSection}>
        <h2 style={styles.sectionTitle}>What Our Customers Say</h2>
        <p style={styles.sectionSubtitle}>Real experiences from our valued customers</p>
        <div style={styles.testimonialGrid}>
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              style={styles.testimonialCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 16px 50px rgba(2, 62, 138, 0.15)";
                e.currentTarget.style.borderColor = "#0077B6";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(2, 62, 138, 0.08)";
                e.currentTarget.style.borderColor = "#e2e8f0";
              }}
            >
              <div style={styles.quoteIcon}>"</div>
              <p style={styles.testimonialFeedback}>{testimonial.feedback}</p>
              <p style={styles.testimonialName}>{testimonial.name}</p>
              <div style={styles.testimonialRating}>
                {"★".repeat(testimonial.rating)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section style={styles.ctaSection}>
        <div style={{...styles.heroDecoration, ...styles.heroDecorationTop}}></div>
        <div style={{...styles.heroDecoration, ...styles.heroDecorationBottom}}></div>
        <div style={{position: "relative", zIndex: 2}}>
          <h2 style={styles.ctaTitle}>Need help finding the right part?</h2>
          <p style={styles.ctaSubtitle}>Contact us today and our experts will assist you!</p>
          <button
            style={styles.ctaButton}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-4px) scale(1.05)";
              e.target.style.boxShadow = "0 12px 40px rgba(255, 255, 255, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "none";
              e.target.style.boxShadow = "0 8px 30px rgba(255, 255, 255, 0.3)";
            }}
            onClick={() => navigate("/contact")}
          >
            Contact Us
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;