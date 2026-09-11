import { Router } from 'express';
import * as c from '../controllers/bookings.controller.js';
import { requireAdmin, requireAuth } from '../middleware/auth.middleware.js';
import { bookingWriteLimit } from '../middleware/rateLimit.middleware.js';

const router = Router();
router.get('/availability', c.getAvailability);
router.put('/availability/:date', requireAdmin, c.updateAvailability);
router.delete('/availability/:date', requireAdmin, c.deleteAvailability);
router.get('/notifications', requireAdmin, c.getNotifications);
router.put('/notifications/:id/read', requireAdmin, c.readNotification);
router.get('/', requireAdmin, c.getAll);
router.post('/', requireAuth, bookingWriteLimit, c.create);
router.put('/:id', requireAdmin, c.update);
router.delete('/:id', requireAdmin, c.remove);
export default router;
