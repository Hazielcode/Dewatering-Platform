import { Router } from 'express';
import * as quotCtrl from '../controllers/quotationController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/rbacMiddleware.js';

const router = Router();
router.use(requireAuth);

router.get('/', requireRole(['SUPER_ADMIN', 'ADMIN', 'COMMERCIAL']), quotCtrl.getAll);
router.get('/stats', requireRole(['SUPER_ADMIN', 'ADMIN', 'COMMERCIAL']), quotCtrl.getStats);
router.get('/:id', requireRole(['SUPER_ADMIN', 'ADMIN', 'COMMERCIAL']), quotCtrl.getById);
router.post('/', requireRole(['SUPER_ADMIN', 'ADMIN', 'COMMERCIAL']), quotCtrl.create);
router.put('/:id', requireRole(['SUPER_ADMIN', 'ADMIN', 'COMMERCIAL']), quotCtrl.update);
router.delete('/:id', requireRole(['SUPER_ADMIN', 'ADMIN']), quotCtrl.remove);

export default router;
