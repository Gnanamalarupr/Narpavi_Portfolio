import { Router } from 'express';
import { get } from '../controllers/site.controller.js';
const router = Router(); router.get('/', get); export default router;
