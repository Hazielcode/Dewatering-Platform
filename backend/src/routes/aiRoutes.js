import express from 'express';
import multer from 'multer';
import { requireAuth, requireRoles } from '../middlewares/authMiddleware.js';
import { trainAI, getTrainedDocs, trainFromFile, getTrainingJobs } from '../controllers/aiController.js';

const router = express.Router();

// Configurar multer (almacenar en memoria temporal)
const upload = multer({ storage: multer.memoryStorage() });

// Rutas protegidas para ADMIN
router.post('/train', requireAuth, requireRoles('SUPER_ADMIN', 'ADMIN'), trainAI);
router.post('/train-file', requireAuth, requireRoles('SUPER_ADMIN', 'ADMIN'), upload.single('file'), trainFromFile);
router.get('/trained-docs', requireAuth, requireRoles('SUPER_ADMIN', 'ADMIN'), getTrainedDocs);
router.get('/jobs', requireAuth, requireRoles('SUPER_ADMIN', 'ADMIN'), getTrainingJobs);

export default router;
