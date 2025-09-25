import Sale from "../models/salesModel.js";
import Product from "../models/productModel.js";

// Get all sales
const getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find().populate("product");
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get sale by ID
const getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id).populate("product");
    if (!sale) return res.status(404).json({ message: "Sale not found" });
    res.status(200).json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get sales by Customer
const getSalesByCustomer = async (req, res) => {
  try {
    const sales = await Sale.find({ customerName: req.params.name }).populate("product");
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get sales by Date
const getSalesByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const start = new Date(date);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const sales = await Sale.find({ saleDate: { $gte: start, $lte: end } }).populate("product");
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create Sale
const createSale = async (req, res) => {
  const { product, customerName, customerEmail, quantity, pricePerUnit, paymentStatus } = req.body;
  try {
    const totalAmount = quantity * pricePerUnit;

    const sale = new Sale({ product, customerName, customerEmail, quantity, pricePerUnit, totalAmount, paymentStatus });
    const savedSale = await sale.save();
    res.status(201).json(savedSale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update Sale
const updateSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) return res.status(404).json({ message: "Sale not found" });

    const { product, customerName, customerEmail, quantity, pricePerUnit, paymentStatus } = req.body;

    if (product) sale.product = product;
    if (customerName) sale.customerName = customerName;
    if (customerEmail) sale.customerEmail = customerEmail;
    if (quantity) sale.quantity = quantity;
    if (pricePerUnit) sale.pricePerUnit = pricePerUnit;
    if (quantity && pricePerUnit) sale.totalAmount = quantity * pricePerUnit;
    if (paymentStatus) sale.paymentStatus = paymentStatus;

    const updatedSale = await sale.save();
    res.status(200).json(updatedSale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Sale
const deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) return res.status(404).json({ message: "Sale not found" });

    await sale.deleteOne();
    res.status(200).json({ message: "Sale deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark Sale as Returned
const returnSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) return res.status(404).json({ message: "Sale not found" });

    sale.paymentStatus = "Returned";
    await sale.save();

    res.status(200).json({ message: "Sale marked as Returned", sale });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getAllSales, getSaleById, createSale, updateSale, deleteSale, getSalesByCustomer, getSalesByDate, returnSale };