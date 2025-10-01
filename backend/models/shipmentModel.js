// models/shipmentModel.js

import mongoose from "mongoose";

const shipmentProductSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
});

const shipmentSchema = new mongoose.Schema(
  {
    shipmentId: { type: String, required: true, unique: true },
    carrier: { type: String, required: true },
    products: [shipmentProductSchema],
    status: { type: String, enum: ["pending", "shipped", "cancelled"], default: "pending" },
  },
  { timestamps: true }
);

const Shipment = mongoose.model("Shipment", shipmentSchema);
export default Shipment;