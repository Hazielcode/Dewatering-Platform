import auditModel from '../models/auditModel.js';

export const getAll = async (req, res, next) => {
  try {
    const logs = await auditModel.findAll(req.query);
    res.json({ logs });
  } catch (error) { next(error); }
};

export const getStats = async (req, res, next) => {
  try {
    const stats = await auditModel.getStats();
    res.json({ stats });
  } catch (error) { next(error); }
};
