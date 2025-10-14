import express from "express";
import multer from "multer";
import {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getFavoriteProducts,
  exportProductsPDF,
} from "../controllers/productController.js";

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination(req, file, cb) { cb(null, "uploads/"); },
  filename(req, file, cb) { cb(null, Date.now() + "-" + file.originalname); },
});
const upload = multer({ storage });

// CRUD Routes
router.route("/")
  .get(getProducts)
  .post(upload.single("image"), createProduct);

router.route("/favorites")
  .get(getFavoriteProducts); // ✅ Get favorite products

router.route("/export/pdf")
  .get(exportProductsPDF); // ✅ Export PDF

router.route("/:id")
  .get(getProductById)
  .put(upload.single("image"), updateProduct)
  .delete(deleteProduct);

export default router;