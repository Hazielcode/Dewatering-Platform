import quotationModel from '../models/quotationModel.js';
import auditService from '../services/auditService.js';

export const create = async (req, res, next) => {
  try {
    const quotation_number = await quotationModel.getNextNumber();
    const data = { ...req.body, quotation_number, created_by: req.user.userId };
    const quotation = await quotationModel.create(data);
    await auditService.log(req, 'CREATE', 'QUOTATION', quotation.id, null, quotation);
    res.status(201).json({ message: 'Cotización creada.', quotation });
  } catch (error) { next(error); }
};

export const getAll = async (req, res, next) => {
  try {
    const quotations = await quotationModel.findAll(req.query);
    res.json({ quotations });
  } catch (error) { next(error); }
};

export const getById = async (req, res, next) => {
  try {
    const quotation = await quotationModel.findById(req.params.id);
    if (!quotation) return res.status(404).json({ error: 'Cotización no encontrada.' });
    res.json({ quotation });
  } catch (error) { next(error); }
};

export const update = async (req, res, next) => {
  try {
    const old = await quotationModel.findById(req.params.id);
    if (!old) return res.status(404).json({ error: 'Cotización no encontrada.' });
    const quotation = await quotationModel.update(req.params.id, req.body);
    await auditService.log(req, 'UPDATE', 'QUOTATION', quotation.id, old, quotation);
    res.json({ message: 'Cotización actualizada.', quotation });
  } catch (error) { next(error); }
};

export const remove = async (req, res, next) => {
  try {
    const quotation = await quotationModel.delete(req.params.id);
    if (!quotation) return res.status(404).json({ error: 'Cotización no encontrada.' });
    await auditService.log(req, 'DELETE', 'QUOTATION', quotation.id, quotation, null);
    res.json({ message: 'Cotización eliminada.' });
  } catch (error) { next(error); }
};

export const getStats = async (req, res, next) => {
  try {
    const stats = await quotationModel.getStats();
    res.json({ stats });
  } catch (error) { next(error); }
};
