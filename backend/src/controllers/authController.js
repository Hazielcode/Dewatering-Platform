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

export const updateProfile = async (req, res, next) => {
  try {
    const userModel = (await import('../models/userModel.js')).default;
    const userId = req.user.userId;
    
    // We extract only the fields that are allowed to be updated by the user
    const { full_name, phone, company, position, backup_email } = req.body;
    
    const updateData = {};
    if (full_name !== undefined) updateData.full_name = full_name;
    if (phone !== undefined) updateData.phone = phone;
    if (company !== undefined) updateData.company = company;
    if (position !== undefined) updateData.position = position;
    if (backup_email !== undefined) updateData.backup_email = backup_email;

    const updatedUser = await userModel.update(userId, updateData);
    if (!updatedUser) return res.status(404).json({ error: 'Usuario no encontrado.' });
    
    res.json({ message: 'Perfil actualizado exitosamente', user: updatedUser });
  } catch (error) {
    next(error);
  }
};

export const checkRecoveryOptions = async (req, res, next) => {
  try {
    const userModel = (await import('../models/userModel.js')).default;
    const { email } = req.body;
    const user = await userModel.findByEmail(email);
    
    if (!user) {
      return res.status(404).json({ error: 'No se encontró ninguna cuenta asociada a este correo corporativo.' });
    }

    let masked_backup = null;
    if (user.backup_email) {
      const [name, domain] = user.backup_email.split('@');
      masked_backup = `${name.charAt(0)}${'*'.repeat(name.length > 2 ? 4 : 2)}${name.slice(-1)}@${domain}`;
    }

    res.json({
      has_backup: !!user.backup_email,
      masked_backup,
      has_mfa: user.mfa_enabled
    });
  } catch (error) {
    next(error);
  }
};
