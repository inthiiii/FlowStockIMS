// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
// import connectDB from "./config/db.js";
// import userRoutes from "./routes/userRoutes.js";
import connectDB from "./db.js";
import router from "./routes/salesRoutes.js";
import productRouter from "./routes/productRoutes.js";

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

// Root endpoint
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});