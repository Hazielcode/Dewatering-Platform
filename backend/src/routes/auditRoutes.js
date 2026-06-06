import { Router } from 'express';
import * as auditCtrl from '../controllers/auditController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/rbacMiddleware.js';

const router = Router();
router.use(requireAuth);
router.use(requireRole(['SUPER_ADMIN', 'ADMIN']));

router.get('/', auditCtrl.getAll);
router.get('/stats', auditCtrl.getStats);

export default router;
