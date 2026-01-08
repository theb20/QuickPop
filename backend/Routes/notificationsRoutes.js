import express from 'express';
import * as notificationsController from '../controllers/notificationsController.js';
import requireAuth from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', notificationsController.getNotifications);
router.put('/:id/read', notificationsController.markAsRead);
router.put('/read-all', notificationsController.markAllAsRead);
router.post('/broadcast', notificationsController.sendBroadcastNotification);

export default router;
