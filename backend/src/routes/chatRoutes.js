import express from 'express';
import { chatWithBot } from '../controllers/chatController.js';

const router = express.Router();

// Ruta pública: Todos los visitantes pueden hablar con la IA
router.post('/', chatWithBot);

export default router;
