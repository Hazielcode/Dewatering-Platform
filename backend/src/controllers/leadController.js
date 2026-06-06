import leadModel from '../models/leadModel.js';
import auditService from '../services/auditService.js';

export const create = async (req, res, next) => {
  try {
    const lead = await leadModel.create(req.body);
    await auditService.log(req, 'CREATE', 'LEAD', lead.id, null, lead);
    res.status(201).json({ message: 'Lead creado.', lead });
  } catch (error) { next(error); }
};

export const getAll = async (req, res, next) => {
  try {
    const leads = await leadModel.findAll(req.query);
    res.json({ leads });
  } catch (error) { next(error); }
};

export const getById = async (req, res, next) => {
  try {
    const lead = await leadModel.findById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead no encontrado.' });
    res.json({ lead });
  } catch (error) { next(error); }
};

export const update = async (req, res, next) => {
  try {
    const old = await leadModel.findById(req.params.id);
    if (!old) return res.status(404).json({ error: 'Lead no encontrado.' });
    const lead = await leadModel.update(req.params.id, req.body);
    await auditService.log(req, 'UPDATE', 'LEAD', lead.id, old, lead);
    res.json({ message: 'Lead actualizado.', lead });
  } catch (error) { next(error); }
};

export const remove = async (req, res, next) => {
  try {
    const lead = await leadModel.delete(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead no encontrado.' });
    await auditService.log(req, 'DELETE', 'LEAD', lead.id, lead, null);
    res.json({ message: 'Lead eliminado.' });
  } catch (error) { next(error); }
};

export const getStats = async (req, res, next) => {
  try {
    const stats = await leadModel.getStats();
    const pipeline = await leadModel.getByPipeline();
    res.json({ stats, pipeline });
  } catch (error) { next(error); }
};
