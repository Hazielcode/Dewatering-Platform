import { query } from '../config/db.js';

class LeadModel {
  async create(lead) {
    const {
      contact_name, contact_email, contact_phone, company_name,
      company_sector, source, service_interest, message, priority
    } = lead;

    const sql = `
      INSERT INTO leads (contact_name, contact_email, contact_phone, company_name, company_sector, source, service_interest, message, priority)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;
    const result = await query(sql, [
      contact_name, contact_email, contact_phone || null,
      company_name || null, company_sector || null,
      source || 'WEB', service_interest || null, message || null,
      priority || 'MEDIUM'
    ]);
    return result.rows[0];
  }

  async findById(id) {
    const sql = `
      SELECT l.*, u.full_name as assigned_name, u.email as assigned_email
      FROM leads l
      LEFT JOIN users u ON l.assigned_to = u.id
      WHERE l.id = $1;
    `;
    const result = await query(sql, [id]);
    return result.rows[0];
  }

  async findAll(filters = {}) {
    let sql = `
      SELECT l.*, u.full_name as assigned_name
      FROM leads l
      LEFT JOIN users u ON l.assigned_to = u.id
      WHERE 1=1
    `;
    const params = [];
    let idx = 1;

    if (filters.status) {
      sql += ` AND l.status = $${idx++}`;
      params.push(filters.status);
    }
    if (filters.priority) {
      sql += ` AND l.priority = $${idx++}`;
      params.push(filters.priority);
    }
    if (filters.assigned_to) {
      sql += ` AND l.assigned_to = $${idx++}`;
      params.push(filters.assigned_to);
    }
    if (filters.source) {
      sql += ` AND l.source = $${idx++}`;
      params.push(filters.source);
    }
    if (filters.search) {
      sql += ` AND (l.contact_name ILIKE $${idx} OR l.contact_email ILIKE $${idx} OR l.company_name ILIKE $${idx})`;
      params.push(`%${filters.search}%`);
      idx++;
    }

    sql += ` ORDER BY l.created_at DESC`;

    if (filters.limit) {
      sql += ` LIMIT $${idx++}`;
      params.push(filters.limit);
    }
    if (filters.offset) {
      sql += ` OFFSET $${idx++}`;
      params.push(filters.offset);
    }

    const result = await query(sql, params);
    return result.rows;
  }

  async update(id, data) {
    const fields = [];
    const values = [];
    let idx = 1;

    const allowed = [
      'contact_name', 'contact_email', 'contact_phone', 'company_name',
      'company_sector', 'source', 'service_interest', 'message',
      'status', 'assigned_to', 'priority', 'next_follow_up', 'lost_reason'
    ];

    for (const field of allowed) {
      if (data[field] !== undefined) {
        fields.push(`${field} = $${idx++}`);
        values.push(data[field]);
      }
    }

    if (fields.length === 0) return this.findById(id);

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const sql = `UPDATE leads SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *;`;
    const result = await query(sql, values);
    return result.rows[0];
  }

  async delete(id) {
    const sql = `DELETE FROM leads WHERE id = $1 RETURNING *;`;
    const result = await query(sql, [id]);
    return result.rows[0];
  }

  async getStats() {
    const sql = `
      SELECT
        COUNT(*)::int as total,
        COUNT(*) FILTER (WHERE status = 'NEW')::int as nuevos,
        COUNT(*) FILTER (WHERE status = 'CONTACTED')::int as contactados,
        COUNT(*) FILTER (WHERE status = 'PROPOSAL')::int as propuesta,
        COUNT(*) FILTER (WHERE status = 'WON')::int as ganados,
        COUNT(*) FILTER (WHERE status = 'LOST')::int as perdidos,
        COUNT(*) FILTER (WHERE priority = 'URGENT')::int as urgentes
      FROM leads;
    `;
    const result = await query(sql);
    return result.rows[0];
  }

  async getByPipeline() {
    const sql = `
      SELECT status, COUNT(*)::int as count
      FROM leads
      GROUP BY status
      ORDER BY CASE status
        WHEN 'NEW' THEN 1 WHEN 'CONTACTED' THEN 2 WHEN 'EVALUATING' THEN 3
        WHEN 'PROPOSAL' THEN 4 WHEN 'NEGOTIATION' THEN 5 WHEN 'WON' THEN 6 WHEN 'LOST' THEN 7
      END;
    `;
    const result = await query(sql);
    return result.rows;
  }
}

export default new LeadModel();
