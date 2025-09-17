import express from "express";
import {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.route("/")
  .get(getProducts)   // GET all products
  .post(createProduct); // POST create product

productRouter.route("/:id")
  .get(getProductById)  // GET product by ID
  .put(updateProduct)   // PUT update product
  .delete(deleteProduct); // DELETE product

export default productRouter;