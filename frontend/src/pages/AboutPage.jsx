import React, { useState } from "react";

const AboutPage = () => {
  const [hoveredStat, setHoveredStat] = useState(null);
  const [hoveredValue, setHoveredValue] = useState(null);

  const styles = {
    container: {
      maxWidth: "1400px",
      margin: "0 auto",
      padding: "0",
      backgroundColor: "#ffffff",
      minHeight: "100vh",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },

    // Hero Section with animated gradient
    hero: {
      textAlign: "center",
      marginBottom: "0",
      background: "linear-gradient(135deg, #023E8A 0%, #0077B6 50%, #00B4D8 100%)",
      color: "#ffffff",
      padding: "120px 40px",
      position: "relative",
      overflow: "hidden",
      backgroundSize: "200% 200%",
    },
    heroDecoration: {
      position: "absolute",
      width: "600px",
      height: "600px",
      borderRadius: "50%",
      background: "rgba(255, 255, 255, 0.1)",
      filter: "blur(120px)",
    },
    heroDecorationTop: {
      top: "-250px",
      right: "-150px",
    },
    heroDecorationBottom: {
      bottom: "-250px",
      left: "-150px",
    },
    title: {
      fontSize: "4.5rem",
      fontWeight: "900",
      margin: "0",
      marginBottom: "24px",
      textShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
      letterSpacing: "-2px",
      position: "relative",
      zIndex: 2,
    },
    heroSubtitle: {
      fontSize: "1.5rem",
      margin: "0",
      fontWeight: "400",
      opacity: "0.95",
      lineHeight: "1.6",
      maxWidth: "700px",
      marginLeft: "auto",
      marginRight: "auto",
      position: "relative",
      zIndex: 2,
    },

    // Main Content
    mainContent: {
      background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
      padding: "100px 40px",
      position: "relative",
    },
    contentWrapper: {
      maxWidth: "900px",
      margin: "0 auto",
    },
    companyName: {
      color: "#023E8A",
      fontWeight: "800",
      fontSize: "1.25em",
      background: "linear-gradient(135deg, #023E8A 0%, #0077B6 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    },
    paragraph: {
      fontSize: "1.25rem",
      lineHeight: "2",
      color: "#334155",
      marginBottom: "32px",
      position: "relative",
      textAlign: "left",
    },
    firstParagraph: {
      fontSize: "1.4rem",
      fontWeight: "500",
      color: "#1e293b",
    },
    highlightText: {
      color: "#023E8A",
      fontWeight: "700",
      background: "linear-gradient(135deg, rgba(2, 62, 138, 0.15) 0%, rgba(0, 119, 182, 0.15) 100%)",
      padding: "4px 10px",
      borderRadius: "6px",
      position: "relative",
    },

    // Stats Section
    statsSection: {
      padding: "100px 40px",
      background: "linear-gradient(135deg, #f1f5f9 0%, #e8f4f8 100%)",
      position: "relative",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "40px",
      maxWidth: "1200px",
      margin: "0 auto",
    },
    statCard: {
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      padding: "50px 35px",
      borderRadius: "24px",
      textAlign: "center",
      border: "2px solid #e2e8f0",
      boxShadow: "0 8px 30px rgba(2, 62, 138, 0.08)",
      transition: "all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      position: "relative",
      overflow: "hidden",
      cursor: "default",
    },
    statCardGlow: {
      position: "absolute",
      top: "-50%",
      left: "-50%",
      width: "200%",
      height: "200%",
      background: "radial-gradient(circle, rgba(0, 119, 182, 0.15) 0%, transparent 70%)",
      opacity: 0,
      transition: "opacity 0.4s ease",
    },
    statIcon: {
      fontSize: "4rem",
      marginBottom: "20px",
      display: "block",
      filter: "drop-shadow(0 4px 10px rgba(2, 62, 138, 0.2))",
      transition: "transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    },
    statTitle: {
      fontSize: "1.6rem",
      fontWeight: "700",
      color: "#023E8A",
      margin: "0 0 12px 0",
    },
    statDescription: {
      fontSize: "1.1rem",
      color: "#64748b",
      margin: "0",
      lineHeight: "1.7",
    },

    // Why Choose Us Section
    whyChooseSection: {
      padding: "100px 40px",
      background: "#ffffff",
      position: "relative",
    },
    sectionTitle: {
      color: "#023E8A",
      fontSize: "3.2rem",
      fontWeight: "800",
      textAlign: "center",
      margin: "0 0 20px 0",
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
    featuresList: {
      listStyle: "none",
      padding: "0",
      margin: "0",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
      gap: "25px",
      maxWidth: "1200px",
      marginLeft: "auto",
      marginRight: "auto",
    },
    featureItem: {
      display: "flex",
      alignItems: "center",
      padding: "28px 32px",
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      borderRadius: "16px",
      border: "2px solid #e2e8f0",
      transition: "all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      fontSize: "1.1rem",
      fontWeight: "500",
      color: "#334155",
      boxShadow: "0 4px 15px rgba(2, 62, 138, 0.06)",
      cursor: "default",
      position: "relative",
      overflow: "hidden",
    },
    featureIcon: {
      fontSize: "1.8rem",
      marginRight: "20px",
      minWidth: "36px",
      height: "36px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      color: "#ffffff",
      fontWeight: "bold",
      flexShrink: 0,
      boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
    },

    // Values Section
    valuesSection: {
      padding: "100px 40px",
      background: "linear-gradient(135deg, #023E8A 0%, #0077B6 50%, #00B4D8 100%)",
      position: "relative",
      overflow: "hidden",
    },
    valuesGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
      gap: "40px",
      maxWidth: "1200px",
      margin: "0 auto",
    },
    valueCard: {
      textAlign: "center",
      padding: "45px 35px",
      borderRadius: "24px",
      border: "2px solid rgba(255, 255, 255, 0.2)",
      transition: "all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      background: "rgba(255, 255, 255, 0.1)",
      backdropFilter: "blur(10px)",
      position: "relative",
      overflow: "hidden",
    },
    valueIcon: {
      fontSize: "3.5rem",
      marginBottom: "20px",
      display: "block",
      filter: "drop-shadow(0 4px 15px rgba(255, 255, 255, 0.3))",
      transition: "transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    },
    valueTitle: {
      fontSize: "1.6rem",
      fontWeight: "700",
      color: "#ffffff",
      margin: "0 0 12px 0",
      textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
    },
    valueDescription: {
      fontSize: "1.1rem",
      color: "#ffffff",
      margin: "0",
      lineHeight: "1.7",
      opacity: "0.95",
    },

    // Responsive Design
    '@media (max-width: 768px)': {
      title: { fontSize: "2.8rem" },
      hero: { padding: "80px 20px" },
      mainContent: { padding: "60px 20px" },
      statsSection: { padding: "60px 20px" },
      whyChooseSection: { padding: "60px 20px" },
      valuesSection: { padding: "60px 20px" },
      featuresList: { gridTemplateColumns: "1fr" },
      paragraph: { fontSize: "1.1rem" },
    },
  };

  const stats = [
    {
      icon: "🏍️",
      color: "#023E8A",
      title: "Premium Quality",
      description: "Genuine and high-grade aftermarket parts from trusted global manufacturers"
    },
    {
      icon: "🚚",
      color: "#10b981",
      title: "Island-wide Delivery",
      description: "Fast and reliable delivery service covering all provinces in Sri Lanka"
    },
    {
      icon: "⭐",
      color: "#fbbf24",
      title: "Expert Support",
      description: "Professional guidance from experienced mechanics and parts specialists"
    }
  ];

  const features = [
    "Wide range of genuine and aftermarket spare parts",
    "Nationwide delivery with trusted logistics partners",
    "Competitive pricing and seasonal offers",
    "Experienced team with years of industry expertise",
    "Customer-first service with dedicated support",
    "Quality assurance and warranty on all products"
  ];

  const values = [
    {
      icon: "🎯",
      title: "Reliability",
      description: "Consistent quality and dependable service you can trust for all your motorcycle needs.",
      color: "#023E8A"
    },
    {
      icon: "💎",
      title: "Excellence",
      description: "Commitment to providing the highest quality products and exceptional customer service.",
      color: "#10b981"
    },
    {
      icon: "🤝",
      title: "Trust",
      description: "Building lasting relationships through transparency, honesty, and genuine care for our customers.",
      color: "#fbbf24"
    }
  ];

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <div style={{...styles.heroDecoration, ...styles.heroDecorationTop}}></div>
        <div style={{...styles.heroDecoration, ...styles.heroDecorationBottom}}></div>
        <h1 style={styles.title}>About Us</h1>
        <p style={styles.heroSubtitle}>
          Your trusted partner for quality motorcycle spare parts in Sri Lanka
        </p>
      </div>

      {/* Main Story */}
      <div style={styles.mainContent}>
        <div style={styles.contentWrapper}>
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
      </div>

      {/* Stats Section */}
      <div style={styles.statsSection}>
        <div style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <div 
              key={index}
              style={styles.statCard}
              onMouseEnter={(e) => {
                setHoveredStat(index);
                e.currentTarget.style.transform = "translateY(-12px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0 20px 60px rgba(2, 62, 138, 0.2)";
                e.currentTarget.style.borderColor = "#0077B6";
                const glow = e.currentTarget.querySelector('.stat-glow');
                if (glow) glow.style.opacity = "1";
              }}
              onMouseLeave={(e) => {
                setHoveredStat(null);
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(2, 62, 138, 0.08)";
                e.currentTarget.style.borderColor = "#e2e8f0";
                const glow = e.currentTarget.querySelector('.stat-glow');
                if (glow) glow.style.opacity = "0";
              }}
            >
              <div className="stat-glow" style={styles.statCardGlow}></div>
              <span 
                style={{
                  ...styles.statIcon, 
                  color: stat.color,
                  transform: hoveredStat === index ? "scale(1.2) rotate(5deg)" : "none"
                }}
              >
                {stat.icon}
              </span>
              <h3 style={styles.statTitle}>{stat.title}</h3>
              <p style={styles.statDescription}>{stat.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Us */}
      <div style={styles.whyChooseSection}>
        <h2 style={styles.sectionTitle}>Why Choose Nation Motor Spares?</h2>
        <p style={styles.sectionSubtitle}>Excellence and trust in every transaction</p>
        <ul style={styles.featuresList}>
          {features.map((feature, index) => (
            <li 
              key={index}
              style={styles.featureItem}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateX(8px)";
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(2, 62, 138, 0.15)";
                e.currentTarget.style.borderColor = "#0077B6";
                e.currentTarget.style.background = "linear-gradient(135deg, #ffffff 0%, #e8f4f8 100%)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(2, 62, 138, 0.06)";
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.background = "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)";
              }}
            >
              <span style={styles.featureIcon}>✓</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Values Section */}
      <div style={styles.valuesSection}>
        <div style={{...styles.heroDecoration, ...styles.heroDecorationTop}}></div>
        <div style={{...styles.heroDecoration, ...styles.heroDecorationBottom}}></div>
        <div style={{position: "relative", zIndex: 2}}>
          <h2 style={{...styles.sectionTitle, color: "#ffffff", marginBottom: "20px"}}>
            Our Core Values
          </h2>
          <p style={{...styles.sectionSubtitle, color: "#ffffff", opacity: 0.95}}>
            The principles that guide everything we do
          </p>
          <div style={styles.valuesGrid}>
            {values.map((value, index) => (
              <div 
                key={index}
                style={styles.valueCard}
                onMouseEnter={(e) => {
                  setHoveredValue(index);
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.6)";
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                  e.currentTarget.style.transform = "translateY(-10px) scale(1.03)";
                  e.currentTarget.style.boxShadow = "0 20px 60px rgba(0, 0, 0, 0.3)";
                }}
                onMouseLeave={(e) => {
                  setHoveredValue(null);
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <span 
                  style={{
                    ...styles.valueIcon,
                    transform: hoveredValue === index ? "scale(1.2) rotate(-5deg)" : "none"
                  }}
                >
                  {value.icon}
                </span>
                <h3 style={styles.valueTitle}>{value.title}</h3>
                <p style={styles.valueDescription}>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;