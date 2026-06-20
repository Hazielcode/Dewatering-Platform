import { Router } from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/authController.js';
import { setupMfa, verifySetupMfa, disableMfa, loginMfa } from '../controllers/mfaController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);

// Rutas de Autenticación de Dos Pasos (MFA)
router.post('/mfa/validate', loginMfa);
router.post('/mfa/setup', requireAuth, setupMfa);
router.post('/mfa/enable', requireAuth, verifySetupMfa);
router.post('/mfa/disable', requireAuth, disableMfa);

router.get('/profile', requireAuth, getProfile);
router.put('/profile', requireAuth, updateProfile);

export default router;
