import { Router } from 'express';
import * as c from '../controllers/reviews.controller.js';
import { requireAdmin } from '../middleware/auth.middleware.js';
import { uploadImage } from '../middleware/upload.middleware.js';

const router = Router();
router.get('/', c.getApproved);
router.get('/pending', requireAdmin, c.getPending);
router.post('/', uploadImage, c.create);
router.put('/:id/approve', requireAdmin, c.approve);
router.delete('/:id/reject', requireAdmin, c.reject);
export default router;
