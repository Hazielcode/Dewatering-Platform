import { query } from '../config/db.js';

class DocumentModel {
  async create(data) {
    const { title, description, category, file_url, file_size, file_type, is_public, project_id, product_id, uploaded_by } = data;
    const sql = `INSERT INTO documents (title, description, category, file_url, file_size, file_type, is_public, project_id, product_id, uploaded_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *;`;
    const result = await query(sql, [title, description||null, category||'OTHER', file_url, file_size||null, file_type||null, is_public||false, project_id||null, product_id||null, uploaded_by]);
    return result.rows[0];
  }

  async findById(id) {
    const sql = `SELECT d.*, u.full_name as uploaded_by_name, p.name as product_name, pr.title as project_title FROM documents d LEFT JOIN users u ON d.uploaded_by = u.id LEFT JOIN products p ON d.product_id = p.id LEFT JOIN projects pr ON d.project_id = pr.id WHERE d.id = $1;`;
    const result = await query(sql, [id]);
    return result.rows[0];
  }

  async findAll(filters = {}) {
    let sql = `SELECT d.*, u.full_name as uploaded_by_name FROM documents d LEFT JOIN users u ON d.uploaded_by = u.id WHERE 1=1`;
    const params = [];
    let idx = 1;
    if (filters.category) { sql += ` AND d.category = $${idx++}`; params.push(filters.category); }
    if (filters.is_public !== undefined) { sql += ` AND d.is_public = $${idx++}`; params.push(filters.is_public); }
    if (filters.project_id) { sql += ` AND d.project_id = $${idx++}`; params.push(filters.project_id); }
    if (filters.product_id) { sql += ` AND d.product_id = $${idx++}`; params.push(filters.product_id); }
    if (filters.search) { sql += ` AND (d.title ILIKE $${idx} OR d.description ILIKE $${idx})`; params.push(`%${filters.search}%`); idx++; }
    sql += ` ORDER BY d.created_at DESC`;
    if (filters.limit) { sql += ` LIMIT $${idx++}`; params.push(filters.limit); }
    const result = await query(sql, params);
    return result.rows;
  }

  async update(id, data) {
    const fields = [], values = [];
    let idx = 1;
    for (const f of ['title','description','category','file_url','is_public','project_id','product_id']) {
      if (data[f] !== undefined) { fields.push(`${f} = $${idx++}`); values.push(data[f]); }
    }
    if (!fields.length) return this.findById(id);
    values.push(id);
    const result = await query(`UPDATE documents SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *;`, values);
    return result.rows[0];
  }

  async delete(id) {
    const result = await query(`DELETE FROM documents WHERE id = $1 RETURNING *;`, [id]);
    return result.rows[0];
  }

  async incrementDownload(id) {
    const result = await query(`UPDATE documents SET download_count = download_count + 1 WHERE id = $1 RETURNING *;`, [id]);
    return result.rows[0];
  }
}

export default new DocumentModel();
