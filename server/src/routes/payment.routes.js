//routes/paymentRoutes.js
import express from 'express';
import { authUser } from '../middlewares/user.middleware.js';

import {
    createPaypalOrder,
    executePaypalPayment,
} from '../controllers/payment.controller.js';

const router = express.Router();

router.post('/create', authUser, createPaypalOrder);
router.get('/execute', executePaypalPayment);

export default router;