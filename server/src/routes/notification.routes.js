import express from 'express';
import { createNotification, getNotifications, markNotificationRead,markAllAsRead } from '../controllers/notification.controller.js';

import { authUser} from '../middlewares/user.middleware.js';

const router = express.Router();

router.get('/', authUser, getNotifications);
router.post('/', authUser, createNotification);
router.patch('/:id/read', authUser, markNotificationRead);
router.patch('/read-all', authUser, markAllAsRead);

export default router;

