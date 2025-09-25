import express from "express";
import {
  getAllSales,
  getSaleById,
  createSale,
  updateSale,
  deleteSale,
  getSalesByCustomer,
  getSalesByDate,
  returnSale,
} from "../controllers/salesController.js";

const router = express.Router();

router.get("/", getAllSales);
router.get("/:id", getSaleById);
router.get("/customer/:name", getSalesByCustomer);
router.get("/date/:date", getSalesByDate);

router.post("/", createSale);
router.put("/:id", updateSale);
router.put("/return/:id", returnSale);
router.delete("/:id", deleteSale);

export default router;