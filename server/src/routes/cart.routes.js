//routes/cart.routes.js
import express from 'express';
import { addToCart ,getCart, updateCartItem, removeFromCart } from '../controllers/cart.controller.js';
import { authUser } from '../middlewares/user.middleware.js';

const router = express.Router();

router.post('/', authUser, addToCart);
router.get('/',authUser , getCart);
router.put('/:id',authUser , updateCartItem);
router.delete('/:id',authUser , removeFromCart);

export default router;  