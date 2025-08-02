import express from "express";
import {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { authUser, adminOnly } from "../middlewares/user.middleware.js";

const router = express.Router();

router.post("/", authUser, createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProduct);
router.put("/:id", authUser, updateProduct);
router.delete("/:id", authUser,adminOnly, deleteProduct);

export default router;
