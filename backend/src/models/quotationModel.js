import { query } from '../config/db.js';

class QuotationModel {
  async create(data) {
    const {
      lead_id, quotation_number, title, description,
      items, subtotal, tax, total, currency, valid_until, created_by
    } = data;

    const sql = `
      INSERT INTO quotations (lead_id, quotation_number, title, description, items, subtotal, tax, total, currency, valid_until, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *;
    `;
    const result = await query(sql, [
      lead_id || null, quotation_number, title, description || null,
      JSON.stringify(items), subtotal, tax, total,
      currency || 'PEN', valid_until || null, created_by
    ]);
    return result.rows[0];
  }

  async findById(id) {
    const sql = `
      SELECT q.*, 
        creator.full_name as created_by_name,
        approver.full_name as approved_by_name,
        l.contact_name as lead_name, l.company_name as lead_company
      FROM quotations q
      LEFT JOIN users creator ON q.created_by = creator.id
      LEFT JOIN users approver ON q.approved_by = approver.id
      LEFT JOIN leads l ON q.lead_id = l.id
      WHERE q.id = $1;
    `;
    const result = await query(sql, [id]);
    return result.rows[0];
  }

  async findAll(filters = {}) {
    let sql = `
      SELECT q.*, creator.full_name as created_by_name, l.contact_name as lead_name, l.company_name as lead_company
      FROM quotations q
      LEFT JOIN users creator ON q.created_by = creator.id
      LEFT JOIN leads l ON q.lead_id = l.id
      WHERE 1=1
    `;
    const params = [];
    let idx = 1;

    if (filters.status) {
      sql += ` AND q.status = $${idx++}`;
      params.push(filters.status);
    }
    if (filters.lead_id) {
      sql += ` AND q.lead_id = $${idx++}`;
      params.push(filters.lead_id);
    }
    if (filters.created_by) {
      sql += ` AND q.created_by = $${idx++}`;
      params.push(filters.created_by);
    }
    if (filters.search) {
      sql += ` AND (q.title ILIKE $${idx} OR q.quotation_number ILIKE $${idx} OR l.contact_name ILIKE $${idx})`;
      params.push(`%${filters.search}%`);
      idx++;
    }

    sql += ` ORDER BY q.created_at DESC`;

    if (filters.limit) {
      sql += ` LIMIT $${idx++}`;
      params.push(filters.limit);
    }

    const result = await query(sql, params);
    return result.rows;
  }

  async update(id, data) {
    const fields = [];
    const values = [];
    let idx = 1;

    const allowed = [
      'title', 'description', 'items', 'subtotal', 'tax', 'total',
      'currency', 'valid_until', 'status', 'pdf_url', 'approved_by', 'version'
    ];

    for (const field of allowed) {
      if (data[field] !== undefined) {
        fields.push(`${field} = $${idx++}`);
        values.push(field === 'items' ? JSON.stringify(data[field]) : data[field]);
      }
    }

    if (fields.length === 0) return this.findById(id);

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const sql = `UPDATE quotations SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *;`;
    const result = await query(sql, values);
    return result.rows[0];
  }

  async delete(id) {
    const sql = `DELETE FROM quotations WHERE id = $1 RETURNING *;`;
    const result = await query(sql, [id]);
    return result.rows[0];
  }

  async getNextNumber() {
    const year = new Date().getFullYear();
    const sql = `SELECT COUNT(*)::int as count FROM quotations WHERE quotation_number LIKE $1;`;
    const result = await query(sql, [`COT-${year}-%`]);
    const next = (result.rows[0].count + 1).toString().padStart(4, '0');
    return `COT-${year}-${next}`;
  }

  async getStats() {
    const sql = `
      SELECT
        COUNT(*)::int as total,
        COUNT(*) FILTER (WHERE status = 'DRAFT')::int as borradores,
        COUNT(*) FILTER (WHERE status = 'SENT')::int as enviadas,
        COUNT(*) FILTER (WHERE status = 'APPROVED')::int as aprobadas,
        COUNT(*) FILTER (WHERE status = 'REJECTED')::int as rechazadas,
        COALESCE(SUM(total) FILTER (WHERE status = 'APPROVED'), 0)::decimal as monto_aprobado
      FROM quotations;
    `;
    const result = await query(sql);
    return result.rows[0];
  }
}

export default new QuotationModel();
