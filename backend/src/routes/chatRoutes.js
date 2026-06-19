import express from 'express';
import { chatWithBot } from '../controllers/chatController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Ruta protegida: Solo usuarios autenticados pueden hablar con la IA
router.post('/', requireAuth, chatWithBot);

export default router;
