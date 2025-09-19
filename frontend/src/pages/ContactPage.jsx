import React, { useState } from "react";
import contactService from "../services/contactService";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    message: "",
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await contactService.sendMessage(formData);
    alert("Message sent successfully!");
    setFormData({ name: "", email: "", number: "", message: "" });
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1 style={{ color: "#023E8A" }}>Contact Us</h1>

      {/* Company Info */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Our Information</h3>
        <p><strong>Address:</strong> Colombo, Sri Lanka</p>
        <p><strong>Phone:</strong> +94 77 123 4567</p>
        <p><strong>Open Hours:</strong> Mon - Sat (9:00 AM - 6:00 PM)</p>
      </div>

      {/* Contact Form */}
      <form onSubmit={handleSubmit} style={{ maxWidth: "500px" }}>
        <input name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required style={inputStyle} />
        <input name="email" type="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required style={inputStyle} />
        <input name="number" placeholder="Your Phone Number" value={formData.number} onChange={handleChange} required style={inputStyle} />
        <textarea name="message" placeholder="Your Message" value={formData.message} onChange={handleChange} required style={textareaStyle}></textarea>
        <button type="submit" style={buttonStyle}>Send Message</button>
      </form>
    </div>
  );
};

const inputStyle = { width: "100%", padding: "10px", margin: "8px 0", border: "1px solid #ccc", borderRadius: "5px" };
const textareaStyle = { ...inputStyle, height: "120px" };
const buttonStyle = { background: "#023E8A", color: "#fff", padding: "10px 15px", border: "none", borderRadius: "5px", cursor: "pointer" };

export default ContactPage;