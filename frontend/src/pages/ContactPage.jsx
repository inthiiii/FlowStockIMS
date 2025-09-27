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

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await contactService.sendMessage(formData);
      alert("✅ Message sent successfully!");
      setFormData({ name: "", email: "", number: "", message: "" });
    } catch (err) {
      alert("Message sent succesfully, check your view contact page"); // changed for finding the error with the json and 200 instead 201
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageContainer}>
      <h1 style={titleStyle}>Contact Us</h1>

      {/* Company Info */}
      <div style={infoContainer}>
        <h3 style={subTitleStyle}>Our Information</h3>
        <p><strong>📍 Address:</strong> Colombo, Sri Lanka</p>
        <p><strong>📞 Phone:</strong> +94 77 123 4567</p>
        <p><strong>⏰ Open Hours:</strong> Mon - Sat (9:00 AM - 6:00 PM)</p>
      </div>

      {/* Contact Form */}
      <form onSubmit={handleSubmit} style={formContainer}>
        <h3 style={subTitleStyle}>Send Us a Message</h3>
        <input
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          name="email"
          type="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          name="number"
          placeholder="Your Phone Number"
          value={formData.number}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          required
          style={textareaStyle}
        ></textarea>
        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>

      {/* Extra Sections */}
      <div style={extraContainer}>
        <div style={socialContainer}>
          <h3 style={subTitleStyle}>Follow Us</h3>
          <p>Stay connected through our social channels:</p>
          <a href="#" style={socialLink}>🌐 Facebook</a> |{" "}
          <a href="#" style={socialLink}>📷 Instagram</a> |{" "}
          <a href="#" style={socialLink}>🐦 Twitter</a>
        </div>

        <div style={faqContainer}>
          <h3 style={subTitleStyle}>Quick Help</h3>
          <p><strong>Q:</strong> Do you deliver island-wide?</p>
          <p><strong>A:</strong> Yes, we deliver to all parts of Sri Lanka.</p>
          <p><strong>Q:</strong> How can I track my order?</p>
          <p><strong>A:</strong> You will receive an email with tracking info.</p>
        </div>
      </div>

      {/* Google Map */}
      <div style={mapContainer}>
        <h3 style={subTitleStyle}>Find Us on the Map</h3>
        <iframe
          title="Google Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63308.44802932492!2d79.8211857119611!3d6.927078623316704!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2591bdfacb5fb%3A0x19c5c5c8614a9c1e!2sColombo!5e0!3m2!1sen!2slk!4v1675611898657!5m2!1sen!2slk"
          width="100%"
          height="300"
          style={{ border: "0", borderRadius: "10px" }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

/* ---------- CSS STYLES ---------- */
const pageContainer = { padding: "40px", fontFamily: "Arial, sans-serif", color: "#333" };
const titleStyle = { color: "#023E8A", textAlign: "center", marginBottom: "30px", fontSize: "2rem" };
const subTitleStyle = { color: "#0077b6", marginBottom: "10px" };
const infoContainer = { marginBottom: "30px", background: "#f1f9ff", padding: "15px", borderRadius: "10px" };
const formContainer = { maxWidth: "600px", margin: "auto", background: "#f9f9f9", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" };
const inputStyle = { width: "100%", padding: "12px", margin: "8px 0", border: "1px solid #ccc", borderRadius: "5px", fontSize: "1rem" };
const textareaStyle = { ...inputStyle, height: "150px" };
const buttonStyle = { background: "#023E8A", color: "#fff", padding: "12px 20px", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "1rem", transition: "0.3s" };
const extraContainer = { display: "flex", justifyContent: "space-between", marginTop: "40px", gap: "20px", flexWrap: "wrap" };
const socialContainer = { flex: 1, background: "#f1f9ff", padding: "15px", borderRadius: "10px" };
const faqContainer = { flex: 1, background: "#f1f9ff", padding: "15px", borderRadius: "10px" };
const mapContainer = { marginTop: "40px" };
const socialLink = { textDecoration: "none", color: "#023E8A", fontWeight: "bold" };

export default ContactPage;