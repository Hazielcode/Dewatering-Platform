import express from 'express';
import { requireAuth, requireRoles } from '../middlewares/authMiddleware.js';
import { trainAI, getTrainedDocs } from '../controllers/aiController.js';

const router = express.Router();

// Rutas protegidas para ADMIN
router.post('/train', requireAuth, requireRoles('SUPER_ADMIN', 'ADMIN'), trainAI);
router.get('/trained-docs', requireAuth, requireRoles('SUPER_ADMIN', 'ADMIN'), getTrainedDocs);

export default router;
