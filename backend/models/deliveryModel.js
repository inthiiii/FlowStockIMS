import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema({
    sale: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sale",
      required: true,
    },
    partner: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    deliveryDate: {
      type: Date,
      default: null,
    }
  }, { timestamps: true });

const Delivery = mongoose.model("Delivery", deliverySchema);

export default Delivery;