// src/pages/EditProduct.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

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

  // Fetch existing product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`http://localhost:3000/api/products/${id}`);
        setFormData({
          productName: data.productName,
          productID: data.productID,
          description: data.description,
          quantity: data.quantity,
          reOrderLevel: data.reOrderLevel,
          modelName: data.modelName,
          image: null,
        });
        setPreview(data.image ? `http://localhost:3000${data.image}` : "");
        setError("");
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to fetch product details.");
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
      const form = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) form.append(key, formData[key]);
      });

      await axios.put(`http://localhost:3000/api/products/${id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(true);
      setTimeout(() => {
        navigate("/products/control");
      }, 1500);
    } catch (err) {
      console.error("Error updating product:", err);
      setError("Failed to update product. Please try again.");
    } finally {
      setSubmitting(false);
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
      padding: "12px 16px",
      border: "2px solid #e9ecef",
      borderRadius: "8px",
      fontSize: "1rem",
      fontFamily: "inherit",
      transition: "all 0.3s ease",
      backgroundColor: "#ffffff",
      outline: "none",
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
    fileInput: {
      padding: "12px 16px",
      border: "2px dashed #e9ecef",
      borderRadius: "8px",
      fontSize: "1rem",
      backgroundColor: "#ffffff",
      transition: "all 0.3s ease",
      cursor: "pointer",
    },
    fileInputHover: {
      borderColor: "#023E8A",
      backgroundColor: "#f8f9fa",
    },
    inputFocus: {
      borderColor: "#023E8A",
      boxShadow: "0 0 0 3px rgba(2, 62, 138, 0.1)",
    },
    formRow: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "25px",
    },
    imagePreviewContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "15px",
      marginTop: "15px",
    },
    imagePreview: {
      width: "250px",
      height: "250px",
      objectFit: "cover",
      borderRadius: "12px",
      border: "3px solid #e9ecef",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    imageLabel: {
      fontSize: "0.9rem",
      color: "#6c757d",
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
      position: "relative",
    },
    buttonHover: {
      backgroundColor: "#012a5c",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(2, 62, 138, 0.3)",
    },
    buttonDisabled: {
      backgroundColor: "#6c757d",
      cursor: "not-allowed",
      transform: "none",
      boxShadow: "none",
    },
    loadingContainer: {
      textAlign: "center",
      padding: "80px 20px",
      color: "#6c757d",
    },
    loadingSpinner: {
      width: "50px",
      height: "50px",
      border: "4px solid #f3f3f3",
      borderTop: "4px solid #023E8A",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      marginBottom: "20px",
      margin: "0 auto 20px auto",
    },
    loadingText: {
      fontSize: "1.2rem",
      fontWeight: "500",
    },
    errorMessage: {
      backgroundColor: "#f8d7da",
      color: "#721c24",
      padding: "12px 16px",
      borderRadius: "8px",
      border: "1px solid #f5c6cb",
      fontSize: "0.95rem",
      fontWeight: "500",
      marginBottom: "20px",
      textAlign: "center",
    },
    successMessage: {
      backgroundColor: "#d1edff",
      color: "#0c5460",
      padding: "12px 16px",
      borderRadius: "8px",
      border: "1px solid #bee5eb",
      fontSize: "0.95rem",
      fontWeight: "500",
      marginBottom: "20px",
      textAlign: "center",
    },
    buttonSpinner: {
      display: "inline-block",
      width: "20px",
      height: "20px",
      border: "2px solid #ffffff",
      borderTop: "2px solid transparent",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      marginRight: "10px",
    },
    backButton: {
      backgroundColor: "#6c757d",
      color: "#ffffff",
      padding: "10px 20px",
      border: "none",
      borderRadius: "6px",
      fontSize: "0.9rem",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.3s ease",
      marginBottom: "20px",
      textDecoration: "none",
      display: "inline-block",
    },
    backButtonHover: {
      backgroundColor: "#5a6268",
    },
    requiredIndicator: {
      color: "#dc3545",
      marginLeft: "4px",
      fontWeight: "bold",
    },
    helpText: {
      fontSize: "0.85rem",
      color: "#6c757d",
      marginTop: "5px",
      fontStyle: "italic",
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <div style={styles.loadingText}>Loading product details...</div>
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      </div>
    );
  }

  if (error && !formData.productName) {
    return (
      <div style={styles.container}>
        <div style={styles.errorMessage}>
          <strong>Error:</strong> {error}
        </div>
        <button 
          style={styles.backButton}
          onClick={() => navigate("/products/control")}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = styles.backButtonHover.backgroundColor;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = styles.backButton.backgroundColor;
          }}
        >
          Back to Product
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <button 
        style={styles.backButton}
        onClick={() => navigate("/products/control")}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = styles.backButtonHover.backgroundColor;
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = styles.backButton.backgroundColor;
        }}
      >
        ← Back to Products
      </button>

      <div style={styles.header}>
        <h1 style={styles.title}>Edit Product</h1>
        <p style={styles.subtitle}>Update product information and details</p>
      </div>

      <div style={styles.formContainer}>
        {error && (
          <div style={styles.errorMessage}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {success && (
          <div style={styles.successMessage}>
            <strong>Success:</strong> Product updated successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Product Name<span style={styles.requiredIndicator}>*</span>
              </label>
              <input
                type="text"
                name="productName"
                placeholder="Enter product name"
                value={formData.productName}
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
                disabled={submitting}
              />
              <p style={styles.helpText}>Enter the product's display name</p>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Product ID<span style={styles.requiredIndicator}>*</span>
              </label>
              <input
                type="text"
                name="productID"
                placeholder="Enter product ID"
                value={formData.productID}
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
                disabled={submitting}
              />
              <p style={styles.helpText}>Unique identifier for the product</p>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              name="description"
              placeholder="Enter product description..."
              value={formData.description}
              onChange={handleChange}
              style={styles.textarea}
              onFocus={(e) => {
                e.target.style.borderColor = styles.inputFocus.borderColor;
                e.target.style.boxShadow = styles.inputFocus.boxShadow;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = styles.textarea.borderColor;
                e.target.style.boxShadow = "none";
              }}
              disabled={submitting}
            />
            <p style={styles.helpText}>Detailed description of the product</p>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Quantity<span style={styles.requiredIndicator}>*</span>
              </label>
              <input
                type="number"
                name="quantity"
                placeholder="Available quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                min="0"
                style={styles.input}
                onFocus={(e) => {
                  e.target.style.borderColor = styles.inputFocus.borderColor;
                  e.target.style.boxShadow = styles.inputFocus.boxShadow;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = styles.input.borderColor;
                  e.target.style.boxShadow = "none";
                }}
                disabled={submitting}
              />
              <p style={styles.helpText}>Current stock quantity</p>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Reorder Level<span style={styles.requiredIndicator}>*</span>
              </label>
              <input
                type="number"
                name="reOrderLevel"
                placeholder="Reorder level"
                value={formData.reOrderLevel}
                onChange={handleChange}
                required
                min="1"
                style={styles.input}
                onFocus={(e) => {
                  e.target.style.borderColor = styles.inputFocus.borderColor;
                  e.target.style.boxShadow = styles.inputFocus.boxShadow;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = styles.input.borderColor;
                  e.target.style.boxShadow = "none";
                }}
                disabled={submitting}
              />
              <p style={styles.helpText}>Minimum stock before reordering</p>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Model Name<span style={styles.requiredIndicator}>*</span>
            </label>
            <input
              type="text"
              name="modelName"
              placeholder="Enter model name"
              value={formData.modelName}
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
              disabled={submitting}
            />
            <p style={styles.helpText}>Product model or variant name</p>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={styles.fileInput}
              onMouseEnter={(e) => {
                if (!submitting) {
                  e.target.style.borderColor = styles.fileInputHover.borderColor;
                  e.target.style.backgroundColor = styles.fileInputHover.backgroundColor;
                }
              }}
              onMouseLeave={(e) => {
                if (!submitting) {
                  e.target.style.borderColor = styles.fileInput.borderColor;
                  e.target.style.backgroundColor = styles.fileInput.backgroundColor;
                }
              }}
              disabled={submitting}
            />
            <p style={styles.helpText}>Upload a new image to replace the current one (optional)</p>
            
            {preview && (
              <div style={styles.imagePreviewContainer}>
                <img
                  src={preview}
                  alt="Product Preview"
                  style={styles.imagePreview}
                />
                <span style={styles.imageLabel}>
                  {formData.image ? "New Image Preview" : "Current Product Image"}
                </span>
              </div>
            )}
          </div>

          <button 
            type="submit" 
            style={{
              ...styles.button,
              ...(submitting ? styles.buttonDisabled : {})
            }}
            onMouseEnter={(e) => {
              if (!submitting) {
                e.target.style.backgroundColor = styles.buttonHover.backgroundColor;
                e.target.style.transform = styles.buttonHover.transform;
                e.target.style.boxShadow = styles.buttonHover.boxShadow;
              }
            }}
            onMouseLeave={(e) => {
              if (!submitting) {
                e.target.style.backgroundColor = styles.button.backgroundColor;
                e.target.style.transform = "none";
                e.target.style.boxShadow = "none";
              }
            }}
            disabled={submitting}
          >
            {submitting && <span style={styles.buttonSpinner}></span>}
            {submitting ? "Updating Product..." : "Update Product"}
          </button>
        </form>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @media (max-width: 768px) {
            .form-row {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default EditProduct;