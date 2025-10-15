// src/pages/EditProduct.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api.js"; // Using the centralized api instance

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    productName: "",
    productID: "",
    description: "",
    quantity: "",
    reOrderLevel: "",
    modelName: "",
    image: null,
  });
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isHovered, setIsHovered] = useState(false);


  // Fetch existing product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/products/${id}`);
        setFormData({
          productName: data.productName,
          productID: data.productID,
          description: data.description,
          quantity: data.quantity,
          reOrderLevel: data.reOrderLevel,
          modelName: data.modelName,
          image: null, // Reset image on load
        });
        setPreview(data.image); // The full URL should be handled by the api instance or constructed here
        setError("");
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to fetch product details. It might have been deleted.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(""); // Clear error when user starts editing
  };

  // Handle file input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const formPayload = new FormData();
      // Append fields to FormData
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) {
          formPayload.append(key, formData[key]);
        }
      });

      await api.put(`/products/${id}`, formPayload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(true);
      setTimeout(() => {
        navigate("/products/control");
      }, 2000);
    } catch (err) {
      console.error("Error updating product:", err);
      setError(err.response?.data?.message || "Failed to update product. Please check the details and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // --- NEW UNIFORM STYLING ---
  const styles = {
    container: {
      maxWidth: "900px",
      margin: "0 auto",
      padding: "50px 30px",
      background: "linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%)",
      minHeight: "100vh",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
    header: {
      textAlign: "center",
      marginBottom: "40px",
      animation: "fadeInDown 0.6s ease-out"
    },
    title: {
      color: "#023E8A",
      fontSize: "3rem",
      fontWeight: "700",
      margin: "0 0 12px 0",
      letterSpacing: "-1px",
      textShadow: "0 2px 4px rgba(2, 62, 138, 0.1)"
    },
    subtitle: {
      color: "#64748b",
      fontSize: "1.15rem",
      margin: "0",
      fontWeight: "400",
    },
    formContainer: {
      backgroundColor: "#ffffff",
      padding: "40px 50px",
      borderRadius: "20px",
      border: "1px solid rgba(226, 232, 240, 0.8)",
      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
      animation: "fadeInUp 0.7s ease-out"
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "28px",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    label: {
      fontSize: "0.9rem",
      fontWeight: "600",
      color: "#1e293b",
      letterSpacing: "0.3px",
    },
    input: {
      padding: "14px 18px",
      border: "2px solid #e2e8f0",
      borderRadius: "10px",
      fontSize: "1rem",
      fontFamily: "inherit",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      backgroundColor: "#f8fafc",
      outline: "none",
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)"
    },
    inputFocus: {
      borderColor: "#023E8A",
      backgroundColor: "#ffffff",
      boxShadow: "0 0 0 3px rgba(2, 62, 138, 0.1), 0 2px 4px rgba(0, 0, 0, 0.05)",
    },
    textarea: {
        resize: "vertical",
        minHeight: "120px",
    },
    fileInputContainer: {
      padding: "20px",
      border: "2px dashed #e2e8f0",
      borderRadius: "10px",
      textAlign: 'center',
      backgroundColor: "#f8fafc",
      transition: "all 0.3s ease",
      cursor: "pointer",
    },
    fileInputContainerHover: {
        borderColor: '#023E8A',
        backgroundColor: '#f0f6ff'
    },
    fileInputText: {
        color: '#64748b',
        fontWeight: '500',
    },
    formRow: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "28px",
    },
    imagePreview: {
      width: "150px",
      height: "150px",
      objectFit: "cover",
      borderRadius: "12px",
      border: "3px solid #e2e8f0",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      display: 'block',
      margin: '20px auto 0'
    },
    button: {
      background: "linear-gradient(135deg, #023E8A 0%, #0353b8 100%)",
      color: "#ffffff",
      padding: "16px 32px",
      border: "none",
      borderRadius: "12px",
      fontSize: "1.1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      marginTop: "10px",
      boxShadow: "0 4px 15px rgba(2, 62, 138, 0.3)",
    },
    buttonHover: {
      transform: "translateY(-3px)",
      boxShadow: "0 8px 25px rgba(2, 62, 138, 0.4)",
    },
    buttonDisabled: {
      background: "#94a3b8",
      cursor: "not-allowed",
      boxShadow: "none",
      transform: 'none',
    },
    loadingContainer: {
        textAlign: "center",
        padding: "100px 20px",
    },
    loadingSpinner: {
        width: "60px",
        height: "60px",
        border: "5px solid #e2e8f0",
        borderTop: "5px solid #023E8A",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
        margin: "0 auto 25px auto",
    },
    loadingText: {
        color: "#64748b",
        fontSize: "1.2rem",
        fontWeight: "500"
    },
    message: {
        padding: "16px 20px",
        borderRadius: "10px",
        border: "1px solid transparent",
        fontSize: "1rem",
        fontWeight: "500",
        marginBottom: "20px",
        textAlign: "center",
    },
    errorMessage: {
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        color: "#b91c1c",
        borderColor: "rgba(239, 68, 68, 0.2)",
    },
    successMessage: {
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        color: "#15803d",
        borderColor: "rgba(34, 197, 94, 0.2)",
    },
    buttonSpinner: {
        width: "22px",
        height: "22px",
        border: "3px solid rgba(255, 255, 255, 0.3)",
        borderTopColor: "#ffffff",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
    },
    backButton: {
      background: 'transparent',
      color: "#64748b",
      border: "2px solid #e2e8f0",
      padding: "10px 20px",
      borderRadius: "10px",
      fontSize: "0.95rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      marginBottom: "30px",
      textDecoration: "none",
      display: "inline-flex",
      alignItems: 'center',
      gap: '8px'
    },
    backButtonHover: {
        borderColor: '#023E8A',
        backgroundColor: '#ffffff',
        color: '#023E8A'
    },
    requiredIndicator: {
      color: "#ef4444",
      marginLeft: "4px",
    },
  };
  
  const styleSheet = `
    @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes spin { to { transform: rotate(360deg); } }
    input::placeholder, textarea::placeholder { color: #94a3b8; }
  `;

  if (loading) {
    return (
      <div style={styles.container}>
        <style>{styleSheet}</style>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <div style={styles.loadingText}>Loading Product Details...</div>
        </div>
      </div>
    );
  }

  // Render error state if fetching failed
  if (error && !formData.productName) {
    return (
      <div style={styles.container}>
         <style>{styleSheet}</style>
        <div style={{...styles.message, ...styles.errorMessage}}>
          <strong>Error:</strong> {error}
        </div>
        <button
          style={styles.backButton}
          onClick={() => navigate("/products/control")}
        >
          ← Back to Products List
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{styleSheet}</style>
      
      <button
        style={styles.backButton}
        onClick={() => navigate("/products/control")}
      >
        ← Back to Products List
      </button>

      <header style={styles.header}>
        <h1 style={styles.title}>Edit Product Details</h1>
        <p style={styles.subtitle}>Update the information for "{formData.productName}"</p>
      </header>

      <div style={styles.formContainer}>
        {error && <div style={{...styles.message, ...styles.errorMessage}}>{error}</div>}
        {success && <div style={{...styles.message, ...styles.successMessage}}>Product updated successfully! Redirecting...</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={{...styles.formRow, gridTemplateColumns: '2fr 1fr'}}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Product Name<span style={styles.requiredIndicator}>*</span></label>
              <input
                type="text" name="productName" value={formData.productName} onChange={handleChange}
                required disabled={submitting}
                style={{...styles.input, ...(focusedField === 'productName' && styles.inputFocus)}}
                onFocus={() => setFocusedField('productName')} onBlur={() => setFocusedField(null)}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Product ID<span style={styles.requiredIndicator}>*</span></label>
              <input
                type="text" name="productID" value={formData.productID} onChange={handleChange}
                required disabled={submitting}
                style={{...styles.input, ...(focusedField === 'productID' && styles.inputFocus)}}
                onFocus={() => setFocusedField('productID')} onBlur={() => setFocusedField(null)}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              name="description" value={formData.description} onChange={handleChange}
              disabled={submitting}
              style={{...styles.input, ...styles.textarea, ...(focusedField === 'description' && styles.inputFocus)}}
              onFocus={() => setFocusedField('description')} onBlur={() => setFocusedField(null)}
            />
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Quantity<span style={styles.requiredIndicator}>*</span></label>
              <input
                type="number" name="quantity" value={formData.quantity} onChange={handleChange}
                required min="0" disabled={submitting}
                style={{...styles.input, ...(focusedField === 'quantity' && styles.inputFocus)}}
                onFocus={() => setFocusedField('quantity')} onBlur={() => setFocusedField(null)}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Reorder Level<span style={styles.requiredIndicator}>*</span></label>
              <input
                type="number" name="reOrderLevel" value={formData.reOrderLevel} onChange={handleChange}
                required min="0" disabled={submitting}
                style={{...styles.input, ...(focusedField === 'reOrderLevel' && styles.inputFocus)}}
                onFocus={() => setFocusedField('reOrderLevel')} onBlur={() => setFocusedField(null)}
              />
            </div>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Model Name<span style={styles.requiredIndicator}>*</span></label>
            <input
              type="text" name="modelName" value={formData.modelName} onChange={handleChange}
              required disabled={submitting}
              style={{...styles.input, ...(focusedField === 'modelName' && styles.inputFocus)}}
              onFocus={() => setFocusedField('modelName')} onBlur={() => setFocusedField(null)}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Product Image</label>
            <label 
              style={{...styles.fileInputContainer, ...(isHovered && styles.fileInputContainerHover)}}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <span style={styles.fileInputText}>
                {formData.image ? `Selected: ${formData.image.name}` : "Click to upload a new image (optional)"}
              </span>
              <input type="file" accept="image/*" onChange={handleFileChange} disabled={submitting} hidden />
            </label>

            {preview && <img src={preview} alt="Product Preview" style={styles.imagePreview} />}
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{ ...styles.button, ...(submitting && styles.buttonDisabled) }}
          >
            {submitting && <span style={styles.buttonSpinner}></span>}
            {submitting ? "Saving Changes..." : "Update Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;

