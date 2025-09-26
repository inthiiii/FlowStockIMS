import React, { useState } from "react";
import { loginUser, registerUser } from "../services/userService";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true); // toggle between login & register
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const res = await loginUser({
          email: formData.email,
          password: formData.password,
        });
        alert("Login successful!");
        localStorage.setItem("token", res.data.token);
      } else {
        await registerUser(formData);
        alert("Registration successful! You can now log in.");
        setIsLogin(true);
      }
      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        password: "",
      });
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1 style={{ color: "#023E8A" }}>{isLogin ? "Login" : "Register"}</h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
        {/* Register fields only */}
        {!isLogin && (
          <>
            <label style={labelStyle}>First Name</label>
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <label style={labelStyle}>Last Name</label>
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <label style={labelStyle}>Phone Number</label>
            <input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </>
        )}

        {/* Common fields */}
        <label style={labelStyle}>Email</label>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <label style={labelStyle}>Password</label>
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle}>
          {isLogin ? "Login" : "Register"}
        </button>
      </form>

      <p style={{ marginTop: "15px" }}>
        {isLogin ? "New here?" : "Already have an account?"}{" "}
        <span
          style={{ color: "#023E8A", cursor: "pointer", fontWeight: "bold" }}
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Register" : "Login"}
        </span>
      </p>
    </div>
  );
};

// Styles
const labelStyle = {
  display: "block",
  marginTop: "10px",
  marginBottom: "5px",
  fontWeight: "bold",
  color: "#023E8A",
};
const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  border: "1px solid #ccc",
  borderRadius: "5px",
};
const buttonStyle = {
  background: "#023E8A",
  color: "#fff",
  padding: "10px 15px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  marginTop: "10px",
};

export default LoginPage;
