import documentModel from '../models/documentModel.js';
import auditService from '../services/auditService.js';

export const create = async (req, res, next) => {
  try {
    const data = { ...req.body, uploaded_by: req.user.userId };
    const doc = await documentModel.create(data);
    await auditService.log(req, 'CREATE', 'DOCUMENT', doc.id, null, doc);
    res.status(201).json({ message: 'Documento creado.', document: doc });
  } catch (error) { next(error); }
};

export const getAll = async (req, res, next) => {
  try {
    const documents = await documentModel.findAll(req.query);
    res.json({ documents });
  } catch (error) { next(error); }
};

export const getById = async (req, res, next) => {
  try {
    const doc = await documentModel.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Documento no encontrado.' });
    res.json({ document: doc });
  } catch (error) { next(error); }
};

export const update = async (req, res, next) => {
  try {
    const doc = await documentModel.update(req.params.id, req.body);
    if (!doc) return res.status(404).json({ error: 'Documento no encontrado.' });
    res.json({ message: 'Documento actualizado.', document: doc });
  } catch (error) { next(error); }
};

export const remove = async (req, res, next) => {
  try {
    const doc = await documentModel.delete(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Documento no encontrado.' });
    await auditService.log(req, 'DELETE', 'DOCUMENT', doc.id, doc, null);
    res.json({ message: 'Documento eliminado.' });
  } catch (error) { next(error); }
};

export const download = async (req, res, next) => {
  try {
    const doc = await documentModel.incrementDownload(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Documento no encontrado.' });
    res.json({ document: doc });
  } catch (error) { next(error); }
};
