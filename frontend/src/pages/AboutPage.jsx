import React from "react";

const AboutPage = () => {
  return (
    <div
      style={{
        padding: "50px",
        maxWidth: "900px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
        lineHeight: "1.8",
        color: "#333",
      }}
    >
      <h1
        style={{
          color: "#023E8A",
          fontSize: "2.5rem",
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        About Us
      </h1>

      <p style={{ fontSize: "1.1rem", textAlign: "justify" }}>
        <strong>Nation Motor Spares</strong> is Sri Lanka’s leading motorcycle
        spare parts supplier, delivering high-quality and reliable products
        across the country. With years of expertise and a trusted network, we
        ensure that riders and mechanics always get the right part at the right
        time.
      </p>

      <p style={{ fontSize: "1.1rem", textAlign: "justify" }}>
        We specialize in a wide range of motorcycle components, from essential
        engine parts to stylish accessories, ensuring every rider can maintain
        both performance and safety. Our mission is to make top-quality spare
        parts accessible to everyone, whether you are a professional mechanic or
        an everyday rider.
      </p>

      <p style={{ fontSize: "1.1rem", textAlign: "justify" }}>
        Over the years, Nation Motor Spares has built a reputation for{" "}
        <strong>trust, reliability, and affordability</strong>. Our partnerships
        with global manufacturers allow us to bring international standards to
        the local market, while our dedicated customer support team is always
        ready to guide you in finding the perfect fit for your motorcycle.
      </p>

      <div
        style={{
          backgroundColor: "#F1F9FF",
          padding: "20px",
          borderRadius: "12px",
          marginTop: "30px",
          textAlign: "center",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ color: "#0077B6", marginBottom: "10px" }}>
          Why Choose Us?
        </h2>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            fontSize: "1.05rem",
            lineHeight: "1.7",
          }}
        >
          <li>✔ Wide range of genuine and aftermarket spare parts</li>
          <li>✔ Nationwide delivery with trusted logistics</li>
          <li>✔ Affordable pricing and seasonal offers</li>
          <li>✔ Experienced team with years of industry expertise</li>
          <li>✔ Customer-first service with 24/7 support</li>
        </ul>
      </div>
    </div>
  );
};

export default AboutPage;