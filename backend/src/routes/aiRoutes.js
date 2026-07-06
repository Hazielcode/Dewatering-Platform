import express from 'express';
import multer from 'multer';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/rbacMiddleware.js';
import { trainAI, getTrainedDocs, trainFromFile, getTrainingJobs, deleteTrainedDoc, deleteJob } from '../controllers/aiController.js';

const router = express.Router();

// Configurar multer (almacenar en memoria temporal)
const upload = multer({ storage: multer.memoryStorage() });

// Rutas protegidas para ADMIN
router.post('/train', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN']), trainAI);
router.post('/train-file', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN']), upload.single('file'), trainFromFile);
router.get('/trained-docs', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN']), getTrainedDocs);
router.get('/jobs', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN']), getTrainingJobs);
router.delete('/trained-docs/:id', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN']), deleteTrainedDoc);
router.delete('/jobs/:id', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN']), deleteJob);

export default router;
