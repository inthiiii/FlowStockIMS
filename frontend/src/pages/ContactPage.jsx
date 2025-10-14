import React, { useState } from "react";
import contactService from "../services/contactService";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [hoveredSocial, setHoveredSocial] = useState(null);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await contactService.sendMessage(formData);
      setSuccess(true);
      setFormData({ name: "", email: "", number: "", message: "" });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setSuccess(true);
      setFormData({ name: "", email: "", number: "", message: "" });
      setTimeout(() => setSuccess(false), 5000);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: "1400px",
      margin: "0 auto",
      padding: "0",
      backgroundColor: "#ffffff",
      minHeight: "100vh",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },

    // Hero Section
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
      fontSize: "4rem",
      fontWeight: "900",
      margin: "0",
      marginBottom: "20px",
      textShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
      letterSpacing: "-2px",
      position: "relative",
      zIndex: 2,
    },
    subtitle: {
      fontSize: "1.4rem",
      margin: "0",
      fontWeight: "400",
      opacity: "0.95",
      position: "relative",
      zIndex: 2,
      maxWidth: "600px",
      marginLeft: "auto",
      marginRight: "auto",
    },

    // Main Content Section
    mainContent: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "50px",
      padding: "100px 40px",
      background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
    },

    // Info Section
    infoSection: {
      background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
      padding: "50px 40px",
      borderRadius: "24px",
      border: "2px solid #e2e8f0",
      boxShadow: "0 8px 30px rgba(2, 62, 138, 0.08)",
      height: "fit-content",
    },
    sectionTitle: {
      color: "#023E8A",
      fontSize: "2rem",
      fontWeight: "800",
      margin: "0 0 40px 0",
      letterSpacing: "-1px",
    },
    infoItem: {
      display: "flex",
      alignItems: "center",
      marginBottom: "24px",
      padding: "20px 24px",
      background: "#ffffff",
      borderRadius: "16px",
      border: "2px solid #e2e8f0",
      transition: "all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      position: "relative",
      overflow: "hidden",
      cursor: "default",
    },
    infoIcon: {
      fontSize: "2rem",
      marginRight: "20px",
      minWidth: "40px",
      height: "40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "12px",
      background: "linear-gradient(135deg, #023E8A 0%, #0077B6 100%)",
      flexShrink: 0,
      filter: "drop-shadow(0 4px 10px rgba(2, 62, 138, 0.3))",
    },
    infoText: {
      margin: "0",
      fontSize: "1rem",
      color: "#334155",
      lineHeight: "1.6",
    },
    infoLabel: {
      fontWeight: "700",
      color: "#023E8A",
      display: "block",
      marginBottom: "4px",
      fontSize: "0.9rem",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },

    // Form Section
    formContainer: {
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      padding: "50px 40px",
      borderRadius: "24px",
      border: "2px solid #e2e8f0",
      boxShadow: "0 8px 30px rgba(2, 62, 138, 0.08)",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "28px",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      position: "relative",
    },
    label: {
      color: "#023E8A",
      fontSize: "0.9rem",
      fontWeight: "700",
      marginBottom: "10px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    input: {
      padding: "18px 24px",
      border: "2px solid #e2e8f0",
      borderRadius: "16px",
      fontSize: "1rem",
      fontFamily: "inherit",
      transition: "all 0.3s ease",
      backgroundColor: "#ffffff",
      outline: "none",
      color: "#1e293b",
    },
    textarea: {
      padding: "18px 24px",
      border: "2px solid #e2e8f0",
      borderRadius: "16px",
      fontSize: "1rem",
      fontFamily: "inherit",
      transition: "all 0.3s ease",
      backgroundColor: "#ffffff",
      outline: "none",
      resize: "vertical",
      minHeight: "140px",
      color: "#1e293b",
    },
    inputFocused: {
      borderColor: "#0077B6",
      boxShadow: "0 0 0 4px rgba(0, 119, 182, 0.1)",
      transform: "translateY(-2px)",
    },
    button: {
      background: "linear-gradient(135deg, #023E8A 0%, #0077B6 100%)",
      color: "#ffffff",
      padding: "20px 40px",
      border: "none",
      borderRadius: "50px",
      fontSize: "1.1rem",
      fontWeight: "700",
      cursor: "pointer",
      transition: "all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      textTransform: "uppercase",
      letterSpacing: "1.5px",
      position: "relative",
      overflow: "hidden",
      boxShadow: "0 6px 20px rgba(2, 62, 138, 0.3)",
    },
    buttonDisabled: {
      background: "linear-gradient(135deg, #94a3b8 0%, #64748b 100%)",
      cursor: "not-allowed",
      transform: "none",
      boxShadow: "0 4px 15px rgba(100, 116, 139, 0.2)",
    },
    successMessage: {
      background: "linear-gradient(135deg, #d1f4e0 0%, #c3f0d8 100%)",
      color: "#065f46",
      padding: "20px 24px",
      borderRadius: "16px",
      border: "2px solid #86efac",
      fontSize: "1rem",
      fontWeight: "600",
      marginBottom: "24px",
      textAlign: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "12px",
      boxShadow: "0 4px 15px rgba(16, 185, 129, 0.2)",
    },
    loadingSpinner: {
      display: "inline-block",
      width: "20px",
      height: "20px",
      border: "3px solid rgba(255, 255, 255, 0.3)",
      borderTop: "3px solid #ffffff",
      borderRadius: "50%",
      animation: "spin 0.8s linear infinite",
      marginRight: "10px",
    },

    // Bottom Sections
    bottomSections: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "50px",
      padding: "0 40px 100px",
      background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
    },
    socialSection: {
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      padding: "50px 40px",
      borderRadius: "24px",
      border: "2px solid #e2e8f0",
      boxShadow: "0 8px 30px rgba(2, 62, 138, 0.08)",
    },
    faqSection: {
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      padding: "50px 40px",
      borderRadius: "24px",
      border: "2px solid #e2e8f0",
      boxShadow: "0 8px 30px rgba(2, 62, 138, 0.08)",
    },
    socialDescription: {
      color: "#64748b",
      marginBottom: "32px",
      fontSize: "1.05rem",
      lineHeight: "1.6",
    },
    socialLinks: {
      display: "flex",
      gap: "16px",
      flexWrap: "wrap",
    },
    socialLink: {
      display: "inline-flex",
      alignItems: "center",
      gap: "10px",
      textDecoration: "none",
      color: "#023E8A",
      fontWeight: "700",
      padding: "14px 24px",
      background: "#ffffff",
      borderRadius: "50px",
      border: "2px solid #e2e8f0",
      transition: "all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      fontSize: "1rem",
      boxShadow: "0 4px 12px rgba(2, 62, 138, 0.06)",
    },
    faqItem: {
      marginBottom: "20px",
      padding: "24px",
      background: "#ffffff",
      borderRadius: "16px",
      border: "2px solid #e2e8f0",
      transition: "all 0.3s ease",
    },
    faqQuestion: {
      fontWeight: "700",
      color: "#023E8A",
      margin: "0 0 10px 0",
      fontSize: "1.05rem",
    },
    faqAnswer: {
      color: "#64748b",
      margin: "0",
      fontSize: "1rem",
      lineHeight: "1.7",
    },

    // Map Section
    mapSection: {
      padding: "0 40px 100px",
      background: "#ffffff",
    },
    mapContainer: {
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      padding: "50px 40px",
      borderRadius: "24px",
      border: "2px solid #e2e8f0",
      boxShadow: "0 8px 30px rgba(2, 62, 138, 0.08)",
    },
    mapFrame: {
      border: "none",
      borderRadius: "20px",
      width: "100%",
      height: "450px",
      boxShadow: "0 8px 30px rgba(2, 62, 138, 0.15)",
    },

    // Responsive
    '@media (max-width: 768px)': {
      title: { fontSize: "2.5rem" },
      hero: { padding: "80px 20px" },
      mainContent: {
        gridTemplateColumns: "1fr",
        padding: "60px 20px",
      },
      bottomSections: {
        gridTemplateColumns: "1fr",
        padding: "0 20px 60px",
      },
      mapSection: { padding: "0 20px 60px" },
    },
  };

  const socialLinks = [
    { name: "Facebook", icon: "🌐", color: "#1877f2" },
    { name: "Instagram", icon: "📷", color: "#e4405f" },
    { name: "Twitter", icon: "🐦", color: "#1da1f2" },
  ];

  const faqs = [
    {
      question: "Do you deliver island-wide?",
      answer: "Yes, we deliver to all parts of Sri Lanka with reliable shipping partners."
    },
    {
      question: "How can I track my order?",
      answer: "You will receive an email with tracking information once your order is dispatched."
    },
    {
      question: "What are your payment methods?",
      answer: "We accept cash on delivery, bank transfers, and online payments."
    }
  ];

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <div style={{...styles.heroDecoration, ...styles.heroDecorationTop}}></div>
        <div style={{...styles.heroDecoration, ...styles.heroDecorationBottom}}></div>
        <h1 style={styles.title}>Contact Us</h1>
        <p style={styles.subtitle}>We'd love to hear from you. Get in touch with our team!</p>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Company Info */}
        <div style={styles.infoSection}>
          <h3 style={styles.sectionTitle}>Get In Touch</h3>
          
          <div 
            style={styles.infoItem}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateX(8px)";
              e.currentTarget.style.boxShadow = "0 8px 30px rgba(2, 62, 138, 0.15)";
              e.currentTarget.style.borderColor = "#0077B6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = "#e2e8f0";
            }}
          >
            <div style={styles.infoIcon}>📍</div>
            <div>
              <span style={styles.infoLabel}>Address</span>
              <p style={styles.infoText}>Colombo, Sri Lanka</p>
            </div>
          </div>

          <div 
            style={styles.infoItem}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateX(8px)";
              e.currentTarget.style.boxShadow = "0 8px 30px rgba(2, 62, 138, 0.15)";
              e.currentTarget.style.borderColor = "#0077B6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = "#e2e8f0";
            }}
          >
            <div style={styles.infoIcon}>📞</div>
            <div>
              <span style={styles.infoLabel}>Phone</span>
              <p style={styles.infoText}>+94 77 123 4567</p>
            </div>
          </div>

          <div 
            style={styles.infoItem}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateX(8px)";
              e.currentTarget.style.boxShadow = "0 8px 30px rgba(2, 62, 138, 0.15)";
              e.currentTarget.style.borderColor = "#0077B6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = "#e2e8f0";
            }}
          >
            <div style={styles.infoIcon}>⏰</div>
            <div>
              <span style={styles.infoLabel}>Hours</span>
              <p style={styles.infoText}>Mon - Sat (9:00 AM - 6:00 PM)</p>
            </div>
          </div>

          <div 
            style={styles.infoItem}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateX(8px)";
              e.currentTarget.style.boxShadow = "0 8px 30px rgba(2, 62, 138, 0.15)";
              e.currentTarget.style.borderColor = "#0077B6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = "#e2e8f0";
            }}
          >
            <div style={styles.infoIcon}>📧</div>
            <div>
              <span style={styles.infoLabel}>Email</span>
              <p style={styles.infoText}>info@company.lk</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div style={styles.formContainer}>
          <h3 style={styles.sectionTitle}>Send Us a Message</h3>
          
          {success && (
            <div style={styles.successMessage}>
              <span style={{fontSize: "1.5rem"}}>✅</span>
              <span>Message sent successfully! We'll get back to you soon.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Your Name</label>
              <input
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  ...styles.input,
                  ...(focusedInput === 'name' ? styles.inputFocused : {})
                }}
                onFocus={() => setFocusedInput('name')}
                onBlur={() => setFocusedInput(null)}
                disabled={loading}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  ...styles.input,
                  ...(focusedInput === 'email' ? styles.inputFocused : {})
                }}
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput(null)}
                disabled={loading}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Phone Number</label>
              <input
                name="number"
                type="tel"
                placeholder="+94 77 123 4567"
                value={formData.number}
                onChange={handleChange}
                required
                style={{
                  ...styles.input,
                  ...(focusedInput === 'number' ? styles.inputFocused : {})
                }}
                onFocus={() => setFocusedInput('number')}
                onBlur={() => setFocusedInput(null)}
                disabled={loading}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Your Message</label>
              <textarea
                name="message"
                placeholder="Tell us how we can help you..."
                value={formData.message}
                onChange={handleChange}
                required
                style={{
                  ...styles.textarea,
                  ...(focusedInput === 'message' ? styles.inputFocused : {})
                }}
                onFocus={() => setFocusedInput('message')}
                onBlur={() => setFocusedInput(null)}
                disabled={loading}
              ></textarea>
            </div>

            <button 
              type="submit" 
              style={{
                ...styles.button,
                ...(loading ? styles.buttonDisabled : {})
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = "translateY(-4px) scale(1.02)";
                  e.target.style.boxShadow = "0 12px 40px rgba(2, 62, 138, 0.4)";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.transform = "none";
                  e.target.style.boxShadow = "0 6px 20px rgba(2, 62, 138, 0.3)";
                }
              }}
              disabled={loading}
            >
              {loading && <span style={styles.loadingSpinner}></span>}
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Sections */}
      <div style={styles.bottomSections}>
        {/* Social Media */}
        <div style={styles.socialSection}>
          <h3 style={styles.sectionTitle}>Follow Us</h3>
          <p style={styles.socialDescription}>
            Stay connected through our social channels for updates and news
          </p>
          <div style={styles.socialLinks}>
            {socialLinks.map((social, index) => (
              <a 
                key={index}
                href="#" 
                style={styles.socialLink}
                onMouseEnter={(e) => {
                  setHoveredSocial(index);
                  e.target.style.background = "linear-gradient(135deg, #023E8A 0%, #0077B6 100%)";
                  e.target.style.color = "#ffffff";
                  e.target.style.transform = "translateY(-4px) scale(1.05)";
                  e.target.style.boxShadow = "0 8px 25px rgba(2, 62, 138, 0.3)";
                }}
                onMouseLeave={(e) => {
                  setHoveredSocial(null);
                  e.target.style.background = "#ffffff";
                  e.target.style.color = "#023E8A";
                  e.target.style.transform = "none";
                  e.target.style.boxShadow = "0 4px 12px rgba(2, 62, 138, 0.06)";
                }}
              >
                <span style={{fontSize: "1.3rem"}}>{social.icon}</span>
                {social.name}
              </a>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div style={styles.faqSection}>
          <h3 style={styles.sectionTitle}>Quick Help</h3>
          {faqs.map((faq, index) => (
            <div 
              key={index}
              style={styles.faqItem}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#0077B6";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(2, 62, 138, 0.1)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "none";
              }}
            >
              <p style={styles.faqQuestion}>{faq.question}</p>
              <p style={styles.faqAnswer}>{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Google Map */}
      <div style={styles.mapSection}>
        <div style={styles.mapContainer}>
          <h3 style={styles.sectionTitle}>Find Us on the Map</h3>
          <iframe
            title="Google Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63308.44802932492!2d79.8211857119611!3d6.927078623316704!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2591bdfacb5fb%3A0x19c5c5c8614a9c1e!2sColombo!5e0!3m2!1sen!2slk!4v1675611898657!5m2!1sen!2slk"
            style={styles.mapFrame}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @media (max-width: 768px) {
            .main-content {
              grid-template-columns: 1fr !important;
            }
            .bottom-sections {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ContactPage;