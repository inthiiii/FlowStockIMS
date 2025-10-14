import Product from "../models/productModel.js";
import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

// ------------------ Helper Email Function ------------------
const sendReorderEmail = async (product) => {
  try {
    if (product.quantity <= product.reOrderLevel) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // you can change to dynamic email
        subject: `Reorder Alert: ${product.productName}`,
        html: `<p>The product <strong>${product.productName}</strong> has reached its reorder level.</p>
               <p>Current stock: ${product.quantity}</p>
               <p>Reorder level: ${product.reOrderLevel}</p>`,
      });
    }
  } catch (err) {
    console.error("Error sending reorder email:", err.message);
  }
};

// ------------------ Controllers ------------------

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get favorite products
export const getFavoriteProducts = async (_req, res) => {
  try {
    const favorites = await Product.find({ favorite: true });
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a product
export const createProduct = async (req, res) => {
  try {
    const { productName, productID, description, quantity, reOrderLevel, modelName } = req.body;

    const qty = Number(quantity);
    const reorder = Number(reOrderLevel);

    if (!productName || !productID || !qty || !reorder || !modelName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const product = new Product({
      productName,
      productID,
      description,
      quantity: qty,
      reOrderLevel: reorder,
      modelName,
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });

    const createdProduct = await product.save();

    // Send reorder email if needed
    await sendReorderEmail(createdProduct);

    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("❌ Error creating product:", error.message);
    res.status(400).json({ message: error.message });
  }
};

// Get single product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) res.json(product);
    else res.status(404).json({ message: "Product not found" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.productName = req.body.productName || product.productName;
      product.productID = req.body.productID || product.productID;
      product.description = req.body.description || product.description;
      product.quantity = req.body.quantity ? Number(req.body.quantity) : product.quantity;
      product.reOrderLevel = req.body.reOrderLevel ? Number(req.body.reOrderLevel) : product.reOrderLevel;
      product.modelName = req.body.modelName || product.modelName;
      product.favorite = req.body.favorite !== undefined ? req.body.favorite : product.favorite;

      if (req.file) product.image = `/uploads/${req.file.filename}`;

      const updatedProduct = await product.save();

      // Send reorder email if stock is below level
      await sendReorderEmail(updatedProduct);

      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export products to PDF
export const exportProductsPDF = async (_req, res) => {
  try {
    const products = await Product.find();

    const doc = new PDFDocument();
    const filePath = path.join("uploads", "products.pdf");
    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(20).text("Product List", { align: "center" });
    doc.moveDown();

    products.forEach((p, i) => {
      doc.fontSize(12).text(`${i + 1}. ${p.productName} - ${p.productID} - Qty: ${p.quantity}`);
    });

    doc.end();

    doc.on("finish", () => {
      res.download(filePath, "products.pdf");
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};