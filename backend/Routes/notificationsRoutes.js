import express from 'express';
import * as notificationsController from '../Controllers/notificationsController.js';
import { authenticateToken } from '../Middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', notificationsController.getNotifications);
router.put('/:id/read', notificationsController.markAsRead);
router.put('/read-all', notificationsController.markAllAsRead);
router.post('/broadcast', notificationsController.sendBroadcastNotification);

export default router;
