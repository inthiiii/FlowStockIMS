// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
// import connectDB from "./config/db.js";
// import userRoutes from "./routes/userRoutes.js";
import connectDB from "./db.js";
import router from "./routes/salesRoutes.js";
import productRouter from "./routes/productRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import internalUserRoutes from './routes/internalUserRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/sales", router);
app.use("/api/products", productRouter);
app.use("/api/contact", contactRoutes);
app.use('/api/internal-users', internalUserRoutes);
app.use('/api/attendance', attendanceRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err.stack);
  res.status(500).json({ error: "Something went wrong" });
});