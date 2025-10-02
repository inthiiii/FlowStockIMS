import Delivery from "../models/deliveryModel.js";
import Sale from "../models/salesModel.js";

// Create a delivery from a sale
export const createDelivery = async (req, res) => {
    try {
      const { saleId, partner } = req.body;
  
      // Check if sale exists
      const sale = await Sale.findById(saleId).populate("product");
      if (!sale) {
        return res.status(404).json({ message: "Sale not found" });
      }
  
      // Check if a delivery already exists for this sale
      const existingDelivery = await Delivery.findOne({ sale: saleId });
      if (existingDelivery) {
        return res.status(400).json({ message: "Delivery already created for this sale" });
      }
  
      // Check if partner is provided
      if (!partner) return res.status(400).json({ message: "Partner is required" });
  
      const newDelivery = new Delivery({
        sale: saleId,
        partner,
        status: "Pending",
      });
  
      const savedDelivery = await newDelivery.save();
  
      res.status(201).json(savedDelivery);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

// Get all deliveries (with sale + product details)
export const getDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find()
      .populate({
        path: "sale",
        populate: { path: "product" }
      });
    res.status(200).json(deliveries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get delivery by ID
export const getDeliveryById = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id)
      .populate({
        path: "sale",
        populate: { path: "product" }
      });
    if (!delivery) return res.status(404).json({ message: "Delivery not found" });
    res.status(200).json(delivery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update delivery status/date
export const updateDelivery = async (req, res) => {
  try {
    const updatedDelivery = await Delivery.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate({
      path: "sale",
      populate: { path: "product" }
    });

    if (!updatedDelivery) return res.status(404).json({ message: "Delivery not found" });
    res.status(200).json(updatedDelivery);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a delivery
export const deleteDelivery = async (req, res) => {
  try {
    const deletedDelivery = await Delivery.findByIdAndDelete(req.params.id);
    if (!deletedDelivery) return res.status(404).json({ message: "Delivery not found" });
    res.status(200).json({ message: "Delivery deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
