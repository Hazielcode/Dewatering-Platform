import { Router } from 'express';
import * as svcCtrl from '../controllers/serviceController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/rbacMiddleware.js';

const router = Router();

// Rutas públicas — catálogo visible sin login
router.get('/categories', svcCtrl.getCategories);
router.get('/', svcCtrl.getAll);
router.get('/slug/:slug', svcCtrl.getBySlug);
router.get('/:id', svcCtrl.getById);

// Rutas protegidas — solo admin puede crear/editar
router.post('/categories', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN']), svcCtrl.createCategory);
router.put('/categories/:id', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN']), svcCtrl.updateCategory);
router.post('/', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN']), svcCtrl.create);
router.put('/:id', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN']), svcCtrl.update);
router.delete('/:id', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN']), svcCtrl.remove);

export default router;
