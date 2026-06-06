import { query } from '../config/db.js';

class ProjectModel {
  async create(data) {
    const { quotation_id, client_id, project_number, title, description, start_date, end_date, assigned_engineer } = data;
    const sql = `INSERT INTO projects (quotation_id, client_id, project_number, title, description, start_date, end_date, assigned_engineer) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *;`;
    const result = await query(sql, [quotation_id||null, client_id||null, project_number, title, description||null, start_date||null, end_date||null, assigned_engineer||null]);
    return result.rows[0];
  }

  async findById(id) {
    const sql = `SELECT p.*, c.full_name as client_name, c.company as client_company, e.full_name as engineer_name FROM projects p LEFT JOIN users c ON p.client_id = c.id LEFT JOIN users e ON p.assigned_engineer = e.id WHERE p.id = $1;`;
    const result = await query(sql, [id]);
    return result.rows[0];
  }

  async findAll(filters = {}) {
    let sql = `SELECT p.*, c.full_name as client_name, c.company as client_company, e.full_name as engineer_name FROM projects p LEFT JOIN users c ON p.client_id = c.id LEFT JOIN users e ON p.assigned_engineer = e.id WHERE 1=1`;
    const params = [];
    let idx = 1;
    if (filters.status) { sql += ` AND p.status = $${idx++}`; params.push(filters.status); }
    if (filters.client_id) { sql += ` AND p.client_id = $${idx++}`; params.push(filters.client_id); }
    if (filters.assigned_engineer) { sql += ` AND p.assigned_engineer = $${idx++}`; params.push(filters.assigned_engineer); }
    if (filters.search) { sql += ` AND (p.title ILIKE $${idx} OR p.project_number ILIKE $${idx})`; params.push(`%${filters.search}%`); idx++; }
    sql += ` ORDER BY p.created_at DESC`;
    if (filters.limit) { sql += ` LIMIT $${idx++}`; params.push(filters.limit); }
    const result = await query(sql, params);
    return result.rows;
  }

  async update(id, data) {
    const fields = [], values = [];
    let idx = 1;
    for (const f of ['title','description','status','start_date','end_date','assigned_engineer','client_id']) {
      if (data[f] !== undefined) { fields.push(`${f} = $${idx++}`); values.push(data[f]); }
    }
    if (!fields.length) return this.findById(id);
    fields.push(`updated_at = NOW()`);
    values.push(id);
    const result = await query(`UPDATE projects SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *;`, values);
    return result.rows[0];
  }

  async delete(id) {
    const result = await query(`DELETE FROM projects WHERE id = $1 RETURNING *;`, [id]);
    return result.rows[0];
  }

  async getNextNumber() {
    const year = new Date().getFullYear();
    const result = await query(`SELECT COUNT(*)::int as count FROM projects WHERE project_number LIKE $1;`, [`PRJ-${year}-%`]);
    const next = (result.rows[0].count + 1).toString().padStart(4, '0');
    return `PRJ-${year}-${next}`;
  }

  async getStats() {
    const result = await query(`SELECT COUNT(*)::int as total, COUNT(*) FILTER (WHERE status='PLANNING')::int as planificados, COUNT(*) FILTER (WHERE status='IN_PROGRESS')::int as en_progreso, COUNT(*) FILTER (WHERE status='COMPLETED')::int as completados FROM projects;`);
    return result.rows[0];
  }
}

export default new ProjectModel();
