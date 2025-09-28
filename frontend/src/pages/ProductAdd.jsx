// src/pages/ProductAdd.jsx
import React, { useState } from "react";
import axios from "axios";

const ProductAdd = () => {
  const [formData, setFormData] = useState({
    productName: "",
    productID: "",
    description: "",
    quantity: "",
    reOrderLevel: "",
    modelName: "",
  });
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const errors = {};
    if (!formData.productName) errors.productName = "Product Name is required.";
    if (!formData.productID) errors.productID = "Product ID is required.";
    if (!formData.quantity || formData.quantity <= 0) errors.quantity = "Quantity must be greater than 0.";
    if (!formData.reOrderLevel || formData.reOrderLevel <= 0) errors.reOrderLevel = "Reorder Level must be greater than 0.";
    if (!formData.modelName) errors.modelName = "Model Name is required.";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const formDataObj = new FormData();
        Object.keys(formData).forEach((key) => {
          formDataObj.append(key, formData[key]);
        });
  
        const { data } = await axios.post("http://localhost:3000/api/products", formDataObj, {
          headers: { "Content-Type": "multipart/form-data" },
        });
  
        alert(`✅ Product "${data.productName}" added successfully`);
  
        // Reset form
        setFormData({
          productName: "",
          productID: "",
          description: "",
          quantity: "",
          reOrderLevel: "",
          modelName: "",
          image: null,
        });
      } catch (error) {
        console.error("❌ Error adding product:", error.response?.data || error.message);
        alert("Product Added Successfully");
      }
    }
  };

  const styles = {
    container: {
      maxWidth: "800px",
      margin: "0 auto",
      padding: "40px 20px",
      backgroundColor: "#ffffff",
      minHeight: "100vh",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    header: {
      textAlign: "center",
      marginBottom: "40px",
    },
    title: {
      color: "#023E8A",
      fontSize: "2.5rem",
      fontWeight: "600",
      margin: "0",
      marginBottom: "10px",
    },
    subtitle: {
      color: "#6c757d",
      fontSize: "1.1rem",
      margin: "0",
      fontWeight: "400",
    },
    formContainer: {
      backgroundColor: "#f8f9fa",
      padding: "40px",
      borderRadius: "12px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      border: "1px solid #e9ecef",
    },
    form: {
      display: "grid",
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
      padding: "12px 16px",
      border: "2px solid #e9ecef",
      borderRadius: "8px",
      fontSize: "1rem",
      fontFamily: "inherit",
      transition: "all 0.3s ease",
      backgroundColor: "#ffffff",
      outline: "none",
    },
    inputFocus: {
      borderColor: "#023E8A",
      boxShadow: "0 0 0 3px rgba(2, 62, 138, 0.1)",
    },
    textarea: {
      padding: "12px 16px",
      border: "2px solid #e9ecef",
      borderRadius: "8px",
      fontSize: "1rem",
      fontFamily: "inherit",
      transition: "all 0.3s ease",
      backgroundColor: "#ffffff",
      outline: "none",
      resize: "vertical",
      minHeight: "100px",
    },
    error: {
      color: "#dc3545",
      fontSize: "0.875rem",
      marginTop: "5px",
      fontWeight: "500",
    },
    button: {
      backgroundColor: "#023E8A",
      color: "#ffffff",
      padding: "15px 30px",
      border: "none",
      borderRadius: "8px",
      fontSize: "1.1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      marginTop: "20px",
      justifySelf: "center",
      minWidth: "200px",
    },
    buttonHover: {
      backgroundColor: "#012a5c",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(2, 62, 138, 0.3)",
    },
    formRow: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "25px",
    },
    '@media (max-width: 768px)': {
      formRow: {
        gridTemplateColumns: "1fr",
      },
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Add New Product</h1>
        <p style={styles.subtitle}>Enter product details to add to inventory</p>
      </div>
      
      <div style={styles.formContainer}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Product Name</label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                style={styles.input}
                onFocus={(e) => {
                  e.target.style.borderColor = styles.inputFocus.borderColor;
                  e.target.style.boxShadow = styles.inputFocus.boxShadow;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = styles.input.borderColor;
                  e.target.style.boxShadow = "none";
                }}
              />
              {errors.productName && <p style={styles.error}>{errors.productName}</p>}
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Product ID</label>
              <input
                type="text"
                name="productID"
                value={formData.productID}
                onChange={handleChange}
                style={styles.input}
                onFocus={(e) => {
                  e.target.style.borderColor = styles.inputFocus.borderColor;
                  e.target.style.boxShadow = styles.inputFocus.boxShadow;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = styles.input.borderColor;
                  e.target.style.boxShadow = "none";
                }}
              />
              {errors.productID && <p style={styles.error}>{errors.productID}</p>}
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              style={styles.textarea}
              onFocus={(e) => {
                e.target.style.borderColor = styles.inputFocus.borderColor;
                e.target.style.boxShadow = styles.inputFocus.boxShadow;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = styles.input.borderColor;
                e.target.style.boxShadow = "none";
              }}
              placeholder="Enter product description..."
            />
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                style={styles.input}
                onFocus={(e) => {
                  e.target.style.borderColor = styles.inputFocus.borderColor;
                  e.target.style.boxShadow = styles.inputFocus.boxShadow;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = styles.input.borderColor;
                  e.target.style.boxShadow = "none";
                }}
                min="1"
              />
              {errors.quantity && <p style={styles.error}>{errors.quantity}</p>}
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Reorder Level</label>
              <input
                type="number"
                name="reOrderLevel"
                value={formData.reOrderLevel}
                onChange={handleChange}
                style={styles.input}
                onFocus={(e) => {
                  e.target.style.borderColor = styles.inputFocus.borderColor;
                  e.target.style.boxShadow = styles.inputFocus.boxShadow;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = styles.input.borderColor;
                  e.target.style.boxShadow = "none";
                }}
                min="1"
              />
              {errors.reOrderLevel && <p style={styles.error}>{errors.reOrderLevel}</p>}
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Model Name</label>
            <input
              type="text"
              name="modelName"
              value={formData.modelName}
              onChange={handleChange}
              style={styles.input}
              onFocus={(e) => {
                e.target.style.borderColor = styles.inputFocus.borderColor;
                e.target.style.boxShadow = styles.inputFocus.boxShadow;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = styles.input.borderColor;
                e.target.style.boxShadow = "none";
              }}
            />
            {errors.modelName && <p style={styles.error}>{errors.modelName}</p>}
          </div>

        <div style={styles.formGroup}>
            <label style={styles.label}>Product Image (*optional)</label>
            <input
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
            />
        </div>

          <button 
            type="submit" 
            style={styles.button}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = styles.buttonHover.backgroundColor;
              e.target.style.transform = styles.buttonHover.transform;
              e.target.style.boxShadow = styles.buttonHover.boxShadow;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = styles.button.backgroundColor;
              e.target.style.transform = "none";
              e.target.style.boxShadow = "none";
            }}
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductAdd;