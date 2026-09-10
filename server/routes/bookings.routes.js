import { Router } from 'express';
import * as c from '../controllers/bookings.controller.js';
import { requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();
router.get('/notifications', requireAdmin, c.getNotifications);
router.put('/notifications/:id/read', requireAdmin, c.readNotification);
router.get('/', requireAdmin, c.getAll);
router.post('/', c.create);
router.put('/:id', requireAdmin, c.update);
router.delete('/:id', requireAdmin, c.remove);
export default router;
