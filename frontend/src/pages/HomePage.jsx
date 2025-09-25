import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  // Hardcoded products
  const topProducts = [
    { id: 1, name: "Brake Disc", image: "https://via.placeholder.com/150", price: "LKR 2,500" },
    { id: 2, name: "Chain Set", image: "https://via.placeholder.com/150", price: "LKR 4,000" },
    { id: 3, name: "Headlight Assembly", image: "https://via.placeholder.com/150", price: "LKR 3,200" },
    { id: 4, name: "Clutch Plate", image: "https://via.placeholder.com/150", price: "LKR 1,800" },
    { id: 5, name: "Oil Filter", image: "https://via.placeholder.com/150", price: "LKR 950" },
  ];

  // Hardcoded testimonials
  const testimonials = [
    { id: 1, name: "Kamal Perera", feedback: "Nation Motor Spares always has the parts I need. Excellent service!" },
    { id: 2, name: "Nimal Fernando", feedback: "Quick delivery and affordable prices. Highly recommended!" },
    { id: 3, name: "Samantha Jayasinghe", feedback: "Friendly staff and genuine parts. I trust them completely." },
  ];

  return (
    <div style={pageContainer}>
      {/* Hero Banner */}
      <section style={heroSection}>
        <div style={heroContent}>
          <h1 style={heroTitle}>Nation Motor Spares</h1>
          <p style={heroSubtitle}>Your trusted motorcycle spare parts supplier in Colombo</p>
          <button style={heroButton} onClick={() => navigate("/products")}>Shop Now</button>
        </div>
      </section>

      {/* Highlights / Why Choose Us */}
      <section style={highlightSection}>
        <h2 style={sectionTitle}>Why Choose Us?</h2>
        <ul style={highlightList}>
          <li>✔ Wide range of genuine and aftermarket spare parts</li>
          <li>✔ Nationwide delivery with trusted logistics</li>
          <li>✔ Affordable pricing and seasonal offers</li>
          <li>✔ Experienced team with years of industry expertise</li>
          <li>✔ Customer-first service with 24/7 support</li>
        </ul>
      </section>

      {/* Top Selling Products */}
      <section style={productSection}>
        <h2 style={sectionTitle}>Top Selling Products</h2>
        <div style={productGrid}>
          {topProducts.map((product) => (
            <div key={product.id} style={productCard}>
              <img src={product.image} alt={product.name} style={productImage} />
              <h3 style={productName}>{product.name}</h3>
              <p style={productPrice}>{product.price}</p>
              <button style={productButton} onClick={() => navigate("/products")}>View Product</button>
            </div>
          ))}
        </div>
      </section>

      {/* About Preview */}
      <section style={aboutPreviewSection}>
        <h2 style={sectionTitle}>About Nation Motor Spares</h2>
        <p style={aboutText}>
          Nation Motor Spares is Sri Lanka’s leading motorcycle spare parts supplier, delivering high-quality and reliable products across the country. Our mission is to make top-quality spare parts accessible to everyone, whether you are a professional mechanic or an everyday rider.
        </p>
        <button style={aboutButton} onClick={() => navigate("/about")}>Read More</button>
      </section>

      {/* Customer Testimonials */}
      <section style={testimonialSection}>
        <h2 style={sectionTitle}>What Our Customers Say</h2>
        <div style={testimonialGrid}>
          {testimonials.map((t) => (
            <div key={t.id} style={testimonialCard}>
              <p style={testimonialFeedback}>"{t.feedback}"</p>
              <p style={testimonialName}>- {t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section style={ctaSection}>
        <h2 style={ctaTitle}>Need help finding the right part?</h2>
        <p style={ctaSubtitle}>Contact us today and our experts will assist you!</p>
        <button style={ctaButton} onClick={() => navigate("/contact")}>Contact Us</button>
      </section>
    </div>
  );
};

/* ---------- CSS Styles ---------- */
const pageContainer = { fontFamily: "Arial, sans-serif", color: "#333", lineHeight: "1.6" };
const heroSection = { background: "#023E8A", color: "#fff", padding: "100px 20px", textAlign: "center" };
const heroContent = { maxWidth: "800px", margin: "0 auto" };
const heroTitle = { fontSize: "3rem", marginBottom: "20px" };
const heroSubtitle = { fontSize: "1.5rem", marginBottom: "30px" };
const heroButton = { background: "#fff", color: "#023E8A", border: "none", padding: "15px 30px", fontSize: "1.2rem", borderRadius: "8px", cursor: "pointer" };

const highlightSection = { padding: "60px 20px", background: "#f1f9ff", textAlign: "center" };
const sectionTitle = { fontSize: "2rem", color: "#023E8A", marginBottom: "20px" };
const highlightList = { listStyle: "none", padding: 0, fontSize: "1.1rem", maxWidth: "700px", margin: "0 auto" };

const productSection = { padding: "60px 20px", textAlign: "center" };
const productGrid = { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px" };
const productCard = { background: "#f9f9f9", padding: "20px", borderRadius: "10px", width: "200px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" };
const productImage = { width: "100%", borderRadius: "8px" };
const productName = { fontSize: "1.2rem", margin: "10px 0" };
const productPrice = { color: "#0077b6", marginBottom: "10px" };
const productButton = { background: "#023E8A", color: "#fff", border: "none", padding: "10px 15px", borderRadius: "5px", cursor: "pointer" };

const aboutPreviewSection = { padding: "60px 20px", background: "#f1f9ff", textAlign: "center" };
const aboutText = { maxWidth: "700px", margin: "0 auto 20px auto" };
const aboutButton = { background: "#023E8A", color: "#fff", border: "none", padding: "12px 20px", borderRadius: "5px", cursor: "pointer" };

const testimonialSection = { padding: "60px 20px", textAlign: "center" };
const testimonialGrid = { display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "20px" };
const testimonialCard = { background: "#f9f9f9", padding: "20px", borderRadius: "10px", width: "250px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" };
const testimonialFeedback = { fontStyle: "italic" };
const testimonialName = { fontWeight: "bold", marginTop: "10px" };

const ctaSection = { padding: "60px 20px", background: "#023E8A", color: "#fff", textAlign: "center" };
const ctaTitle = { fontSize: "2rem", marginBottom: "15px" };
const ctaSubtitle = { fontSize: "1.2rem", marginBottom: "25px" };
const ctaButton = { background: "#fff", color: "#023E8A", border: "none", padding: "12px 25px", borderRadius: "8px", fontSize: "1rem", cursor: "pointer" };

export default HomePage;