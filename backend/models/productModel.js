import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    productID: { type: String, required: true, unique: true },
    description: { type: String },
    quantity: { type: Number, required: true },
    reOrderLevel: { type: Number, required: true },
    modelName: { type: String, required: true },
    image: { type: String },
    favorite: { type: Boolean, default: false }, // ✅ Favorite feature
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;