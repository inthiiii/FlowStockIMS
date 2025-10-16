import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./db.js";
import router from "./routes/salesRoutes.js";
import productRouter from "./routes/productRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import shipmentRoutes from "./routes/shipmentRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import internalUserRoutes from "./routes/internalUserRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded images
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Routes
app.use("/api/sales", router);
app.use("/api/email", emailRoutes); // Email routes
app.use("/api/products", productRouter);
app.use("/api/contact", contactRoutes);
app.use("/api/shipments", shipmentRoutes);
app.use("/api/deliveries", deliveryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/internal-users", internalUserRoutes);  
app.use("/api/attendance", attendanceRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err.stack);
  res.status(500).json({ error: "Something went wrong" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});