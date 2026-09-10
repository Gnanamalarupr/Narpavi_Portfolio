import { Router } from 'express'; import { collection } from '../controllers/catalog.controller.js'; const router=Router(); router.get('/',collection('services.json')); export default router;
