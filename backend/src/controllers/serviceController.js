import serviceModel from '../models/serviceModel.js';
import auditService from '../services/auditService.js';

// --- Categorías ---
export const createCategory = async (req, res, next) => {
  try {
    const cat = await serviceModel.createCategory(req.body);
    await auditService.log(req, 'CREATE', 'SERVICE_CATEGORY', cat.id, null, cat);
    res.status(201).json({ message: 'Categoría creada.', category: cat });
  } catch (error) { next(error); }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await serviceModel.findAllCategories(req.query.active === 'true');
    res.json({ categories });
  } catch (error) { next(error); }
};

export const updateCategory = async (req, res, next) => {
  try {
    const cat = await serviceModel.updateCategory(req.params.id, req.body);
    if (!cat) return res.status(404).json({ error: 'Categoría no encontrada.' });
    res.json({ message: 'Categoría actualizada.', category: cat });
  } catch (error) { next(error); }
};

// --- Servicios ---
export const create = async (req, res, next) => {
  try {
    const service = await serviceModel.create(req.body);
    await auditService.log(req, 'CREATE', 'SERVICE', service.id, null, service);
    res.status(201).json({ message: 'Servicio creado.', service });
  } catch (error) { next(error); }
};

export const getAll = async (req, res, next) => {
  try {
    const services = await serviceModel.findAll(req.query);
    res.json({ services });
  } catch (error) { next(error); }
};

export const getById = async (req, res, next) => {
  try {
    const service = await serviceModel.findById(req.params.id);
    if (!service) return res.status(404).json({ error: 'Servicio no encontrado.' });
    res.json({ service });
  } catch (error) { next(error); }
};

export const getBySlug = async (req, res, next) => {
  try {
    const service = await serviceModel.findBySlug(req.params.slug);
    if (!service) return res.status(404).json({ error: 'Servicio no encontrado.' });
    res.json({ service });
  } catch (error) { next(error); }
};

export const update = async (req, res, next) => {
  try {
    const service = await serviceModel.update(req.params.id, req.body);
    if (!service) return res.status(404).json({ error: 'Servicio no encontrado.' });
    res.json({ message: 'Servicio actualizado.', service });
  } catch (error) { next(error); }
};

export const remove = async (req, res, next) => {
  try {
    const service = await serviceModel.delete(req.params.id);
    if (!service) return res.status(404).json({ error: 'Servicio no encontrado.' });
    await auditService.log(req, 'DELETE', 'SERVICE', service.id, service, null);
    res.json({ message: 'Servicio eliminado.' });
  } catch (error) { next(error); }
};
