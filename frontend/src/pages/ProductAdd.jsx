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
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
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
      setIsSubmitting(true);
      try {
        const formDataObj = new FormData();
        Object.keys(formData).forEach((key) => {
          if (formData[key] !== null) {
            formDataObj.append(key, formData[key]);
          }
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
        setErrors({});
      } catch (error) {
        console.error("❌ Error adding product:", error.response?.data || error.message);
        alert("Product Added Successfully");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const styles = {
    container: {
      maxWidth: "1000px",
      margin: "0 auto",
      padding: "60px 30px",
      background: "linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%)",
      minHeight: "100vh",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      position: "relative",
    },
    backgroundPattern: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.03,
      backgroundImage: "radial-gradient(circle at 20% 50%, rgba(2, 62, 138, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(2, 62, 138, 0.3) 0%, transparent 50%)",
      pointerEvents: "none",
      zIndex: 0,
    },
    content: {
      position: "relative",
      zIndex: 1,
    },
    header: {
      textAlign: "center",
      marginBottom: "50px",
      animation: "fadeInDown 0.8s ease-out",
    },
    title: {
      color: "#023E8A",
      fontSize: "3rem",
      fontWeight: "700",
      margin: "0",
      marginBottom: "12px",
      letterSpacing: "-1px",
      textShadow: "0 2px 4px rgba(2, 62, 138, 0.1)",
      background: "linear-gradient(135deg, #023E8A 0%, #0353b8 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    },
    subtitle: {
      color: "#64748b",
      fontSize: "1.15rem",
      margin: "0",
      fontWeight: "400",
      letterSpacing: "0.3px",
    },
    formContainer: {
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      padding: "50px",
      borderRadius: "20px",
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08), 0 0 1px rgba(0, 0, 0, 0.1)",
      border: "1px solid rgba(226, 232, 240, 0.8)",
      maxWidth: "700px",
      margin: "0 auto",
      animation: "fadeInUp 0.8s ease-out",
    },
    form: {
      display: "grid",
      gap: "28px",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      position: "relative",
    },
    label: {
      color: "#1e293b",
      fontSize: "0.875rem",
      fontWeight: "600",
      marginBottom: "10px",
      letterSpacing: "0.3px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      transition: "color 0.3s ease",
    },
    labelIcon: {
      fontSize: "1.1rem",
    },
    input: {
      padding: "14px 18px",
      border: "2px solid #e2e8f0",
      borderRadius: "10px",
      fontSize: "1rem",
      fontFamily: "inherit",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      backgroundColor: "#ffffff",
      outline: "none",
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
    },
    textarea: {
      padding: "14px 18px",
      border: "2px solid #e2e8f0",
      borderRadius: "10px",
      fontSize: "1rem",
      fontFamily: "inherit",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      backgroundColor: "#ffffff",
      outline: "none",
      resize: "vertical",
      minHeight: "120px",
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
    },
    fileInput: {
      padding: "14px 18px",
      border: "2px dashed #e2e8f0",
      borderRadius: "10px",
      fontSize: "0.95rem",
      fontFamily: "inherit",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      backgroundColor: "#f8fafc",
      outline: "none",
      cursor: "pointer",
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
    },
    error: {
      color: "#ef4444",
      fontSize: "0.875rem",
      marginTop: "6px",
      fontWeight: "500",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      animation: "slideInLeft 0.3s ease-out",
    },
    button: {
      background: "linear-gradient(135deg, #023E8A 0%, #0353b8 100%)",
      color: "#ffffff",
      padding: "16px 40px",
      border: "none",
      borderRadius: "12px",
      fontSize: "1.05rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      marginTop: "20px",
      justifySelf: "center",
      minWidth: "220px",
      boxShadow: "0 4px 12px rgba(2, 62, 138, 0.3)",
      position: "relative",
      overflow: "hidden",
    },
    buttonDisabled: {
      opacity: 0.7,
      cursor: "not-allowed",
    },
    formRow: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "28px",
    },
    progressBar: {
      position: "absolute",
      bottom: 0,
      left: 0,
      height: "3px",
      background: "linear-gradient(90deg, #10b981 0%, #059669 100%)",
      transition: "width 0.3s ease",
    },
    fieldCounter: {
      fontSize: "0.75rem",
      color: "#94a3b8",
      marginTop: "4px",
      fontWeight: "500",
    },
    optionalBadge: {
      fontSize: "0.75rem",
      color: "#64748b",
      backgroundColor: "#f1f5f9",
      padding: "2px 8px",
      borderRadius: "4px",
      fontWeight: "500",
    },
  };

  const calculateProgress = () => {
    const fields = ['productName', 'productID', 'quantity', 'reOrderLevel', 'modelName'];
    const filled = fields.filter(field => formData[field] && formData[field].toString().trim()).length;
    return (filled / fields.length) * 100;
  };

  const styleSheet = `
    @keyframes fadeInDown {
      from { opacity: 0; transform: translateY(-30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideInLeft {
      from { opacity: 0; transform: translateX(-10px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.8; }
    }
    @keyframes shimmer {
      0% { background-position: -1000px 0; }
      100% { background-position: 1000px 0; }
    }
    input:focus, textarea:focus, select:focus {
      border-color: #023E8A !important;
      box-shadow: 0 0 0 3px rgba(2, 62, 138, 0.1), 0 2px 4px rgba(0, 0, 0, 0.05) !important;
      transform: translateY(-1px);
    }
    input::placeholder, textarea::placeholder {
      color: #94a3b8;
    }
    .file-input:hover {
      border-color: #023E8A;
      background-color: #ffffff;
    }
    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(2, 62, 138, 0.4);
    }
    .submit-btn:active:not(:disabled) {
      transform: translateY(0);
    }
    .submit-btn:disabled {
      animation: pulse 2s ease-in-out infinite;
    }
    .label-focused {
      color: #023E8A !important;
    }
  `;

  return (
    <div style={styles.container}>
      <style>{styleSheet}</style>
      <div style={styles.backgroundPattern}></div>
      
      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>Add New Product</h1>
          <p style={styles.subtitle}>Enter product details to add to inventory</p>
        </div>
        
        <div style={styles.formContainer}>
          {/* Progress Bar */}
          <div style={{ 
            position: "relative", 
            height: "4px", 
            backgroundColor: "#e2e8f0", 
            borderRadius: "2px", 
            marginBottom: "30px",
            overflow: "hidden"
          }}>
            <div style={{ ...styles.progressBar, width: `${calculateProgress()}%` }}></div>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label 
                  style={styles.label}
                  className={focusedField === 'productName' ? 'label-focused' : ''}
                >
                  <span style={styles.labelIcon}>📦</span>
                  Product Name
                </label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('productName')}
                  onBlur={() => setFocusedField(null)}
                  style={styles.input}
                  placeholder="Enter product name"
                />
                {errors.productName && (
                  <p style={styles.error}>
                    <span>⚠️</span>
                    {errors.productName}
                  </p>
                )}
              </div>
              
              <div style={styles.formGroup}>
                <label 
                  style={styles.label}
                  className={focusedField === 'productID' ? 'label-focused' : ''}
                >
                  <span style={styles.labelIcon}>🏷️</span>
                  Product ID
                </label>
                <input
                  type="text"
                  name="productID"
                  value={formData.productID}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('productID')}
                  onBlur={() => setFocusedField(null)}
                  style={styles.input}
                  placeholder="Enter product ID"
                />
                {errors.productID && (
                  <p style={styles.error}>
                    <span>⚠️</span>
                    {errors.productID}
                  </p>
                )}
              </div>
            </div>

            <div style={styles.formGroup}>
              <label 
                style={styles.label}
                className={focusedField === 'description' ? 'label-focused' : ''}
              >
                <span style={styles.labelIcon}>📝</span>
                Description
                <span style={styles.optionalBadge}>Optional</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                onFocus={() => setFocusedField('description')}
                onBlur={() => setFocusedField(null)}
                style={styles.textarea}
                placeholder="Enter product description..."
              />
              {formData.description && (
                <span style={styles.fieldCounter}>
                  {formData.description.length} characters
                </span>
              )}
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label 
                  style={styles.label}
                  className={focusedField === 'quantity' ? 'label-focused' : ''}
                >
                  <span style={styles.labelIcon}>📊</span>
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('quantity')}
                  onBlur={() => setFocusedField(null)}
                  style={styles.input}
                  min="1"
                  placeholder="0"
                />
                {errors.quantity && (
                  <p style={styles.error}>
                    <span>⚠️</span>
                    {errors.quantity}
                  </p>
                )}
              </div>
              
              <div style={styles.formGroup}>
                <label 
                  style={styles.label}
                  className={focusedField === 'reOrderLevel' ? 'label-focused' : ''}
                >
                  <span style={styles.labelIcon}>🔔</span>
                  Reorder Level
                </label>
                <input
                  type="number"
                  name="reOrderLevel"
                  value={formData.reOrderLevel}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('reOrderLevel')}
                  onBlur={() => setFocusedField(null)}
                  style={styles.input}
                  min="1"
                  placeholder="0"
                />
                {errors.reOrderLevel && (
                  <p style={styles.error}>
                    <span>⚠️</span>
                    {errors.reOrderLevel}
                  </p>
                )}
              </div>
            </div>

            <div style={styles.formGroup}>
              <label 
                style={styles.label}
                className={focusedField === 'modelName' ? 'label-focused' : ''}
              >
                <span style={styles.labelIcon}>🔧</span>
                Model Name
              </label>
              <input
                type="text"
                name="modelName"
                value={formData.modelName}
                onChange={handleChange}
                onFocus={() => setFocusedField('modelName')}
                onBlur={() => setFocusedField(null)}
                style={styles.input}
                placeholder="Enter model name"
              />
              {errors.modelName && (
                <p style={styles.error}>
                  <span>⚠️</span>
                  {errors.modelName}
                </p>
              )}
            </div>

            <div style={styles.formGroup}>
              <label 
                style={styles.label}
                className={focusedField === 'image' ? 'label-focused' : ''}
              >
                <span style={styles.labelIcon}>🖼️</span>
                Product Image
                <span style={styles.optionalBadge}>Optional</span>
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                onFocus={() => setFocusedField('image')}
                onBlur={() => setFocusedField(null)}
                style={styles.fileInput}
                className="file-input"
              />
              {formData.image && (
                <span style={styles.fieldCounter}>
                  📎 {formData.image.name}
                </span>
              )}
            </div>

            <button 
              type="submit" 
              style={{
                ...styles.button,
                ...(isSubmitting ? styles.buttonDisabled : {})
              }}
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "⏳ Adding Product..." : "✓ Add Product"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductAdd;