import express from "express";
import { getSaleById, getAllSales, createSale, updateSale, deleteSale, getSalesByCustomer } from "../controllers/salesController.js";

const router = express.Router();

// Get all sales
router.get("/", getAllSales);

// Get a sale by ID
router.get("/:id", getSaleById);

// Get sales by customer name
router.get("/customer/:name", getSalesByCustomer);

// Create a new sale
router.post("/", createSale);

// Update a sale by ID
router.put("/:id", updateSale);

// Delete a sale by ID
router.delete("/:id", deleteSale);

export default router;