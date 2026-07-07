import { Router } from 'express';
import * as quotCtrl from '../controllers/quotationController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/rbacMiddleware.js';

const router = Router();
router.use(requireAuth);

router.get('/', requireRole(['SUPER_ADMIN', 'ADMIN', 'COMMERCIAL', 'CLIENT']), quotCtrl.getAll);
router.get('/stats', requireRole(['SUPER_ADMIN', 'ADMIN', 'COMMERCIAL']), quotCtrl.getStats);
router.get('/:id', requireRole(['SUPER_ADMIN', 'ADMIN', 'COMMERCIAL', 'CLIENT']), quotCtrl.getById);
router.post('/', requireRole(['SUPER_ADMIN', 'ADMIN', 'COMMERCIAL']), quotCtrl.create);
router.put('/:id', requireRole(['SUPER_ADMIN', 'ADMIN', 'COMMERCIAL']), quotCtrl.update);
router.patch('/:id/status', requireRole(['SUPER_ADMIN', 'ADMIN', 'COMMERCIAL', 'CLIENT']), quotCtrl.updateStatus);
router.delete('/:id', requireRole(['SUPER_ADMIN', 'ADMIN']), quotCtrl.remove);

// PDF Download Route
router.get('/:id/pdf', requireRole(['SUPER_ADMIN', 'ADMIN', 'COMMERCIAL', 'CLIENT']), quotCtrl.downloadPDF);

export default router;
