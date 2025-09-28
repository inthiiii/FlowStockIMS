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
      setSuccess(true); // Based on your comment about the API behavior
      setFormData({ name: "", email: "", number: "", message: "" });
      setTimeout(() => setSuccess(false), 5000);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
      fontSize: "3rem",
      fontWeight: "700",
      margin: "0",
      marginBottom: "15px",
      textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
    },
    subtitle: {
      fontSize: "1.3rem",
      margin: "0",
      fontWeight: "300",
      opacity: "0.9",
    },
    mainContent: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "40px",
      marginBottom: "50px",
    },
    infoSection: {
      backgroundColor: "#f8f9fa",
      padding: "40px",
      borderRadius: "15px",
      border: "1px solid #e9ecef",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
    },
    sectionTitle: {
      color: "#023E8A",
      fontSize: "1.8rem",
      fontWeight: "600",
      margin: "0 0 30px 0",
      paddingBottom: "15px",
      borderBottom: "3px solid #e9ecef",
    },
    infoItem: {
      display: "flex",
      alignItems: "center",
      marginBottom: "20px",
      padding: "15px",
      backgroundColor: "#ffffff",
      borderRadius: "10px",
      border: "1px solid #e9ecef",
      transition: "all 0.3s ease",
    },
    infoItemHover: {
      boxShadow: "0 4px 12px rgba(2, 62, 138, 0.1)",
      transform: "translateY(-2px)",
    },
    infoIcon: {
      fontSize: "1.5rem",
      marginRight: "15px",
      minWidth: "30px",
    },
    infoText: {
      margin: "0",
      fontSize: "1rem",
      color: "#495057",
    },
    infoLabel: {
      fontWeight: "600",
      color: "#023E8A",
      marginRight: "8px",
    },
    formContainer: {
      backgroundColor: "#f8f9fa",
      padding: "40px",
      borderRadius: "15px",
      border: "1px solid #e9ecef",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "25px",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
    },
    label: {
      color: "#023E8A",
      fontSize: "0.95rem",
      fontWeight: "600",
      marginBottom: "8px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    input: {
      padding: "15px 20px",
      border: "2px solid #e9ecef",
      borderRadius: "10px",
      fontSize: "1rem",
      fontFamily: "inherit",
      transition: "all 0.3s ease",
      backgroundColor: "#ffffff",
      outline: "none",
    },
    textarea: {
      padding: "15px 20px",
      border: "2px solid #e9ecef",
      borderRadius: "10px",
      fontSize: "1rem",
      fontFamily: "inherit",
      transition: "all 0.3s ease",
      backgroundColor: "#ffffff",
      outline: "none",
      resize: "vertical",
      minHeight: "120px",
    },
    inputFocus: {
      borderColor: "#023E8A",
      boxShadow: "0 0 0 3px rgba(2, 62, 138, 0.1)",
    },
    button: {
      backgroundColor: "#023E8A",
      color: "#ffffff",
      padding: "18px 30px",
      border: "none",
      borderRadius: "10px",
      fontSize: "1.1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      position: "relative",
      overflow: "hidden",
    },
    buttonHover: {
      backgroundColor: "#012a5c",
      transform: "translateY(-2px)",
      boxShadow: "0 6px 20px rgba(2, 62, 138, 0.4)",
    },
    buttonDisabled: {
      backgroundColor: "#6c757d",
      cursor: "not-allowed",
      transform: "none",
      boxShadow: "none",
    },
    successMessage: {
      backgroundColor: "#d1edff",
      color: "#0c5460",
      padding: "15px 20px",
      borderRadius: "10px",
      border: "1px solid #bee5eb",
      fontSize: "1rem",
      fontWeight: "500",
      marginBottom: "20px",
      textAlign: "center",
    },
    loadingSpinner: {
      display: "inline-block",
      width: "20px",
      height: "20px",
      border: "2px solid #ffffff",
      borderTop: "2px solid transparent",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      marginRight: "10px",
    },
    bottomSections: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "40px",
      marginBottom: "50px",
    },
    socialSection: {
      backgroundColor: "#f8f9fa",
      padding: "30px",
      borderRadius: "15px",
      border: "1px solid #e9ecef",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
    },
    faqSection: {
      backgroundColor: "#f8f9fa",
      padding: "30px",
      borderRadius: "15px",
      border: "1px solid #e9ecef",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
    },
    socialLinks: {
      display: "flex",
      gap: "20px",
      marginTop: "20px",
      flexWrap: "wrap",
    },
    socialLink: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      textDecoration: "none",
      color: "#023E8A",
      fontWeight: "600",
      padding: "10px 15px",
      backgroundColor: "#ffffff",
      borderRadius: "25px",
      border: "2px solid #e9ecef",
      transition: "all 0.3s ease",
      fontSize: "0.95rem",
    },
    socialLinkHover: {
      borderColor: "#023E8A",
      backgroundColor: "#023E8A",
      color: "#ffffff",
      transform: "translateY(-2px)",
    },
    faqItem: {
      marginBottom: "20px",
      padding: "15px",
      backgroundColor: "#ffffff",
      borderRadius: "10px",
      border: "1px solid #e9ecef",
    },
    faqQuestion: {
      fontWeight: "600",
      color: "#023E8A",
      margin: "0 0 8px 0",
      fontSize: "1rem",
    },
    faqAnswer: {
      color: "#495057",
      margin: "0",
      fontSize: "0.95rem",
      lineHeight: "1.5",
    },
    mapSection: {
      backgroundColor: "#f8f9fa",
      padding: "30px",
      borderRadius: "15px",
      border: "1px solid #e9ecef",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
    },
    mapFrame: {
      border: "none",
      borderRadius: "15px",
      width: "100%",
      height: "350px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    },
    '@media (max-width: 768px)': {
      mainContent: {
        gridTemplateColumns: "1fr",
      },
      bottomSections: {
        gridTemplateColumns: "1fr",
      },
      hero: {
        padding: "40px 20px",
      },
      title: {
        fontSize: "2.2rem",
      },
      socialLinks: {
        justifyContent: "center",
      },
    },
  };

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.hero}>
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
              e.currentTarget.style.boxShadow = styles.infoItemHover.boxShadow;
              e.currentTarget.style.transform = styles.infoItemHover.transform;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "none";
            }}
          >
            <span style={styles.infoIcon}>📍</span>
            <p style={styles.infoText}>
              <span style={styles.infoLabel}>Address:</span>
              Colombo, Sri Lanka
            </p>
          </div>

          <div 
            style={styles.infoItem}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = styles.infoItemHover.boxShadow;
              e.currentTarget.style.transform = styles.infoItemHover.transform;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "none";
            }}
          >
            <span style={styles.infoIcon}>📞</span>
            <p style={styles.infoText}>
              <span style={styles.infoLabel}>Phone:</span>
              +94 77 123 4567
            </p>
          </div>

          <div 
            style={styles.infoItem}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = styles.infoItemHover.boxShadow;
              e.currentTarget.style.transform = styles.infoItemHover.transform;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "none";
            }}
          >
            <span style={styles.infoIcon}>⏰</span>
            <p style={styles.infoText}>
              <span style={styles.infoLabel}>Hours:</span>
              Mon - Sat (9:00 AM - 6:00 PM)
            </p>
          </div>

          <div 
            style={styles.infoItem}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = styles.infoItemHover.boxShadow;
              e.currentTarget.style.transform = styles.infoItemHover.transform;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "none";
            }}
          >
            <span style={styles.infoIcon}>📧</span>
            <p style={styles.infoText}>
              <span style={styles.infoLabel}>Email:</span>
              info@company.lk
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div style={styles.formContainer}>
          <h3 style={styles.sectionTitle}>Send Us a Message</h3>
          
          {success && (
            <div style={styles.successMessage}>
              ✅ Message sent successfully! We'll get back to you soon.
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
                style={styles.input}
                onFocus={(e) => {
                  e.target.style.borderColor = styles.inputFocus.borderColor;
                  e.target.style.boxShadow = styles.inputFocus.boxShadow;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = styles.input.borderColor;
                  e.target.style.boxShadow = "none";
                }}
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
                style={styles.input}
                onFocus={(e) => {
                  e.target.style.borderColor = styles.inputFocus.borderColor;
                  e.target.style.boxShadow = styles.inputFocus.boxShadow;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = styles.input.borderColor;
                  e.target.style.boxShadow = "none";
                }}
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
                style={styles.input}
                onFocus={(e) => {
                  e.target.style.borderColor = styles.inputFocus.borderColor;
                  e.target.style.boxShadow = styles.inputFocus.boxShadow;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = styles.input.borderColor;
                  e.target.style.boxShadow = "none";
                }}
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
                style={styles.textarea}
                onFocus={(e) => {
                  e.target.style.borderColor = styles.inputFocus.borderColor;
                  e.target.style.boxShadow = styles.inputFocus.boxShadow;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = styles.textarea.borderColor;
                  e.target.style.boxShadow = "none";
                }}
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
                  e.target.style.backgroundColor = styles.buttonHover.backgroundColor;
                  e.target.style.transform = styles.buttonHover.transform;
                  e.target.style.boxShadow = styles.buttonHover.boxShadow;
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = styles.button.backgroundColor;
                  e.target.style.transform = "none";
                  e.target.style.boxShadow = "none";
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
          <p style={{color: '#6c757d', marginBottom: '20px'}}>
            Stay connected through our social channels for updates and news
          </p>
          <div style={styles.socialLinks}>
            <a 
              href="#" 
              style={styles.socialLink}
              onMouseEnter={(e) => {
                e.target.style.borderColor = styles.socialLinkHover.borderColor;
                e.target.style.backgroundColor = styles.socialLinkHover.backgroundColor;
                e.target.style.color = styles.socialLinkHover.color;
                e.target.style.transform = styles.socialLinkHover.transform;
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = styles.socialLink.borderColor;
                e.target.style.backgroundColor = styles.socialLink.backgroundColor;
                e.target.style.color = styles.socialLink.color;
                e.target.style.transform = "none";
              }}
            >
              🌐 Facebook
            </a>
            <a 
              href="#" 
              style={styles.socialLink}
              onMouseEnter={(e) => {
                e.target.style.borderColor = styles.socialLinkHover.borderColor;
                e.target.style.backgroundColor = styles.socialLinkHover.backgroundColor;
                e.target.style.color = styles.socialLinkHover.color;
                e.target.style.transform = styles.socialLinkHover.transform;
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = styles.socialLink.borderColor;
                e.target.style.backgroundColor = styles.socialLink.backgroundColor;
                e.target.style.color = styles.socialLink.color;
                e.target.style.transform = "none";
              }}
            >
              📷 Instagram
            </a>
            <a 
              href="#" 
              style={styles.socialLink}
              onMouseEnter={(e) => {
                e.target.style.borderColor = styles.socialLinkHover.borderColor;
                e.target.style.backgroundColor = styles.socialLinkHover.backgroundColor;
                e.target.style.color = styles.socialLinkHover.color;
                e.target.style.transform = styles.socialLinkHover.transform;
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = styles.socialLink.borderColor;
                e.target.style.backgroundColor = styles.socialLink.backgroundColor;
                e.target.style.color = styles.socialLink.color;
                e.target.style.transform = "none";
              }}
            >
              🐦 Twitter
            </a>
          </div>
        </div>

        {/* FAQ */}
        <div style={styles.faqSection}>
          <h3 style={styles.sectionTitle}>Quick Help</h3>
          <div style={styles.faqItem}>
            <p style={styles.faqQuestion}>Do you deliver island-wide?</p>
            <p style={styles.faqAnswer}>Yes, we deliver to all parts of Sri Lanka with reliable shipping partners.</p>
          </div>
          <div style={styles.faqItem}>
            <p style={styles.faqQuestion}>How can I track my order?</p>
            <p style={styles.faqAnswer}>You will receive an email with tracking information once your order is dispatched.</p>
          </div>
          <div style={styles.faqItem}>
            <p style={styles.faqQuestion}>What are your payment methods?</p>
            <p style={styles.faqAnswer}>We accept cash on delivery, bank transfers, and online payments.</p>
          </div>
        </div>
      </div>

      {/* Google Map */}
      <div style={styles.mapSection}>
        <h3 style={styles.sectionTitle}>Find Us on the Map</h3>
        <iframe
          title="Google Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63308.44802932492!2d79.8211857119611!3d6.927078623316704!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2591bdfacb5fb%3A0x19c5c5c8614a9c1e!2sColombo!5e0!3m2!1sen!2slk!4v1675611898657!5m2!1sen!2slk"
          style={styles.mapFrame}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
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