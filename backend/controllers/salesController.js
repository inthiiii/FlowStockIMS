import Sale from "../models/salesModel.js";

// @desc    Get all sales
// @route   GET /api/sales
 const getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find().populate("product");
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single sale by ID
// @route   GET /api/sales/:id
 const getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id).populate("product");
    if (!sale) return res.status(404).json({ message: "Sale not found" });
    res.status(200).json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new sale
// @route   POST /api/sales
 const createSale = async (req, res) => {
  const { product, customerName, customerEmail, quantity, pricePerUnit, paymentStatus } = req.body;

  try {
    const totalAmount = quantity * pricePerUnit;

    const sale = new Sale({
      product,
      customerName,
      customerEmail,
      quantity,
      pricePerUnit,
      totalAmount,
      paymentStatus,
    });

    const savedSale = await sale.save();
    res.status(201).json(savedSale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a sale
// @route   PUT /api/sales/:id
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

// @desc    Delete a sale
// @route   DELETE /api/sales/:id
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

// @desc    Get sales by customer name
// @route   GET /api/sales/customer/:name
 const getSalesByCustomer = async (req, res) => {
  try {
    const sales = await Sale.find({ customerName: req.params.name }).populate("product");
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getAllSales, getSaleById, createSale, updateSale, deleteSale, getSalesByCustomer };