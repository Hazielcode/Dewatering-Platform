import productModel from '../models/productModel.js';
import auditService from '../services/auditService.js';

export const create = async (req, res, next) => {
  try {
    const product = await productModel.create(req.body);
    await auditService.log(req, 'CREATE', 'PRODUCT', product.id, null, product);
    res.status(201).json({ message: 'Producto creado.', product });
  } catch (error) { next(error); }
};

export const getAll = async (req, res, next) => {
  try {
    const products = await productModel.findAll(req.query);
    res.json({ products });
  } catch (error) { next(error); }
};

export const getById = async (req, res, next) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado.' });
    res.json({ product });
  } catch (error) { next(error); }
};

export const getBySlug = async (req, res, next) => {
  try {
    const product = await productModel.findBySlug(req.params.slug);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado.' });
    res.json({ product });
  } catch (error) { next(error); }
};

export const update = async (req, res, next) => {
  try {
    const product = await productModel.update(req.params.id, req.body);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado.' });
    res.json({ message: 'Producto actualizado.', product });
  } catch (error) { next(error); }
};

export const remove = async (req, res, next) => {
  try {
    const product = await productModel.delete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado.' });
    await auditService.log(req, 'DELETE', 'PRODUCT', product.id, product, null);
    res.json({ message: 'Producto eliminado.' });
  } catch (error) { next(error); }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await productModel.getCategories();
    res.json({ categories });
  } catch (error) { next(error); }
};
