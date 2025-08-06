import express from "express";
import { createOrder, getAllOrders, getUserOrders, getOrderById, markDelivered } from "../controllers/order.controller.js";

import {authUser, adminOnly } from "../middlewares/user.middleware.js";

const router = express.Router();

router.post('/', authUser, createOrder);
router.get("/my-orders",authUser, getUserOrders);
router.get("/",authUser, adminOnly, getAllOrders);
router.get("/:id",authUser, getOrderById);
router.put("/:id/deliver",authUser, adminOnly, markDelivered);

export default router;