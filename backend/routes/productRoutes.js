// routes/productRoutes.js
import express from "express";
import multer from "multer";
import {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const productRouter = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Routes
productRouter.route("/")
  .get(getProducts)
  .post(upload.single("image"), createProduct);

productRouter.route("/:id")
  .get(getProductById)
  .put(upload.single("image"), updateProduct) // ✅ enable image upload in update
  .delete(deleteProduct);

export default productRouter;