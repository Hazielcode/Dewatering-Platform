import { Router } from 'express';
import * as prodCtrl from '../controllers/productController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/rbacMiddleware.js';

const router = Router();

// Rutas públicas — catálogo de equipos
router.get('/', prodCtrl.getAll);
router.get('/categories', prodCtrl.getCategories);
router.get('/slug/:slug', prodCtrl.getBySlug);
router.get('/:id', prodCtrl.getById);

// Rutas protegidas — admin
router.post('/', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN']), prodCtrl.create);
router.put('/:id', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN']), prodCtrl.update);
router.delete('/:id', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN']), prodCtrl.remove);

export default router;
