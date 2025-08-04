import express from "express";
import {
  getMyAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/address.controller.js";
import { authUser } from "../middlewares/user.middleware.js";

const router = express.Router();

// GET /api/addresses - Get all addresses for user
// POST /api/addresses - Add new address

router.get('/', authUser, getMyAddresses);
router.post('/', authUser, addAddress);;

// PUT /api/addresses/:id - Update address
// DELETE /api/addresses/:id - Delete address
router.put('/:id', authUser, updateAddress);
router.delete('/:id', authUser, deleteAddress);


export default router;
