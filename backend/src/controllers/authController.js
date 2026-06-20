import authService from '../services/authService.js';
import auditService from '../services/auditService.js';

export const register = async (req, res, next) => {
  try {
    const newUser = await authService.register(req.body);
    await auditService.log(req, 'REGISTER', 'USER', newUser.id, null, { email: newUser.email, role: newUser.role });
    res.status(201).json({ message: 'Usuario registrado exitosamente.', user: newUser });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y password son obligatorios.' });
    }
    const result = await authService.login(email, password);
    
    if (result.mfaRequired) {
      return res.status(202).json({ mfaRequired: true, userId: result.userId, email: result.email });
    }

    await auditService.log(req, 'LOGIN', 'USER', result.user.id, null, { email: result.user.email });
    res.json({ message: 'Login exitoso.', token: result.token, user: result.user });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const userModel = (await import('../models/userModel.js')).default;
    const user = await userModel.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado.' });
    res.json({ user });
  } catch (error) {
    next(error);
  }
};
