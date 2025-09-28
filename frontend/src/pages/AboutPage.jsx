import React from "react";

const AboutPage = () => {
  const styles = {
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "40px 20px",
      backgroundColor: "#ffffff",
      minHeight: "100vh",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    hero: {
      textAlign: "center",
      marginBottom: "60px",
      background: "linear-gradient(135deg, #023E8A 0%, #0056b3 100%)",
      color: "#ffffff",
      padding: "60px 40px",
      borderRadius: "20px",
      boxShadow: "0 10px 30px rgba(2, 62, 138, 0.3)",
    },
    title: {
      fontSize: "3.5rem",
      fontWeight: "700",
      margin: "0",
      marginBottom: "20px",
      textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
    },
    heroSubtitle: {
      fontSize: "1.4rem",
      margin: "0",
      fontWeight: "300",
      opacity: "0.9",
      lineHeight: "1.5",
    },
    mainContent: {
      backgroundColor: "#f8f9fa",
      padding: "50px 40px",
      borderRadius: "20px",
      marginBottom: "40px",
      border: "1px solid #e9ecef",
      boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
    },
    companyName: {
      color: "#023E8A",
      fontWeight: "700",
      fontSize: "1.2em",
      textShadow: "0 1px 2px rgba(2, 62, 138, 0.1)",
    },
    paragraph: {
      fontSize: "1.2rem",
      lineHeight: "1.8",
      textAlign: "justify",
      color: "#495057",
      marginBottom: "30px",
      textIndent: "30px",
      position: "relative",
    },
    firstParagraph: {
      fontSize: "1.3rem",
      fontWeight: "400",
    },
    highlightText: {
      color: "#023E8A",
      fontWeight: "600",
      backgroundColor: "rgba(2, 62, 138, 0.1)",
      padding: "2px 6px",
      borderRadius: "4px",
    },
    whyChooseSection: {
      background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
      padding: "40px",
      borderRadius: "20px",
      boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
      border: "1px solid #dee2e6",
      marginBottom: "40px",
    },
    sectionTitle: {
      color: "#023E8A",
      fontSize: "2.2rem",
      fontWeight: "700",
      textAlign: "center",
      margin: "0 0 30px 0",
      position: "relative",
      paddingBottom: "15px",
    },
    sectionTitleUnderline: {
      content: '""',
      position: "absolute",
      bottom: "0",
      left: "50%",
      transform: "translateX(-50%)",
      width: "80px",
      height: "4px",
      backgroundColor: "#023E8A",
      borderRadius: "2px",
    },
    featuresList: {
      listStyle: "none",
      padding: "0",
      margin: "0",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "20px",
    },
    featureItem: {
      display: "flex",
      alignItems: "center",
      padding: "20px",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      border: "1px solid #e9ecef",
      transition: "all 0.3s ease",
      fontSize: "1.1rem",
      fontWeight: "500",
      color: "#495057",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    },
    featureItemHover: {
      transform: "translateY(-3px)",
      boxShadow: "0 6px 20px rgba(2, 62, 138, 0.15)",
      borderColor: "#023E8A",
    },
    featureIcon: {
      fontSize: "1.5rem",
      color: "#28a745",
      marginRight: "15px",
      minWidth: "30px",
      fontWeight: "bold",
    },
    statsSection: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "30px",
      marginBottom: "40px",
    },
    statCard: {
      backgroundColor: "#ffffff",
      padding: "30px 25px",
      borderRadius: "15px",
      textAlign: "center",
      border: "1px solid #e9ecef",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
      transition: "all 0.3s ease",
    },
    statCardHover: {
      transform: "translateY(-5px)",
      boxShadow: "0 8px 25px rgba(2, 62, 138, 0.2)",
    },
    statIcon: {
      fontSize: "3rem",
      marginBottom: "15px",
      display: "block",
    },
    statTitle: {
      fontSize: "1.3rem",
      fontWeight: "600",
      color: "#023E8A",
      margin: "0 0 10px 0",
    },
    statDescription: {
      fontSize: "1rem",
      color: "#6c757d",
      margin: "0",
      lineHeight: "1.5",
    },
    valuesSection: {
      backgroundColor: "#ffffff",
      padding: "40px",
      borderRadius: "20px",
      border: "1px solid #e9ecef",
      boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
    },
    valuesGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "30px",
      marginTop: "30px",
    },
    valueCard: {
      textAlign: "center",
      padding: "25px",
      borderRadius: "12px",
      border: "2px solid #f8f9fa",
      transition: "all 0.3s ease",
    },
    valueCardHover: {
      borderColor: "#023E8A",
      backgroundColor: "#f8f9fa",
      transform: "translateY(-3px)",
    },
    valueIcon: {
      fontSize: "2.5rem",
      marginBottom: "15px",
      display: "block",
    },
    valueTitle: {
      fontSize: "1.4rem",
      fontWeight: "600",
      color: "#023E8A",
      margin: "0 0 10px 0",
    },
    valueDescription: {
      fontSize: "1rem",
      color: "#6c757d",
      margin: "0",
      lineHeight: "1.6",
    },
    '@media (max-width: 768px)': {
      hero: {
        padding: "40px 20px",
      },
      title: {
        fontSize: "2.5rem",
      },
      mainContent: {
        padding: "30px 25px",
      },
      featuresList: {
        gridTemplateColumns: "1fr",
      },
      paragraph: {
        textIndent: "0",
        textAlign: "left",
      },
    },
  };

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <h1 style={styles.title}>About Us</h1>
        <p style={styles.heroSubtitle}>
          Your trusted partner for quality motorcycle spare parts in Sri Lanka
        </p>
      </div>

      {/* Main Story */}
      <div style={styles.mainContent}>
        <p style={{...styles.paragraph, ...styles.firstParagraph}}>
          <span style={styles.companyName}>Nation Motor Spares</span> is Sri Lanka's leading motorcycle
          spare parts supplier, delivering high-quality and reliable products
          across the country. With years of expertise and a trusted network, we
          ensure that riders and mechanics always get the right part at the right
          time.
        </p>

        <p style={styles.paragraph}>
          We specialize in a wide range of motorcycle components, from essential
          engine parts to stylish accessories, ensuring every rider can maintain
          both performance and safety. Our mission is to make top-quality spare
          parts accessible to everyone, whether you are a professional mechanic or
          an everyday rider.
        </p>

        <p style={styles.paragraph}>
          Over the years, Nation Motor Spares has built a reputation for{" "}
          <span style={styles.highlightText}>trust, reliability, and affordability</span>. Our partnerships
          with global manufacturers allow us to bring international standards to
          the local market, while our dedicated customer support team is always
          ready to guide you in finding the perfect fit for your motorcycle.
        </p>
      </div>

      {/* Stats Section */}
      <div style={styles.statsSection}>
        <div 
          style={styles.statCard}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = styles.statCardHover.transform;
            e.currentTarget.style.boxShadow = styles.statCardHover.boxShadow;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "none";
            e.currentTarget.style.boxShadow = styles.statCard.boxShadow;
          }}
        >
          <span style={{...styles.statIcon, color: '#023E8A'}}>🏍️</span>
          <h3 style={styles.statTitle}>Premium Quality</h3>
          <p style={styles.statDescription}>
            Genuine and high-grade aftermarket parts from trusted global manufacturers
          </p>
        </div>

        <div 
          style={styles.statCard}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = styles.statCardHover.transform;
            e.currentTarget.style.boxShadow = styles.statCardHover.boxShadow;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "none";
            e.currentTarget.style.boxShadow = styles.statCard.boxShadow;
          }}
        >
          <span style={{...styles.statIcon, color: '#28a745'}}>🚚</span>
          <h3 style={styles.statTitle}>Island-wide Delivery</h3>
          <p style={styles.statDescription}>
            Fast and reliable delivery service covering all provinces in Sri Lanka
          </p>
        </div>

        <div 
          style={styles.statCard}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = styles.statCardHover.transform;
            e.currentTarget.style.boxShadow = styles.statCardHover.boxShadow;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "none";
            e.currentTarget.style.boxShadow = styles.statCard.boxShadow;
          }}
        >
          <span style={{...styles.statIcon, color: '#ffc107'}}>⭐</span>
          <h3 style={styles.statTitle}>Expert Support</h3>
          <p style={styles.statDescription}>
            Professional guidance from experienced mechanics and parts specialists
          </p>
        </div>
      </div>

      {/* Why Choose Us */}
      <div style={styles.whyChooseSection}>
        <h2 style={styles.sectionTitle}>
          Why Choose Nation Motor Spares?
          <div style={styles.sectionTitleUnderline}></div>
        </h2>
        <ul style={styles.featuresList}>
          <li 
            style={styles.featureItem}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = styles.featureItemHover.transform;
              e.currentTarget.style.boxShadow = styles.featureItemHover.boxShadow;
              e.currentTarget.style.borderColor = styles.featureItemHover.borderColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = styles.featureItem.boxShadow;
              e.currentTarget.style.borderColor = styles.featureItem.borderColor;
            }}
          >
            <span style={styles.featureIcon}>✓</span>
            Wide range of genuine and aftermarket spare parts
          </li>
          <li 
            style={styles.featureItem}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = styles.featureItemHover.transform;
              e.currentTarget.style.boxShadow = styles.featureItemHover.boxShadow;
              e.currentTarget.style.borderColor = styles.featureItemHover.borderColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = styles.featureItem.boxShadow;
              e.currentTarget.style.borderColor = styles.featureItem.borderColor;
            }}
          >
            <span style={styles.featureIcon}>✓</span>
            Nationwide delivery with trusted logistics partners
          </li>
          <li 
            style={styles.featureItem}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = styles.featureItemHover.transform;
              e.currentTarget.style.boxShadow = styles.featureItemHover.boxShadow;
              e.currentTarget.style.borderColor = styles.featureItemHover.borderColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = styles.featureItem.boxShadow;
              e.currentTarget.style.borderColor = styles.featureItem.borderColor;
            }}
          >
            <span style={styles.featureIcon}>✓</span>
            Competitive pricing and seasonal offers
          </li>
          <li 
            style={styles.featureItem}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = styles.featureItemHover.transform;
              e.currentTarget.style.boxShadow = styles.featureItemHover.boxShadow;
              e.currentTarget.style.borderColor = styles.featureItemHover.borderColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = styles.featureItem.boxShadow;
              e.currentTarget.style.borderColor = styles.featureItem.borderColor;
            }}
          >
            <span style={styles.featureIcon}>✓</span>
            Experienced team with years of industry expertise
          </li>
          <li 
            style={styles.featureItem}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = styles.featureItemHover.transform;
              e.currentTarget.style.boxShadow = styles.featureItemHover.boxShadow;
              e.currentTarget.style.borderColor = styles.featureItemHover.borderColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = styles.featureItem.boxShadow;
              e.currentTarget.style.borderColor = styles.featureItem.borderColor;
            }}
          >
            <span style={styles.featureIcon}>✓</span>
            Customer-first service with dedicated support
          </li>
          <li 
            style={styles.featureItem}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = styles.featureItemHover.transform;
              e.currentTarget.style.boxShadow = styles.featureItemHover.boxShadow;
              e.currentTarget.style.borderColor = styles.featureItemHover.borderColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = styles.featureItem.boxShadow;
              e.currentTarget.style.borderColor = styles.featureItem.borderColor;
            }}
          >
            <span style={styles.featureIcon}>✓</span>
            Quality assurance and warranty on all products
          </li>
        </ul>
      </div>

      {/* Values Section */}
      <div style={styles.valuesSection}>
        <h2 style={styles.sectionTitle}>
          Our Core Values
          <div style={styles.sectionTitleUnderline}></div>
        </h2>
        <div style={styles.valuesGrid}>
          <div 
            style={styles.valueCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = styles.valueCardHover.borderColor;
              e.currentTarget.style.backgroundColor = styles.valueCardHover.backgroundColor;
              e.currentTarget.style.transform = styles.valueCardHover.transform;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = styles.valueCard.borderColor;
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.transform = "none";
            }}
          >
            <span style={{...styles.valueIcon, color: '#023E8A'}}>🎯</span>
            <h3 style={styles.valueTitle}>Reliability</h3>
            <p style={styles.valueDescription}>
              Consistent quality and dependable service you can trust for all your motorcycle needs.
            </p>
          </div>

          <div 
            style={styles.valueCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = styles.valueCardHover.borderColor;
              e.currentTarget.style.backgroundColor = styles.valueCardHover.backgroundColor;
              e.currentTarget.style.transform = styles.valueCardHover.transform;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = styles.valueCard.borderColor;
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.transform = "none";
            }}
          >
            <span style={{...styles.valueIcon, color: '#28a745'}}>💎</span>
            <h3 style={styles.valueTitle}>Excellence</h3>
            <p style={styles.valueDescription}>
              Commitment to providing the highest quality products and exceptional customer service.
            </p>
          </div>

          <div 
            style={styles.valueCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = styles.valueCardHover.borderColor;
              e.currentTarget.style.backgroundColor = styles.valueCardHover.backgroundColor;
              e.currentTarget.style.transform = styles.valueCardHover.transform;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = styles.valueCard.borderColor;
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.transform = "none";
            }}
          >
            <span style={{...styles.valueIcon, color: '#ffc107'}}>🤝</span>
            <h3 style={styles.valueTitle}>Trust</h3>
            <p style={styles.valueDescription}>
              Building lasting relationships through transparency, honesty, and genuine care for our customers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;