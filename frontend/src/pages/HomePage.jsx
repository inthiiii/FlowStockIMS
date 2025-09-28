import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

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

  const styles = {
    container: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: "#333",
      lineHeight: "1.6",
      margin: "0",
      padding: "0",
    },
    
    // Hero Section
    heroSection: {
      background: "linear-gradient(135deg, #023E8A 0%, #0056b3 100%)",
      color: "#ffffff",
      padding: "120px 20px",
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
    },
    heroContent: {
      maxWidth: "900px",
      margin: "0 auto",
      position: "relative",
      zIndex: "2",
    },
    heroTitle: {
      fontSize: "4rem",
      fontWeight: "700",
      marginBottom: "20px",
      textShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
      letterSpacing: "-1px",
    },
    heroSubtitle: {
      fontSize: "1.6rem",
      marginBottom: "40px",
      fontWeight: "300",
      opacity: "0.95",
      lineHeight: "1.4",
    },
    heroButton: {
      background: "#ffffff",
      color: "#023E8A",
      border: "none",
      padding: "18px 40px",
      fontSize: "1.3rem",
      fontWeight: "600",
      borderRadius: "50px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      textTransform: "uppercase",
      letterSpacing: "1px",
      boxShadow: "0 4px 15px rgba(255, 255, 255, 0.3)",
    },
    heroButtonHover: {
      transform: "translateY(-3px)",
      boxShadow: "0 6px 25px rgba(255, 255, 255, 0.4)",
      background: "#f8f9fa",
    },

    // Section Styles
    section: {
      padding: "80px 20px",
    },
    sectionAlt: {
      background: "#f8f9fa",
    },
    sectionTitle: {
      fontSize: "2.8rem",
      fontWeight: "700",
      color: "#023E8A",
      textAlign: "center",
      marginBottom: "50px",
      position: "relative",
      paddingBottom: "20px",
    },
    sectionTitleUnderline: {
      content: '""',
      position: "absolute",
      bottom: "0",
      left: "50%",
      transform: "translateX(-50%)",
      width: "100px",
      height: "4px",
      background: "linear-gradient(90deg, #023E8A, #0056b3)",
      borderRadius: "2px",
    },

    // Highlights Section
    highlightSection: {
      ...{ padding: "80px 20px" },
      background: "#f8f9fa",
      textAlign: "center",
    },
    highlightList: {
      listStyle: "none",
      padding: "0",
      margin: "0",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "25px",
      maxWidth: "1000px",
      marginLeft: "auto",
      marginRight: "auto",
    },
    highlightItem: {
      background: "#ffffff",
      padding: "25px",
      borderRadius: "15px",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
      border: "1px solid #e9ecef",
      fontSize: "1.1rem",
      fontWeight: "500",
      color: "#495057",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      textAlign: "left",
    },
    highlightItemHover: {
      transform: "translateY(-5px)",
      boxShadow: "0 8px 30px rgba(2, 62, 138, 0.15)",
      borderColor: "#023E8A",
    },
    highlightIcon: {
      color: "#28a745",
      fontSize: "1.5rem",
      marginRight: "15px",
      fontWeight: "bold",
      minWidth: "30px",
    },

    // Products Section
    productSection: {
      padding: "80px 20px",
      textAlign: "center",
      background: "#ffffff",
    },
    productGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "30px",
      maxWidth: "1400px",
      margin: "0 auto",
    },
    productCard: {
      background: "#ffffff",
      padding: "25px",
      borderRadius: "20px",
      boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
      border: "1px solid #e9ecef",
      transition: "all 0.3s ease",
      position: "relative",
      overflow: "hidden",
    },
    productCardHover: {
      transform: "translateY(-8px)",
      boxShadow: "0 15px 40px rgba(2, 62, 138, 0.2)",
    },
    productImage: {
      width: "100%",
      height: "180px",
      objectFit: "cover",
      borderRadius: "15px",
      marginBottom: "20px",
      transition: "all 0.3s ease",
    },
    productName: {
      fontSize: "1.4rem",
      fontWeight: "600",
      color: "#023E8A",
      margin: "15px 0 10px 0",
    },
    productPrice: {
      color: "#28a745",
      fontSize: "1.3rem",
      fontWeight: "700",
      marginBottom: "20px",
    },
    productButton: {
      background: "#023E8A",
      color: "#ffffff",
      border: "none",
      padding: "12px 25px",
      borderRadius: "25px",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    productButtonHover: {
      background: "#012a5c",
      transform: "translateY(-2px)",
    },

    // About Preview Section
    aboutPreviewSection: {
      padding: "80px 20px",
      background: "#f8f9fa",
      textAlign: "center",
    },
    aboutText: {
      fontSize: "1.2rem",
      lineHeight: "1.8",
      maxWidth: "800px",
      margin: "0 auto 40px auto",
      color: "#495057",
    },
    aboutButton: {
      background: "#023E8A",
      color: "#ffffff",
      border: "none",
      padding: "15px 30px",
      borderRadius: "25px",
      fontSize: "1.1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    aboutButtonHover: {
      background: "#012a5c",
      transform: "translateY(-2px)",
    },

    // Testimonials Section
    testimonialSection: {
      padding: "80px 20px",
      textAlign: "center",
      background: "#ffffff",
    },
    testimonialGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
      gap: "30px",
      maxWidth: "1200px",
      margin: "0 auto",
    },
    testimonialCard: {
      background: "#f8f9fa",
      padding: "35px 25px",
      borderRadius: "20px",
      boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
      border: "1px solid #e9ecef",
      transition: "all 0.3s ease",
      position: "relative",
    },
    testimonialCardHover: {
      transform: "translateY(-5px)",
      boxShadow: "0 10px 30px rgba(2, 62, 138, 0.15)",
    },
    testimonialFeedback: {
      fontSize: "1.1rem",
      fontStyle: "italic",
      color: "#495057",
      lineHeight: "1.6",
      marginBottom: "20px",
    },
    testimonialName: {
      fontWeight: "700",
      color: "#023E8A",
      fontSize: "1.1rem",
      marginBottom: "10px",
    },
    testimonialRating: {
      color: "#ffc107",
      fontSize: "1.2rem",
    },

    // CTA Section
    ctaSection: {
      padding: "80px 20px",
      background: "linear-gradient(135deg, #023E8A 0%, #0056b3 100%)",
      color: "#ffffff",
      textAlign: "center",
    },
    ctaTitle: {
      fontSize: "2.5rem",
      fontWeight: "700",
      marginBottom: "20px",
      textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
    },
    ctaSubtitle: {
      fontSize: "1.3rem",
      marginBottom: "40px",
      opacity: "0.95",
    },
    ctaButton: {
      background: "#ffffff",
      color: "#023E8A",
      border: "none",
      padding: "18px 35px",
      borderRadius: "30px",
      fontSize: "1.2rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      boxShadow: "0 4px 15px rgba(255, 255, 255, 0.3)",
    },
    ctaButtonHover: {
      transform: "translateY(-3px)",
      boxShadow: "0 6px 25px rgba(255, 255, 255, 0.4)",
    },

    // Responsive Design
    '@media (max-width: 768px)': {
      heroTitle: {
        fontSize: "2.5rem",
      },
      heroSubtitle: {
        fontSize: "1.2rem",
      },
      sectionTitle: {
        fontSize: "2.2rem",
      },
      highlightList: {
        gridTemplateColumns: "1fr",
      },
      productGrid: {
        gridTemplateColumns: "1fr",
      },
      testimonialGrid: {
        gridTemplateColumns: "1fr",
      },
    },
  };

  return (
    <div style={styles.container}>
      {/* Hero Banner */}
      <section style={styles.heroSection}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Nation Motor Spares</h1>
          <p style={styles.heroSubtitle}>Your trusted motorcycle spare parts supplier in Sri Lanka</p>
          <button 
            style={styles.heroButton}
            onMouseEnter={(e) => {
              e.target.style.transform = styles.heroButtonHover.transform;
              e.target.style.boxShadow = styles.heroButtonHover.boxShadow;
              e.target.style.background = styles.heroButtonHover.background;
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "none";
              e.target.style.boxShadow = styles.heroButton.boxShadow;
              e.target.style.background = styles.heroButton.background;
            }}
            onClick={() => navigate("/products")}
          >
            Shop Now
          </button>
        </div>
      </section>

      {/* Highlights / Why Choose Us */}
      <section style={styles.highlightSection}>
        <h2 style={styles.sectionTitle}>
          Why Choose Us?
          <div style={styles.sectionTitleUnderline}></div>
        </h2>
        <ul style={styles.highlightList}>
          {[
            "Wide range of genuine and aftermarket spare parts",
            "Nationwide delivery with trusted logistics",
            "Competitive pricing and seasonal offers",
            "Experienced team with years of industry expertise",
            "Customer-first service with dedicated support"
          ].map((text, index) => (
            <li 
              key={index}
              style={styles.highlightItem}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = styles.highlightItemHover.transform;
                e.currentTarget.style.boxShadow = styles.highlightItemHover.boxShadow;
                e.currentTarget.style.borderColor = styles.highlightItemHover.borderColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = styles.highlightItem.boxShadow;
                e.currentTarget.style.borderColor = styles.highlightItem.borderColor;
              }}
            >
              <span style={styles.highlightIcon}>✓</span>
              {text}
            </li>
          ))}
        </ul>
      </section>

      {/* Top Selling Products */}
      <section style={styles.productSection}>
        <h2 style={styles.sectionTitle}>
          Top Selling Products
          <div style={styles.sectionTitleUnderline}></div>
        </h2>
        <div style={styles.productGrid}>
          {topProducts.map((product) => (
            <div 
              key={product.id} 
              style={styles.productCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = styles.productCardHover.transform;
                e.currentTarget.style.boxShadow = styles.productCardHover.boxShadow;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = styles.productCard.boxShadow;
              }}
            >
              <img src={product.image} alt={product.name} style={styles.productImage} />
              <h3 style={styles.productName}>{product.name}</h3>
              <p style={styles.productPrice}>{product.price}</p>
              <button 
                style={styles.productButton}
                onMouseEnter={(e) => {
                  e.target.style.background = styles.productButtonHover.background;
                  e.target.style.transform = styles.productButtonHover.transform;
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = styles.productButton.background;
                  e.target.style.transform = "none";
                }}
                onClick={() => navigate("/products")}
              >
                View Product
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* About Preview */}
      <section style={styles.aboutPreviewSection}>
        <h2 style={styles.sectionTitle}>
          About Nation Motor Spares
          <div style={styles.sectionTitleUnderline}></div>
        </h2>
        <p style={styles.aboutText}>
          Nation Motor Spares is Sri Lanka's leading motorcycle spare parts supplier, delivering high-quality and reliable products across the country. Our mission is to make top-quality spare parts accessible to everyone, whether you are a professional mechanic or an everyday rider.
        </p>
        <button 
          style={styles.aboutButton}
          onMouseEnter={(e) => {
            e.target.style.background = styles.aboutButtonHover.background;
            e.target.style.transform = styles.aboutButtonHover.transform;
          }}
          onMouseLeave={(e) => {
            e.target.style.background = styles.aboutButton.background;
            e.target.style.transform = "none";
          }}
          onClick={() => navigate("/about")}
        >
          Read More
        </button>
      </section>

      {/* Customer Testimonials */}
      <section style={styles.testimonialSection}>
        <h2 style={styles.sectionTitle}>
          What Our Customers Say
          <div style={styles.sectionTitleUnderline}></div>
        </h2>
        <div style={styles.testimonialGrid}>
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              style={styles.testimonialCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = styles.testimonialCardHover.transform;
                e.currentTarget.style.boxShadow = styles.testimonialCardHover.boxShadow;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = styles.testimonialCard.boxShadow;
              }}
            >
              <p style={styles.testimonialFeedback}>"{testimonial.feedback}"</p>
              <p style={styles.testimonialName}>- {testimonial.name}</p>
              <div style={styles.testimonialRating}>
                {"★".repeat(testimonial.rating)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section style={styles.ctaSection}>
        <h2 style={styles.ctaTitle}>Need help finding the right part?</h2>
        <p style={styles.ctaSubtitle}>Contact us today and our experts will assist you!</p>
        <button 
          style={styles.ctaButton}
          onMouseEnter={(e) => {
            e.target.style.transform = styles.ctaButtonHover.transform;
            e.target.style.boxShadow = styles.ctaButtonHover.boxShadow;
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "none";
            e.target.style.boxShadow = styles.ctaButton.boxShadow;
          }}
          onClick={() => navigate("/contact")}
        >
          Contact Us
        </button>
      </section>
    </div>
  );
};

export default HomePage;