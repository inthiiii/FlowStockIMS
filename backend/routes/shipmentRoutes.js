// routes/shipmentRoutes.js

import express from "express";
import {
  createShipment,
  getShipments,
  getShipmentById,
  updateShipment,
  deleteShipment,
  shipmentReceipt,
} from "../controllers/shipmentController.js";

const router = express.Router();

router.post("/", createShipment);
router.get("/", getShipments);
router.get("/:id", getShipmentById);
router.put("/:id", updateShipment);
router.delete("/:id", deleteShipment);
router.get("/:id/receipt", shipmentReceipt);

export default router;