import { query } from '../config/db.js';

class ServiceModel {
  async createCategory(data) {
    const { name, slug, description, icon, sort_order } = data;
    const sql = `INSERT INTO service_categories (name, slug, description, icon, sort_order) VALUES ($1, $2, $3, $4, $5) RETURNING *;`;
    const result = await query(sql, [name, slug, description || null, icon || null, sort_order || 0]);
    return result.rows[0];
  }

  async findAllCategories(activeOnly = false) {
    let sql = `SELECT * FROM service_categories`;
    if (activeOnly) sql += ` WHERE is_active = true`;
    sql += ` ORDER BY sort_order ASC, name ASC`;
    const result = await query(sql);
    return result.rows;
  }

  async updateCategory(id, data) {
    const fields = [], values = [];
    let idx = 1;
    for (const f of ['name', 'slug', 'description', 'icon', 'sort_order', 'is_active']) {
      if (data[f] !== undefined) { fields.push(`${f} = $${idx++}`); values.push(data[f]); }
    }
    if (!fields.length) return null;
    values.push(id);
    const result = await query(`UPDATE service_categories SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *;`, values);
    return result.rows[0];
  }

  async create(data) {
    const { category_id, name, slug, short_description, full_description, image_url, is_featured, sort_order } = data;
    const sql = `INSERT INTO services (category_id, name, slug, short_description, full_description, image_url, is_featured, sort_order) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *;`;
    const result = await query(sql, [category_id||null, name, slug, short_description||null, full_description||null, image_url||null, is_featured||false, sort_order||0]);
    return result.rows[0];
  }

  async findById(id) {
    const sql = `SELECT s.*, sc.name as category_name FROM services s LEFT JOIN service_categories sc ON s.category_id = sc.id WHERE s.id = $1;`;
    const result = await query(sql, [id]);
    return result.rows[0];
  }

  async findBySlug(slug) {
    const sql = `SELECT s.*, sc.name as category_name FROM services s LEFT JOIN service_categories sc ON s.category_id = sc.id WHERE s.slug = $1;`;
    const result = await query(sql, [slug]);
    return result.rows[0];
  }

  async findAll(filters = {}) {
    let sql = `SELECT s.*, sc.name as category_name FROM services s LEFT JOIN service_categories sc ON s.category_id = sc.id WHERE 1=1`;
    const params = [];
    let idx = 1;
    if (filters.category_id) { sql += ` AND s.category_id = $${idx++}`; params.push(filters.category_id); }
    if (filters.is_featured !== undefined) { sql += ` AND s.is_featured = $${idx++}`; params.push(filters.is_featured); }
    if (filters.is_active !== undefined) { sql += ` AND s.is_active = $${idx++}`; params.push(filters.is_active); }
    sql += ` ORDER BY s.sort_order ASC, s.name ASC`;
    const result = await query(sql, params);
    return result.rows;
  }

  async update(id, data) {
    const fields = [], values = [];
    let idx = 1;
    for (const f of ['category_id','name','slug','short_description','full_description','image_url','is_featured','is_active','sort_order']) {
      if (data[f] !== undefined) { fields.push(`${f} = $${idx++}`); values.push(data[f]); }
    }
    if (!fields.length) return this.findById(id);
    values.push(id);
    const result = await query(`UPDATE services SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *;`, values);
    return result.rows[0];
  }

  async delete(id) {
    const result = await query(`DELETE FROM services WHERE id = $1 RETURNING *;`, [id]);
    return result.rows[0];
  }
}

export default new ServiceModel();
