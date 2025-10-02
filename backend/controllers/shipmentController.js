// controllers/shipmentController.js

import Shipment from "../models/shipmentModel.js";
import Product from "../models/productModel.js"; // your existing product model

// Create shipment
export const createShipment = async (req, res) => {
  try {
    const { shipmentId, carrier, products } = req.body;
    if (!shipmentId || !carrier || !products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    // Validate product existence
    const productIds = products.map(p => p.product);
    const found = await Product.find({ _id: { $in: productIds } });
    if (found.length !== productIds.length) {
      return res.status(400).json({ message: "One or more products not found" });
    }

    const shipment = new Shipment({ shipmentId, carrier, products });
    await shipment.save();

   // ✅ Increase product quantities when new shipment arrives (stock in)
for (const p of products) {
  await Product.findByIdAndUpdate(
    p.product,
    { $inc: { quantity: Math.abs(p.quantity) } },
    { new: true }
  );
}

    const result = await Shipment.findById(shipment._id).populate("products.product");
    res.status(201).json(result);
  } catch (err) {
    console.error("createShipment error", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all shipments
export const getShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find().sort({ createdAt: -1 }).populate("products.product");
    res.json(shipments);
  } catch (err) {
    console.error("getShipments error", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single shipment
export const getShipmentById = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id).populate("products.product");
    if (!shipment) return res.status(404).json({ message: "Shipment not found" });
    res.json(shipment);
  } catch (err) {
    console.error("getShipmentById error", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update shipment (e.g., status or other fields)
export const updateShipment = async (req, res) => {
  try {
    const updates = req.body;
    const shipment = await Shipment.findByIdAndUpdate(req.params.id, updates, { new: true }).populate("products.product");
    if (!shipment) return res.status(404).json({ message: "Shipment not found" });
    res.json(shipment);
  } catch (err) {
    console.error("updateShipment error", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete shipment
export const deleteShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findByIdAndDelete(req.params.id);
    if (!shipment) return res.status(404).json({ message: "Shipment not found" });
    res.json({ message: "Shipment deleted" });
  } catch (err) {
    console.error("deleteShipment error", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Receipt HTML (printable)
export const shipmentReceipt = async (req, res) => {
  try {
    const s = await Shipment.findById(req.params.id).populate("products.product");
    if (!s) return res.status(404).send("Shipment not found");

    const html = `
      <html>
        <head>
          <meta charset="utf-8"/>
          <title>Receipt - ${s.shipmentId}</title>
          <style>
            body{font-family:Arial,Helvetica,sans-serif;padding:20px}
            .header{color:#023E8A}
            table{width:100%;border-collapse:collapse;margin-top:12px}
            th,td{border:1px solid #ddd;padding:8px;text-align:left}
          </style>
        </head>
        <body>
          <h2 class="header">Shipment Receipt</h2>
          <div><strong>Shipment ID:</strong> ${s.shipmentId}</div>
          <div><strong>Carrier:</strong> ${s.carrier}</div>
          <div><strong>Status:</strong> ${s.status}</div>
          <h3>Items</h3>
          <table>
            <thead><tr><th>#</th><th>Product</th><th>Qty</th></tr></thead>
            <tbody>
              ${s.products.map((it, idx) => `<tr><td>${idx+1}</td><td>${it.product?.productName || it.product}</td><td>${it.quantity}</td></tr>`).join("")}
            </tbody>
          </table>
          <div style="margin-top:12px">Created: ${new Date(s.createdAt).toLocaleString()}</div>
          <script>window.print()</script>
        </body>
      </html>
    `;
    res.send(html);
  } catch (err) {
    console.error("shipmentReceipt error", err);
    res.status(500).send("Server error");
  }
};