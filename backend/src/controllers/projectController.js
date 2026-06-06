import projectModel from '../models/projectModel.js';
import auditService from '../services/auditService.js';

export const create = async (req, res, next) => {
  try {
    const project_number = await projectModel.getNextNumber();
    const project = await projectModel.create({ ...req.body, project_number });
    await auditService.log(req, 'CREATE', 'PROJECT', project.id, null, project);
    res.status(201).json({ message: 'Proyecto creado.', project });
  } catch (error) { next(error); }
};

export const getAll = async (req, res, next) => {
  try {
    const projects = await projectModel.findAll(req.query);
    res.json({ projects });
  } catch (error) { next(error); }
};

export const getById = async (req, res, next) => {
  try {
    const project = await projectModel.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Proyecto no encontrado.' });
    res.json({ project });
  } catch (error) { next(error); }
};

export const update = async (req, res, next) => {
  try {
    const old = await projectModel.findById(req.params.id);
    if (!old) return res.status(404).json({ error: 'Proyecto no encontrado.' });
    const project = await projectModel.update(req.params.id, req.body);
    await auditService.log(req, 'UPDATE', 'PROJECT', project.id, old, project);
    res.json({ message: 'Proyecto actualizado.', project });
  } catch (error) { next(error); }
};

export const remove = async (req, res, next) => {
  try {
    const project = await projectModel.delete(req.params.id);
    if (!project) return res.status(404).json({ error: 'Proyecto no encontrado.' });
    await auditService.log(req, 'DELETE', 'PROJECT', project.id, project, null);
    res.json({ message: 'Proyecto eliminado.' });
  } catch (error) { next(error); }
};

export const getStats = async (req, res, next) => {
  try {
    const stats = await projectModel.getStats();
    res.json({ stats });
  } catch (error) { next(error); }
};
