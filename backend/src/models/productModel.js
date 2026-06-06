import { query } from '../config/db.js';

class ProductModel {
  async create(data) {
    const { name, slug, category, short_description, full_description, specifications, origin, image_urls, datasheet_url, sort_order } = data;
    const sql = `INSERT INTO products (name, slug, category, short_description, full_description, specifications, origin, image_urls, datasheet_url, sort_order) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *;`;
    const result = await query(sql, [name, slug, category||null, short_description||null, full_description||null, specifications ? JSON.stringify(specifications) : null, origin||null, image_urls||null, datasheet_url||null, sort_order||0]);
    return result.rows[0];
  }

  async findById(id) {
    const result = await query(`SELECT * FROM products WHERE id = $1;`, [id]);
    return result.rows[0];
  }

  async findBySlug(slug) {
    const result = await query(`SELECT * FROM products WHERE slug = $1;`, [slug]);
    return result.rows[0];
  }

  async findAll(filters = {}) {
    let sql = `SELECT * FROM products WHERE 1=1`;
    const params = [];
    let idx = 1;
    if (filters.category) { sql += ` AND category = $${idx++}`; params.push(filters.category); }
    if (filters.is_active !== undefined) { sql += ` AND is_active = $${idx++}`; params.push(filters.is_active); }
    if (filters.search) { sql += ` AND (name ILIKE $${idx} OR category ILIKE $${idx} OR origin ILIKE $${idx})`; params.push(`%${filters.search}%`); idx++; }
    sql += ` ORDER BY sort_order ASC, name ASC`;
    const result = await query(sql, params);
    return result.rows;
  }

  async update(id, data) {
    const fields = [], values = [];
    let idx = 1;
    for (const f of ['name','slug','category','short_description','full_description','specifications','origin','image_urls','datasheet_url','is_active','sort_order']) {
      if (data[f] !== undefined) { fields.push(`${f} = $${idx++}`); values.push(f === 'specifications' ? JSON.stringify(data[f]) : data[f]); }
    }
    if (!fields.length) return this.findById(id);
    values.push(id);
    const result = await query(`UPDATE products SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *;`, values);
    return result.rows[0];
  }

  async delete(id) {
    const result = await query(`DELETE FROM products WHERE id = $1 RETURNING *;`, [id]);
    return result.rows[0];
  }

  async getCategories() {
    const result = await query(`SELECT DISTINCT category FROM products WHERE category IS NOT NULL ORDER BY category;`);
    return result.rows.map(r => r.category);
  }
}

export default new ProductModel();
